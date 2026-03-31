import { loadAuthConfig } from '../utils/load-auth-file.js';
import { defineCommand } from 'citty';
import { findAuthFile } from '../utils/find-auth-file.js';
import { generateDrizzleSchema } from '../generators/drizzle.js';
import path from 'path';
import fs from 'fs';

const NO_FILE_FOUND_MESSAGE = `cannot locate auth config file make sure it's in ANY OF these :
  ./src/lib/auth.ts
  ./src/config/auth.ts
  ./lib/auth.ts
  ./config/auth.ts

  You can also share the config file path by: npx swift-auth genertate --output <path>

  `;

export const generate = defineCommand({
   meta: {
      name: 'generate',
      description: 'Generate auth config',
   },

   args: {
      path: {
         type: 'string',
         required: false,
      },
      output: {
         type: 'string',
         required: false,
      },
   },

   async run({ args }) {
      let filePath = findAuthFile(args.path);

      if (!filePath) {
         throw Error(NO_FILE_FOUND_MESSAGE);
      } else {
         console.log('Found auth file at:', filePath);
      }

      const auth = await loadAuthConfig(filePath);
      const schema = generateDrizzleSchema(auth);
      let outputPath;
      if (args.output) {
         outputPath = path.join(process.cwd(), args.output);
      } else {
         outputPath = path.join(process.cwd(), 'src/db/auth-schema.ts');
      }
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, schema);

      console.log(`✓ Schema generated at ${outputPath}`);
   },
});
