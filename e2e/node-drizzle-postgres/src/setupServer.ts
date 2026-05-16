import app from './index.js';
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { drizzleTemplatesGenerator } from './utils/drizzleTemplates.js';
import { execSync } from 'node:child_process';

interface SetupServerConfigType {
   database: 'prisma' | 'drizzle';
   provider: 'postgres' | 'mysql' | 'sqlite';
}

const projectRoot = path.resolve(import.meta.dirname, '..');
const authFilePath = path.resolve(import.meta.dirname, 'lib/auth.ts');
const drizzlDbPath = path.resolve(import.meta.dirname, 'db/index.ts');
const drizzleConfigFile = path.join(projectRoot, 'drizzle.config.ts');

export function setupNodeServer(config: SetupServerConfigType) {
   return {
      startServer: () => {
         app.listen(Number(process.env.PORT!));
      },
      drizzleSetup: () => {
         const templates = drizzleTemplatesGenerator(config.provider, config.database)!;
         writeFileSync(authFilePath, templates?.authTemplate);
         writeFileSync(drizzlDbPath, templates?.dbTemplate);
         writeFileSync(drizzleConfigFile, templates?.configTemplate);
      },

      genarateSchema: () => {
         if (config.database == 'drizzle') {
            execSync('npx @authio/cli generate', {
               cwd: projectRoot,
               stdio: 'inherit',
            });
         }
      },

      migrateDb: () => {
         if (config.database == 'drizzle') {
            execSync('npx drizzle-kit push --force', {
               cwd: projectRoot,
               stdio: 'inherit',
            });
         }
      },

      tearDown: () => {
         if (config.database == 'drizzle') {
            execSync('pnpm drizzle-kit drop', {
               cwd: projectRoot,
               stdio: 'inherit',
            });
         }
      },

      spinUp() {
         console.log('Generating templates');
         this.drizzleSetup();
         console.log('generating schema');
         this.genarateSchema();
         console.log('mifrating database');
         this.migrateDb();
         return;
      },
   };
}
