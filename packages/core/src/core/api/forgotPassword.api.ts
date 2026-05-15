import { ForgetPasswordApiResponse, ForgetPasswordPayload } from '../../types/api.types.js';
import { ParsedAuthioConfig } from '../../types/config.js';
import { AuthioError } from '../authioError.js';

export async function forgotPassword(
   payload: ForgetPasswordPayload,
   ctx: ParsedAuthioConfig,
): ForgetPasswordApiResponse {
   if (!ctx.emailAndPassword?.enabled) {
      throw new AuthioError(
         'EMAIL_PASSWORD_DISABLED',
         'Enable emailAndPassword in your config to use forgot password',
      );
   }

   if (!ctx.emailAndPassword.forgotPasswordCallback) {
      throw new AuthioError(
         'MISSING_FORGOT_PASSWORD_CALLBACK',
         'forgotPasswordCallback is required to use forgot password',
      );
   }

   const user = await ctx.database.findUserByEmail(payload.email);

   //I will not reveal the existence of the user instead just returning a fake success message
   if (!user) {
      return {
         code: 'RESET_EMAIL_SENT',
         message: 'If an account exists with this email, a reset link has been sent',
      };
   }

   const verification = await ctx.database.createVerification({
      identifier: user.email,
      expiresAt: new Date(Date.now() + ctx.emailAndPassword.verificationTokenExpiry),
   });

   // calling the forget password callback provided by the user. letting the user decide how they want the token sharing system
   await ctx.emailAndPassword.forgotPasswordCallback({
      name: user.name,
      email: user.email,
      resetToken: verification.value,
   });

   return {
      code: 'RESET_EMAIL_SENT',
      message: 'If an account exists with this email, a reset link has been sent',
   };
}
