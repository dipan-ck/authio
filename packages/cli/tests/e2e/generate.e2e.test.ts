import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, afterEach } from 'vitest';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const fixturePath = path.resolve(__dirname, '../fixtures/node-project');
const cliPath = path.resolve(__dirname, '../../dist/index.js');

let generatedFile: string;

describe('generate command e2e', () => {
   afterEach(() => {
      if (generatedFile && fs.existsSync(generatedFile)) {
         fs.rmSync(generatedFile, { force: true });
      }
   });

   it('generates schema at default path with no flags', () => {
      generatedFile = path.resolve(fixturePath, 'src/db/auth-schema.ts');
      execSync(`node ${cliPath} generate`, {
         cwd: fixturePath,
         stdio: 'pipe',
      });
      expect(fs.existsSync(generatedFile)).toBe(true);
      const content = fs.readFileSync(generatedFile, 'utf-8');
      expect(content).toContain('userTable');
      expect(content).toContain('accountTable');
      expect(content).toContain('sessionTable');
      expect(content).toContain('verificationTable');
   });

   it('generates schema at custom path with --output flag', () => {
      generatedFile = path.resolve(fixturePath, 'src/config/auth-schema.ts');
      execSync(`node ${cliPath} generate --output ./src/config/auth-schema.ts`, {
         cwd: fixturePath,
         stdio: 'pipe',
      });
      expect(fs.existsSync(generatedFile)).toBe(true);
      const content = fs.readFileSync(generatedFile, 'utf-8');
      expect(content).toContain('userTable');
      expect(content).toContain('accountTable');
      expect(content).toContain('sessionTable');
      expect(content).toContain('verificationTable');
   });
});
