import { describe, expect, it } from 'vitest';
import path from 'path';

import { loadConfig } from '../../src/utils/configHelpers.js';

describe('loadConfig', () => {
   it('loads a real SwiftAuth config instance', async () => {
      const filePath = path.resolve(process.cwd(), 'tests/fixtures/auth.ts');

      const auth = await loadConfig(filePath);
      expect(auth).toBeDefined();

      expect(auth.config).toBeDefined();

      expect(auth.config.baseUrl).toBe('http://test.com');

      expect(auth.config.database.provider).toBe('postgres');
      expect(auth.config.database.id).toBe('drizzle-adapter');
   });
});
