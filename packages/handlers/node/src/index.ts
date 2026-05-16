import { Authio, AuthioError, SupportedSocialProvidersType } from '@authio/core';
import { NextFunction, Request, Response } from 'express';
import { sendError } from './utils/error.js';
import { isSupportedProvider } from './utils/supportedProvider.js';

export function toNodeHandler(auth: Authio) {
   if (!auth) {
      throw new AuthioError('INVALID_AUTHIO_CONFIG', 'Please provide a valid Authio instance');
   }

   return async function (req: Request, res: Response, next: NextFunction) {
      const { path, method } = req;
      // not blocking any non auth paths
      if (!path.startsWith('/api/auth')) {
         return next();
      }

      // ── POST /api/auth/signup ──────────────────────────────────────────────
      if (path === '/api/auth/signup' && method === 'POST') {
         try {
            const { name, email, password } = req.body;

            const result = await auth.api.emailSignUp({
               name,
               email,
               password,
               meta: {
                  userAgent: req.headers['user-agent'],
                  ipAddress: req.ip,
               },
            });

            //result will be VERIFICATION__SENT when in config user has emailVerification to true. the verification callback has been called and then the result got returned
            if (result.code === 'VERIFICATION_SENT') {
               return res.status(201).json(result);
            }
            //on auto signin the session will be created and should be set as cookie
            if (result.code === 'SIGNUP_SUCCESS_AND_AUTO_SIGNIN' && 'session' in result) {
               res.cookie(auth.config.cookies.name, result.session?.token, {
                  httpOnly: true,
                  secure: auth.config.cookies.secure,
                  sameSite: auth.config.cookies.sameSite,
                  domain: auth.config.cookies.domain,
                  expires: result.session?.expiresAt,
               });
               return res.status(201).json(result);
            } else {
               // auto signin not enabled so only send the success response
               return res.status(201).json(result);
            }
         } catch (err) {
            return sendError(res, err);
         }
      }

      // ── POST /api/auth/signin ──────────────────────────────────────────────
      if (path === '/api/auth/signin' && method === 'POST') {
         try {
            const { email, password } = req.body;
            const result = await auth.api.emailSignIn({
               email,
               password,
               meta: {
                  ipAddress: req.ip,
                  userAgent: req.headers['user-agent'],
               },
            });

            // signin always returns a session — set the cookie
            res.cookie(auth.config.cookies.name, result.session.token, {
               httpOnly: true,
               secure: auth.config.cookies.secure,
               sameSite: auth.config.cookies.sameSite,
               domain: auth.config.cookies.domain,
               expires: result.session.expiresAt,
            });

            return res.status(200).json(result);
         } catch (err) {
            return sendError(res, err);
         }
      }
      // ── GET /api/auth/verify-email?token=xxx ──────────────────────────────
      if (path === '/api/auth/verify-email' && method === 'GET') {
         try {
            const { token } = req.query as { token?: string };

            if (!token) {
               return res.status(400).json({
                  code: 'MISSING_TOKEN',
                  error: 'Missing verification token',
               });
            }

            const result = await auth.api.verifyEmail({ token });

            // EMAIL_VERIFIED with autoSignIn — session created, set the cookie
            if (result.code === 'EMAIL_VERIFIED' && 'session' in result) {
               res.cookie(auth.config.cookies.name, result.session?.token, {
                  httpOnly: true,
                  secure: auth.config.cookies.secure,
                  sameSite: auth.config.cookies.sameSite,
                  domain: auth.config.cookies.domain,
                  expires: result.session?.expiresAt,
               });
               return res.status(200).json(result);
            }

            // EMAIL_VERIFIED without autoSignIn — no session, just return success
            return res.status(200).json(result);
         } catch (err) {
            return sendError(res, err);
         }
      }

      // ── POST /api/auth/forgot-password ────────────────────────────────────
      if (path === '/api/auth/forgot-password' && method === 'POST') {
         try {
            const { email } = req.body;

            if (!email) {
               return res.status(400).json({
                  code: 'MISSING_EMAIL',
                  error: 'Email is required',
               });
            }

            const result = await auth.api.forgotPassword({ email });

            // always return 200 with the same message regardless of whether the user exists
            // this prevents user enumeration — attacker cannot tell if email is registered
            //  also the forget password callback provided by the user will be called and then result is returned
            return res.status(200).json(result);
         } catch (err) {
            return sendError(res, err);
         }
      }

      // ── POST /api/auth/reset-password ─────────────────────────────────────
      // resets the user's password using the token sent to their email
      if (path === '/api/auth/reset-password' && method === 'POST') {
         try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
               return res.status(400).json({
                  code: 'MISSING_FIELDS',
                  error: 'token and newPassword are required',
               });
            }

            const result = await auth.api.resetPassword({ token, newPassword });

            // all sessions were invalidated — clear the session cookie too
            // in case the user who reset the password was logged in on this device
            res.clearCookie(auth.config.cookies.name);

            return res.status(200).json(result);
         } catch (err) {
            return sendError(res, err);
         }
      }

      // ── GET /api/auth/session ──────────────────────────────────────────────
      if (path === '/api/auth/session' && method === 'GET') {
         try {
            const token = req.cookies?.[auth.config.cookies.name];

            if (!token) {
               return res.status(401).json({
                  code: 'NO_SESSION',
                  error: 'No session cookie found',
               });
            }

            const result = await auth.api.getSession({ token });
            return res.status(200).json(result);
         } catch (err) {
            return sendError(res, err);
         }
      }

      // ── POST /api/auth/signout ─────────────────────────────────────────────
      if (path === '/api/auth/signout' && method === 'POST') {
         try {
            const token = req.cookies?.[auth.config.cookies.name];

            if (!token) {
               return res.status(401).json({
                  code: 'NO_SESSION',
                  error: 'No session cookie found',
               });
            }
            // session will be revoked
            const result = await auth.api.signout({ token });

            // clear the session cookie from the browser
            res.clearCookie(auth.config.cookies.name);

            return res.status(200).json(result);
         } catch (err) {
            return sendError(res, err);
         }
      }

      // ── DELETE /api/auth/user ────────────────────────────────────────────
      // deletes the currently authenticated user
      if (path === '/api/auth/user' && method === 'DELETE') {
         try {
            const token = req.cookies?.[auth.config.cookies.name];

            if (!token) {
               return res.status(401).json({
                  code: 'NO_SESSION',
                  error: 'No session cookie found',
               });
            }

            const sessionResult = await auth.api.getSession({ token });

            if (!sessionResult || !sessionResult?.user) {
               return res.status(401).json({
                  code: 'INVALID_SESSION',
                  error: 'No session stored',
               });
            }

            const result = await auth.api.deleteUser({ userId: sessionResult?.user.id });

            // clear session cookie after user deletion
            res.clearCookie(auth.config.cookies.name);

            return res.status(200).json(result);
         } catch (err) {
            return sendError(res, err);
         }
      }

      // ── GET /api/auth/:provider/signin ────────────────────────────────────
      // initiates OAuth flow — redirects user to Google or GitHub
      const signinMatch = path.match(/^\/api\/auth\/([\w-]+)\/signin$/);
      if (signinMatch && method === 'GET') {
         const provider = signinMatch[1] as SupportedSocialProvidersType;

         if (!isSupportedProvider(provider, auth.config)) {
            return res.status(400).json({
               code: 'UNSUPPORTED_PROVIDER',
               error: `Unsupported provider: ${provider}`,
            });
         }

         try {
            const { authUrl, state } = await auth.api.oauthRedirectUrl({ id: provider });

            // store state in a short-lived httpOnly cookie for CSRF protection
            // when google redirects back to /callback the browser sends this cookie
            // we compare it against the state in the URL to verify the request is legitimate
            res.cookie(auth.config.internal.oauth.oauthStateCookie.name, state, {
               httpOnly: true,
               secure: auth.config.cookies.secure,
               sameSite: 'lax', // must be lax — strict blocks the cookie on the redirect back from google
               maxAge: 1000 * 60 * 10, // 10 minutes — enough time for user to approve
            });

            return res.redirect(authUrl);
         } catch (err) {
            return sendError(res, err);
         }
      }

      // ── GET /api/auth/:provider/callback ──────────────────────────────────
      // handles the redirect back from Google or GitHub after user approves
      // google/github sends ?code=xxx&state=xxx here
      const callbackMatch = path.match(/^\/api\/auth\/([\w-]+)\/callback$/);
      if (callbackMatch && method === 'GET') {
         const provider = callbackMatch[1] as SupportedSocialProvidersType;

         if (!isSupportedProvider(provider, auth.config)) {
            return res.status(400).json({
               code: 'UNSUPPORTED_PROVIDER',
               error: `Unsupported provider: ${provider}`,
            });
         }

         const { code, state } = req.query as { code?: string; state?: string };

         // ── CSRF check ──────────────────────────────────────────────────────
         // state in the URL came from google — untrusted
         // state in the cookie was set by us in /signin — trusted
         // if they don't match someone is trying to forge a callback
         const storedState = req.cookies?.[auth.config.internal.oauth.oauthStateCookie.name];
         if (!state || !storedState || state !== storedState) {
            return res.status(400).json({
               code: 'INVALID_STATE',
               error: 'Invalid OAuth state — possible CSRF attack',
            });
         }

         if (!code) {
            return res.status(400).json({
               code: 'MISSING_CODE',
               error: 'Missing authorization code',
            });
         }

         try {
            const result = await auth.api.oauthCallback({
               id: provider,
               code,
               meta: {
                  ipAddress: req.ip,
                  userAgent: req.headers['user-agent'],
               },
            });

            // state cookie served its purpose — clear it
            res.clearCookie(auth.config.internal.oauth.oauthStateCookie.name);

            // set the real session cookie
            res.cookie(auth.config.cookies.name, result.session.token, {
               httpOnly: true,
               secure: auth.config.cookies.secure,
               sameSite: auth.config.cookies.sameSite,
               domain: auth.config.cookies.domain,
               expires: result.session.expiresAt,
            });

            // redirect user to the frontend after successful OAuth
            return res.redirect(result?.redirectUrl);
         } catch (err) {
            return sendError(res, err);
         }
      }
   };
}
