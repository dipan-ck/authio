import { defineCommand } from 'citty';
import { generateDrizzleSchema } from '../generators/drizzle.js';
import path from 'path';
import fs from 'fs';

export const generate = defineCommand({
   meta: {
      name: 'generate',
      description: 'Generate authentication schema',
   },
   args: {
      output: {
         type: 'string',
         required: false,
      },
   },
   async run({ args }) {
      const schema = generateDrizzleSchema();
      const outputPath = path.join(process.cwd(), args.output ?? 'src/db/auth-schema.ts');
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, schema);
      console.log(`✓ Schema generated at ${outputPath}`);
   },
});
