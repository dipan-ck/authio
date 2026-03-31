interface EmailAndPasswordConfig {
   enabled: boolean;
   autoSignIn?: boolean;
   verifyEmail?: boolean;
   minPasswordLength?: number;
}

export interface SwiftAuthConfig {
   emailAndPassword: EmailAndPasswordConfig;
}
