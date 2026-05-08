import { defineCommand, runMain } from 'citty';
import { generate } from './commands/generate.js';

const main = defineCommand({
   meta: {
      name: 'Swift Auth CLI',
      description: `
Swift Auth CLI

Generate authentication schemas and setup files for:
- Drizzle ORM
- Prisma
- PostgreSQL
- MySQL
- SQLite
      `.trim(),
   },
   subCommands: {
      generate: generate,
   },
});

runMain(main);
