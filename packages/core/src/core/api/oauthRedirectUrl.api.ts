import { OauthRedirectUrlApiResponse, OauthRedirectUrlPayload } from '../../types/api.types.js';
import { ParsedAuthioConfig } from '../../types/config.js';
import { AuthioError } from '../authioError.js';

export async function oauthRedirectUrl(
   payload: OauthRedirectUrlPayload,
   ctx: ParsedAuthioConfig,
): OauthRedirectUrlApiResponse {
   const oauthProvider = ctx?.socialProviders?.[payload.id];
   if (!oauthProvider) {
      throw new AuthioError('PROVIDER_NOT_CONFIGURED', `${payload.id} provider is not configured`);
   }
   const state = crypto.randomUUID();
   const redirectUrl = `${ctx.baseUrl}/api/auth/${payload.id}/callback`;
   const authUrl = oauthProvider.getAuthUrl(state, redirectUrl);
   return { authUrl, state };
}
