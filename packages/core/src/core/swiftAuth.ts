import { SwiftAuthConfig } from '../types/config.js';
import { ParsedSwiftAuthConfig, SwiftAuthConfigSchema } from '../validator/config.validator.js';

export class SwiftAuth {
   readonly config: ParsedSwiftAuthConfig;

   constructor(config: SwiftAuthConfig) {
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

      this.config = result.data;
   }
}
