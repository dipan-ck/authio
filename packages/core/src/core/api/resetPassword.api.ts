import { ResetPasswordApiResponse, ResetPasswordPayload } from '../../types/api.types.js';
import { ParsedAuthioConfig } from '../../types/config.js';
import { hashPassword } from '../../utils/password.js';
import { AuthioError } from '../authioError.js';

export async function resetPassword(
   payload: ResetPasswordPayload,
   ctx: ParsedAuthioConfig,
): ResetPasswordApiResponse {
   // find verification token
   const verification = await ctx.database.findVerificationByToken(payload.token);
   if (!verification) {
      throw new AuthioError('INVALID_TOKEN', 'Reset token is invalid or already used');
   }

   // check expiry
   if (verification.expiresAt < new Date()) {
      await ctx.database.deleteVerification(verification.id);
      throw new AuthioError('TOKEN_EXPIRED', 'Reset token has expired');
   }

   // find user
   const user = await ctx.database.findUserByEmail(verification.identifier);
   if (!user) {
      throw new AuthioError('USER_NOT_FOUND', 'User not found');
   }

   // check new password length
   if (payload.newPassword.length < ctx.emailAndPassword!.minPasswordLength) {
      throw new AuthioError(
         'PASSWORD_TOO_SHORT',
         `Password must be at least ${ctx.emailAndPassword!.minPasswordLength} characters`,
      );
   }

   // find account and update password
   const account = await ctx.database.findAccountByUserId(user.id, 'email');
   if (!account) {
      throw new AuthioError('ACCOUNT_NOT_FOUND', 'No email account found for this user');
   }

   await ctx.database.updateAccount(account.id, {
      password: await hashPassword(payload.newPassword),
   });

   // delete token so it cannot be reused
   await ctx.database.deleteVerification(verification.id);

   // invalidate all existing sessions for security
   await ctx.database.deleteUserSessions(user.id);

   return {
      code: 'PASSWORD_RESET_SUCCESS',
      message: 'Password reset successfully, please sign in again',
   };
}
