import * as z from 'zod';
import { DatabaseAdapter } from '../types/adapter.js';

const emailAndPasswordSchema = z.object({
   enabled: z.boolean(),
   autoSignIn: z.boolean().default(true),
   verifyEmail: z.boolean().default(false),
   minPasswordLength: z.number().default(8),
});

export const SwiftAuthConfigSchema = z.object({
   emailAndPassword: emailAndPasswordSchema,
});

export type ParsedSwiftAuthConfig = z.infer<typeof SwiftAuthConfigSchema> & {
   database: DatabaseAdapter;
};
