import { DeleteUserPayload } from '../../types/api.types.js';
import { ParsedAuthioConfig } from '../../types/config.js';
import { AuthioError } from '../authioError.js';

export async function deleteUser(payload: DeleteUserPayload, ctx: ParsedAuthioConfig) {
   const user = await ctx.database.findUserById(payload.userId);

   if (!user) {
      throw new AuthioError('USER_NOT_FOUND', 'User not found');
   }

   // delete all sessions first
   await ctx.database.deleteUserSessions(user.id);

   // if your adapter/database supports cascade delete
   // accounts will be removed automatically

   // otherwise you should add deleteAccountByUserId
   // in adapter interface too

   await ctx.database.deleteUser(user.id);

   return {
      code: 'USER_DELETED',
      message: 'User deleted successfully',
   };
}
