import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function pollService(name: string, check: () => void, maxAttempts = 30, intervalMs = 1500) {
   let attempts = 0;
   while (attempts < maxAttempts) {
      try {
         check();
         console.log(`✓ ${name} is ready`);
         return;
      } catch {
         attempts++;
         console.log(`  Waiting for ${name}… (${attempts}/${maxAttempts})`);
         await new Promise((r) => setTimeout(r, intervalMs));
      }
   }
   throw new Error(`${name} did not become ready in time`);
}

export async function setup() {
   execSync('docker compose up -d', { cwd: rootDir, stdio: 'inherit' });

   await pollService('PostgreSQL', () =>
      execSync('docker exec postgres_prisma_test pg_isready -U test_user -d test_db', {
         stdio: 'pipe',
      }),
   );

   console.log('Pushing prisma schema…');
   execSync('pnpm prisma db push --force-reset --schema=prisma/schema.prisma', {
      cwd: rootDir,
      stdio: 'inherit',
   });
   console.log('✓ Schema pushed — running tests');
}

export function teardown() {
   execSync('docker compose down -v', { cwd: rootDir, stdio: 'inherit' });
}
