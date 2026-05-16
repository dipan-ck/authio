import { ParsedAuthioConfig } from '@authio/core';

export function isSupportedProvider(provider: string, config: ParsedAuthioConfig): boolean {
   return config.internal.oauth.supportedOauthProviders.includes(provider);
}
