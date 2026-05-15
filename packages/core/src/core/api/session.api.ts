import { GetSessionApiResponse, GetSessionPayload } from '../../types/api.types.js';
import { ParsedAuthioConfig } from '../../types/config.js';
import { AuthioError } from '../authioError.js';

export async function getSession(
   payload: GetSessionPayload,
   ctx: ParsedAuthioConfig,
): GetSessionApiResponse {
   const session = await ctx.database.findSessionByToken(payload.token);
   if (!session) {
      throw new AuthioError('SESSION_NOT_FOUND', 'Session not found');
   }
   if (session.expiresAt < new Date()) {
      await ctx.database.deleteSession(payload.token);
      throw new AuthioError('SESSION_EXPIRED', 'Session has expired');
   }
   const user = await ctx.database.findUserById(session.userId);

   if (!user) {
      throw new AuthioError('SESSION_EXPIRED', 'Session has expired');
   }

   return { code: 'SESSION_FOUND', message: 'User session found', session, user };
}
