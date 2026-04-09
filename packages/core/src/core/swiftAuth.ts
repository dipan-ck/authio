import { User } from '../types/auth.js';
import { SwiftAuthConfig } from '../types/config.js';
import { ParsedSwiftAuthConfig, SwiftAuthConfigSchema } from '../validator/config.validator.js';

export class SwiftAuth {
   readonly config: ParsedSwiftAuthConfig;

   constructor(config: SwiftAuthConfig) {
      const { database, socialProviders } = config;

      if (!database) {
         throw Error('Database adapter is not defined');
      }

      const result = SwiftAuthConfigSchema.safeParse(config);

      if (result.error) {
         let errorMessage = '';
         let count = 1;
         for (const issue of result.error.issues) {
            errorMessage += `ERROR ${count} :${issue.path.join('.')} ${issue.message}\n`;
            count++;
         }
         throw Error(errorMessage);
      }

      this.config = {
         database,
         ...result.data,
         socialProviders,
      };
   }

   // needs to be refactored and re implemented
   async signup(
      user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
      provider: 'credential' | 'google' | 'github',
   ) {
      if (
         this.config.emailAndPassword &&
         this.config.emailAndPassword.verifyEmail &&
         provider == 'credential'
      ) {
         const savedUser = await this.config.database.createUser({
            name: user.name,
            email: user.email,
            emailVerified: false,
            image: user.image,
         });
      } else {
      }
   }
}
