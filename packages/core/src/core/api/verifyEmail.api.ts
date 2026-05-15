import { VerifyEmailApiResponse, VerifyEmailPayload } from '../../types/api.types.js';
import { ParsedAuthioConfig } from '../../types/config.js';
import { AuthioError } from '../authioError.js';

export async function verifyEmail(
   payload: VerifyEmailPayload,
   ctx: ParsedAuthioConfig,
): VerifyEmailApiResponse {
   if (!ctx.emailAndPassword?.enabled) {
      throw new AuthioError(
         'EMAIL_PASSWORD_DISABLED',
         'Enable emailAndPassword in your config to use email verification',
      );
   }

   if (!ctx.emailAndPassword.verifyEmail) {
      throw new AuthioError(
         'VERIFICATION_NOT_ENABLED',
         'Email verification is not enabled in your config',
      );
   }

   // find the verification token
   const verification = await ctx.database.findVerificationByToken(payload.token);
   if (!verification) {
      throw new AuthioError('INVALID_TOKEN', 'Verification token is invalid or already used');
   }

   // check if token is expired
   if (verification.expiresAt < new Date()) {
      await ctx.database.deleteVerification(verification.id);
      throw new AuthioError('TOKEN_EXPIRED', 'Verification token has expired');
   }

   // find user
   const user = await ctx.database.findUserByEmail(verification.identifier);
   if (!user) {
      throw new AuthioError('USER_NOT_FOUND', 'User associated with this token was not found');
   }

   // mark email as verified
   const verifiedUser = await ctx.database.updateUser(user.id, {
      emailVerified: true,
   });

   // delete token so it cannot be reused
   await ctx.database.deleteVerification(verification.id);

   // auto sign in if enabled
   if (ctx.emailAndPassword.autoSignIn) {
      const session = await ctx.database.createSession({
         userId: user.id,
         token: crypto.randomUUID(),
         expiresAt: new Date(Date.now() + ctx.session.expiry),
         userAgent: null,
         ipAddress: null,
      });

      return {
         code: 'EMAIL_VERIFIED',
         message: 'Email verified and signed in successfully',
         session,
         user: verifiedUser,
      };
   }

   return {
      code: 'EMAIL_VERIFIED',
      message: 'Email verified successfully',
      user: verifiedUser,
      session: null,
   };
}
