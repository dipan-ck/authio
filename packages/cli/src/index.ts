import { defineCommand, runMain } from 'citty';
import { generate } from './commands/generate.js';

const main = defineCommand({
   meta: {
      name: 'Authio CLI',
      description: `
Generate authentication schemas and setup files for:
- Drizzle ORM
 PostgreSQL
- MySQL
- SQLite
      `.trim(),
   },
   subCommands: {
      generate: generate,
   },
});

runMain(main);
