import { defineConfig } from 'prisma/config';

export default defineConfig({
   schema: 'prisma/schema.prisma',
   migrations: {
      path: 'prisma/migrations',
   },
   datasource: {
      url: 'postgresql://test_user:test_password@localhost:5433/test_db',
   },
});
