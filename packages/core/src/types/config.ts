import type { OAuthProvider } from '../providers/types.js';
import type { DatabaseAdapter } from './adapter.js';

interface EmailAndPasswordConfig {
   enabled: boolean;
   autoSignIn?: boolean;
   verifyEmail?: boolean;
   minPasswordLength?: number;
}

export interface SocialProvidersConfig {
   google?: OAuthProvider;
   github?: OAuthProvider;
}

export interface SessionConfig {
   expiry?: number;
}

export interface SwiftAuthConfig {
   baseUrl: string;
   session?: SessionConfig;
   emailAndPassword?: EmailAndPasswordConfig;
   database: DatabaseAdapter;
   socialProviders?: SocialProvidersConfig;
}
