import type { Account, Session, User, Verification } from './auth.js';

export interface DatabaseAdapter {
   //user operations interface
   createUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User>;
   findUserById: (id: string) => Promise<User | null>;
   findUserByEmail: (email: string) => Promise<User | null>;
   updateUser: (id: string, data: Partial<Omit<User, 'id'>>) => Promise<User>;

   //session operations interface
   createSession: (session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Session>;
   findSessionByToken: (token: string) => Promise<Session | null>;
   deleteSession: (token: string) => Promise<void>;
   deleteUserSessions: (userId: string) => Promise<void>;

   //account operations interfaces
   createAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Account>;
   findAccountByUserId: (userId: string, providerId: string) => Promise<Account | null>;

   //verification operations interfaces
   createVerification: (
      verification: Omit<Verification, 'id' | 'createdAt' | 'updatedAt' | 'value'>,
   ) => Promise<Verification>;
   findVerificationByToken: (token: string) => Promise<Verification | null>;
   deleteVerification: (id: string) => Promise<void>;
}
