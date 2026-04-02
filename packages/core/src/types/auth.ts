export interface User {
   id: string;
   name: string;
   email: string;
   emailVerified: boolean;
   image: string | null;
   createdAt: Date;
   updatedAt: Date;
}

export interface Session {
   id: string;
   token: string;
   userId: string;
   userAgent: string | null;
   ipAddress: string | null;
   expiresAt: Date;
   createdAt: Date;
   updatedAt: Date;
}

export interface Verification {
   id: string;
   identifier: string;
   value: string;
   expiresAt: Date;
   createdAt: Date;
   updatedAt: Date;
}

export interface Account {
   id: string;
   userId: string;
   accountId: string;
   providerId: string;
   accessToken: string | null;
   refreshToken: string | null;
   accessTokenExpiresAt: Date | null;
   refreshTokenExpiresAt: Date | null;
   scope: string | null;
   idToken: string | null;
   password: string | null;
   createdAt: Date;
   updatedAt: Date;
}
