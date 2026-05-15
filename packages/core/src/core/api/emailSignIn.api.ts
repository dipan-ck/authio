import { EmailSignInApiResponse, EmailSignInPayload } from '../../types/api.types.js';
import { ParsedAuthioConfig } from '../../types/config.js';
import { comparePassword } from '../../utils/password.js';
import { AuthioError } from '../authioError.js';

export async function emailSignIn(
   payload: EmailSignInPayload,
   ctx: ParsedAuthioConfig,
): EmailSignInApiResponse {
   if (!payload.email || !payload.password) {
      throw new AuthioError('MISSING_FIELDS', 'plesse fill all the missing fields');
   }
   if (!ctx.emailAndPassword?.enabled) {
      throw new AuthioError(
         'EMAIL_PASSWORD_DISABLED',
         'Enable emailAndPassword in your config to use email signin',
      );
   }

   // find user
   const user = await ctx.database.findUserByEmail(payload.email);
   if (!user) {
      throw new AuthioError('INVALID_CREDENTIALS', 'Invalid email or password');
   }

   // find account to get the password hash
   const account = await ctx.database.findAccountByUserId(user.id, 'email');
   if (!account || !account.password) {
      throw new AuthioError('INVALID_CREDENTIALS', 'Invalid email or password');
   }

   // verify password
   const isValid = await comparePassword(payload.password, account.password);
   if (!isValid) {
      throw new AuthioError('INVALID_CREDENTIALS', 'Invalid email or password');
   }

   // check email verified
   if (ctx.emailAndPassword.verifyEmail && !user.emailVerified) {
      throw new AuthioError('EMAIL_NOT_VERIFIED', 'Please verify your email before signing in');
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
      code: 'SIGNIN_SUCCESS',
      message: 'Signed in successfully',
      session,
      user,
   };
}
