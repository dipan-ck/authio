import { describe, it, expect } from 'vitest';
import { generateDrizzleSchema } from '../../src/generators/drizzle.js';

describe('generate drizzle schema', () => {
   it('should generate schema with all tables', () => {
      const drizzleSchema = generateDrizzleSchema();
      expect(drizzleSchema).toMatchSnapshot();
   });
});
