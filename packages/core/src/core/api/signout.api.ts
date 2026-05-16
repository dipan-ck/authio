import { SignoutApiResponse, SignoutPayload } from '../../types/api.types.js';
import { ParsedAuthioConfig } from '../../types/config.js';
import { AuthioError } from '../authioError.js';

export async function signout(
   payload: SignoutPayload,
   ctx: ParsedAuthioConfig,
): SignoutApiResponse {
   const session = await ctx.database.findSessionByToken(payload.token);
   if (!session) {
      throw new AuthioError('SESSION_NOT_FOUND', 'Session not found');
   }
   await ctx.database.deleteSession(payload.token);
   return {
      code: 'SIGNOUT_SUCCESS',
      message: 'Signed out successfully',
   };
}
