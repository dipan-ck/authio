import { OauthCallbackApiResponse, OauthCallbackPayload } from '../../types/api.types.js';
import { ParsedAuthioConfig } from '../../types/config.js';
import { AuthioError } from '../authioError.js';

export async function oauthCallback(
   payload: OauthCallbackPayload,
   ctx: ParsedAuthioConfig,
): OauthCallbackApiResponse {
   const oauthProvider = ctx?.socialProviders?.[payload.id];
   if (!oauthProvider) {
      throw new AuthioError('PROVIDER_NOT_CONFIGURED', `${payload.id} provider is not configured`);
   }

   const redirectUrl = `${ctx.baseUrl}/api/auth/${payload.id}/callback`;

   // exchange code for tokens
   const tokens = await oauthProvider.exchangeCode(payload.code, redirectUrl);

   // get user info from provider
   const oauthUser = await oauthProvider.getUserInfo(tokens);

   // find or create user
   let user = await ctx.database.findUserByEmail(oauthUser.email);
   if (!user) {
      // new user — create user and account
      user = await ctx.database.createUser({
         email: oauthUser.email,
         name: oauthUser.name,
         image: oauthUser.image,
         emailVerified: oauthUser.emailVerified,
      });

      await ctx.database.createAccount({
         userId: user.id,
         accountId: oauthUser.id,
         providerId: payload.id,
         accessToken: tokens.accessToken,
         refreshToken: tokens.refreshToken,
         idToken: tokens.idToken,
         accessTokenExpiresAt: tokens.expiresIn
            ? new Date(Date.now() + tokens.expiresIn * 1000)
            : null,
         refreshTokenExpiresAt: null,
         scope: tokens.scope,
         password: null,
      });
   } else {
      // existing user — update their tokens
      const account = await ctx.database.findAccountByUserId(user.id, payload.id);
      if (!account) {
         // user exists but no account for this provider yet — create it
         await ctx.database.createAccount({
            userId: user.id,
            accountId: oauthUser.id,
            providerId: payload.id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            idToken: tokens.idToken,
            accessTokenExpiresAt: tokens.expiresIn
               ? new Date(Date.now() + tokens.expiresIn * 1000) //google return expire time in seconds so  * 1000 converts to ms
               : null,
            refreshTokenExpiresAt: null,
            scope: tokens.scope,
            password: null,
         });
      } else {
         // account exists — update tokens
         await ctx.database.updateAccount(account.id, {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            accessTokenExpiresAt: tokens.expiresIn
               ? new Date(Date.now() + tokens.expiresIn * 1000)
               : null,
            scope: tokens.scope,
         });
      }
   }

   // create session
   const session = await ctx.database.createSession({
      userId: user.id,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + ctx.session.expiry),
      userAgent: payload.meta?.userAgent ?? null,
      ipAddress: payload.meta?.ipAddress ?? null,
   });

   return {
      code: 'OAUTH_SUCCESS',
      message: `Signed in with ${payload.id} successfully`,
      session,
      user,
      redirectUrl: oauthUser.redirectUrl,
   };
}
