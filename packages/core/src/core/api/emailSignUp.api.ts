import { EmailSignUpApiResponse, EmailSignUpPayload } from '../../types/api.types.js';
import { ParsedAuthioConfig } from '../../types/config.js';
import { hashPassword } from '../../utils/password.js';
import { AuthioError } from '../authioError.js';

export async function emailSignUp(
   payload: EmailSignUpPayload,
   ctx: ParsedAuthioConfig,
): EmailSignUpApiResponse {
   if (!payload.name || !payload.email || !payload.password) {
      throw new AuthioError('MISSING_FIELDS', 'plesse fill all the missing fields');
   }

   if (!ctx.emailAndPassword?.enabled) {
      throw new AuthioError(
         'EMAIL_PASSWORD_DISABLED',
         'Enable emailAndPassword in your config to use email signup',
      );
   }

   if (payload.password.length < ctx.emailAndPassword.minPasswordLength) {
      throw new AuthioError(
         'PASSWORD_TOO_SHORT',
         `Password must be at least ${ctx.emailAndPassword.minPasswordLength} characters`,
      );
   }

   const existingUser = await ctx.database.findUserByEmail(payload.email);
   if (existingUser) {
      throw new AuthioError('USER_ALREADY_EXISTS', 'A user with this email already exists');
   }

   const hashedPassword = await hashPassword(payload.password);

   // with email verification
   if (ctx.emailAndPassword.verifyEmail && ctx.emailAndPassword.verificationCallback) {
      const user = await ctx.database.createUser({
         email: payload.email,
         name: payload.name,
         emailVerified: false,
         image: null,
      });

      await ctx.database.createAccount({
         userId: user.id,
         accountId: user.id,
         accessToken: null,
         refreshToken: null,
         accessTokenExpiresAt: null,
         refreshTokenExpiresAt: null,
         scope: null,
         idToken: null,
         password: hashedPassword,
         providerId: 'email',
      });

      const verification = await ctx.database.createVerification({
         identifier: user.email,
         expiresAt: new Date(Date.now() + ctx.emailAndPassword.verificationTokenExpiry),
      });
      //call the verification callback provided by the user. I am letting the user decide how to share the token with the user
      await ctx.emailAndPassword.verificationCallback({
         name: user.name,
         email: user.email,
         verificationToken: verification.value,
      });

      return {
         code: 'VERIFICATION_SENT',
         message: 'User created, verification email sent',
         session: null,
         user,
      };
   }

   // without email verification
   const user = await ctx.database.createUser({
      email: payload.email,
      name: payload.name,
      emailVerified: true,
      image: null,
   });

   await ctx.database.createAccount({
      userId: user.id,
      accountId: user.id,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      idToken: null,
      password: hashedPassword,
      providerId: 'email',
   });

   if (ctx.emailAndPassword.autoSignIn) {
      const session = await ctx.database.createSession({
         userId: user.id,
         token: crypto.randomUUID(),
         expiresAt: new Date(Date.now() + ctx.session.expiry),
         userAgent: payload.meta?.userAgent ?? null,
         ipAddress: payload.meta?.ipAddress ?? null,
      });

      return {
         code: 'SIGNUP_SUCCESS_AND_AUTO_SIGNIN',
         message: 'User created and signed in',
         session,
         user,
      };
   }

   return {
      code: 'SIGNUP_SUCCESS',
      message: 'User created successfully',
      session: null,
      user,
   };
}
