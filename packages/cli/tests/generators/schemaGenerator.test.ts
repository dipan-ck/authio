import { describe, it, expect } from 'vitest';

import { generateDrizzleSchema } from '../../src/generators/drizzle.js';
import { generatePrismaSchema } from '../../src/generators/prisma.js';

describe('schema generators', () => {
   describe('drizzle schema generator', () => {
      it('should generate postgres drizzle schema', () => {
         const schema = generateDrizzleSchema('postgres');

         expect(schema).toMatchSnapshot();
      });

      it('should generate mysql drizzle schema', () => {
         const schema = generateDrizzleSchema('mysql');

         expect(schema).toMatchSnapshot();
      });

      it('should generate sqlite drizzle schema', () => {
         const schema = generateDrizzleSchema('sqlite');

         expect(schema).toMatchSnapshot();
      });
   });

   describe('prisma schema generator', () => {
      it('should generate postgres prisma schema', () => {
         const schema = generatePrismaSchema('postgres');

         expect(schema).toMatchSnapshot();
      });

      it('should generate mysql prisma schema', () => {
         const schema = generatePrismaSchema('mysql');

         expect(schema).toMatchSnapshot();
      });

      it('should generate sqlite prisma schema', () => {
         const schema = generatePrismaSchema('sqlite');

         expect(schema).toMatchSnapshot();
      });
   });
});
