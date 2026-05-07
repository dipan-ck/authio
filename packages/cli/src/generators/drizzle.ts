type DrizzleProvider = 'postgres' | 'mysql' | 'sqlite';

export function generateDrizzleSchema(provider: DrizzleProvider) {
   if (provider === 'postgres') {
      return `
import * as t from 'drizzle-orm/pg-core';

export const userTable = t.pgTable('user', {
   id: t.text('id').primaryKey(),
   name: t.text('name').notNull(),
   email: t.text().notNull().unique(),
   emailVerified: t.boolean('email_verified').notNull().default(false),
   image: t.text('image'),
   createdAt: t.timestamp('created_at', { precision: 6, withTimezone: true }).notNull(),
   updatedAt: t.timestamp('updated_at', { precision: 6, withTimezone: true }).notNull(),
});

export const accountTable = t.pgTable('account', {
   id: t.text('id').primaryKey(),
   userId: t
      .text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
   accountId: t.text('account_id').notNull(),
   providerId: t.text('provider_id').notNull(),
   accessToken: t.text('access_token'),
   refreshToken: t.text('refresh_token'),
   accessTokenExpiresAt: t.timestamp('access_token_expires_at', {
      precision: 6,
      withTimezone: true,
   }),
   refreshTokenExpiresAt: t.timestamp('refresh_token_expires_at', {
      precision: 6,
      withTimezone: true,
   }),
   scope: t.text('scope'),
   idToken: t.text('id_token'),
   password: t.text('password'),
   createdAt: t.timestamp('created_at', { precision: 6, withTimezone: true }).notNull(),
   updatedAt: t.timestamp('updated_at', { precision: 6, withTimezone: true }).notNull(),
});

export const verificationTable = t.pgTable('verification', {
   id: t.text('id').primaryKey(),
   identifier: t.text('identifier').notNull(),
   value: t.text('value').notNull(),
   expiresAt: t.timestamp('expires_at', { precision: 6, withTimezone: true }).notNull(),
   createdAt: t.timestamp('created_at', { precision: 6, withTimezone: true }).notNull(),
   updatedAt: t.timestamp('updated_at', { precision: 6, withTimezone: true }).notNull(),
});

export const sessionTable = t.pgTable('session', {
   id: t.text('id').primaryKey(),
   userId: t
      .text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
   token: t.text().notNull().unique(),
   expiresAt: t.timestamp('expires_at', { precision: 6, withTimezone: true }).notNull(),
   ipAddress: t.text('ip_address'),
   userAgent: t.text('user_agent'),
   createdAt: t.timestamp('created_at', { precision: 6, withTimezone: true }).notNull(),
   updatedAt: t.timestamp('updated_at', { precision: 6, withTimezone: true }).notNull(),
});
`;
   }

   if (provider === 'mysql') {
      return `
import * as t from 'drizzle-orm/mysql-core';

export const userTable = t.mysqlTable('user', {
   id: t.varchar('id', { length: 255 }).primaryKey(),
   name: t.text('name').notNull(),
   email: t.varchar('email', { length: 255 }).notNull().unique(),
   emailVerified: t.boolean('email_verified').notNull().default(false),
   image: t.text('image'),
   createdAt: t.timestamp('created_at', { fsp: 6 }).notNull(),
   updatedAt: t.timestamp('updated_at', { fsp: 6 }).notNull(),
});

export const accountTable = t.mysqlTable('account', {
   id: t.varchar('id', { length: 255 }).primaryKey(),
   userId: t
      .varchar('user_id', { length: 255 })
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
   accountId: t.varchar('account_id', { length: 255 }).notNull(),
   providerId: t.varchar('provider_id', { length: 255 }).notNull(),
   accessToken: t.text('access_token'),
   refreshToken: t.text('refresh_token'),
   accessTokenExpiresAt: t.timestamp('access_token_expires_at', { fsp: 6 }),
   refreshTokenExpiresAt: t.timestamp('refresh_token_expires_at', { fsp: 6 }),
   scope: t.text('scope'),
   idToken: t.text('id_token'),
   password: t.text('password'),
   createdAt: t.timestamp('created_at', { fsp: 6 }).notNull(),
   updatedAt: t.timestamp('updated_at', { fsp: 6 }).notNull(),
});

export const verificationTable = t.mysqlTable('verification', {
   id: t.varchar('id', { length: 255 }).primaryKey(),
   identifier: t.varchar('identifier', { length: 255 }).notNull(),
   value: t.text('value').notNull(),
   expiresAt: t.timestamp('expires_at', { fsp: 6 }).notNull(),
   createdAt: t.timestamp('created_at', { fsp: 6 }).notNull(),
   updatedAt: t.timestamp('updated_at', { fsp: 6 }).notNull(),
});

export const sessionTable = t.mysqlTable('session', {
   id: t.varchar('id', { length: 255 }).primaryKey(),
   userId: t
      .varchar('user_id', { length: 255 })
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
   token: t.varchar('token', { length: 255 }).notNull().unique(),
   expiresAt: t.timestamp('expires_at', { fsp: 6 }).notNull(),
   ipAddress: t.varchar('ip_address', { length: 255 }),
   userAgent: t.text('user_agent'),
   createdAt: t.timestamp('created_at', { fsp: 6 }).notNull(),
   updatedAt: t.timestamp('updated_at', { fsp: 6 }).notNull(),
});
`;
   }

   return `
import * as t from 'drizzle-orm/sqlite-core';

export const userTable = t.sqliteTable('user', {
   id: t.text('id').primaryKey(),
   name: t.text('name').notNull(),
   email: t.text('email').notNull().unique(),
   emailVerified: t.integer('email_verified', { mode: 'boolean' }).notNull().default(false),
   image: t.text('image'),
   createdAt: t.integer('created_at', { mode: 'timestamp_ms' }).notNull(),
   updatedAt: t.integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const accountTable = t.sqliteTable('account', {
   id: t.text('id').primaryKey(),
   userId: t
      .text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
   accountId: t.text('account_id').notNull(),
   providerId: t.text('provider_id').notNull(),
   accessToken: t.text('access_token'),
   refreshToken: t.text('refresh_token'),
   accessTokenExpiresAt: t.integer('access_token_expires_at', { mode: 'timestamp_ms' }),
   refreshTokenExpiresAt: t.integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
   scope: t.text('scope'),
   idToken: t.text('id_token'),
   password: t.text('password'),
   createdAt: t.integer('created_at', { mode: 'timestamp_ms' }).notNull(),
   updatedAt: t.integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTable = t.sqliteTable('verification', {
   id: t.text('id').primaryKey(),
   identifier: t.text('identifier').notNull(),
   value: t.text('value').notNull(),
   expiresAt: t.integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
   createdAt: t.integer('created_at', { mode: 'timestamp_ms' }).notNull(),
   updatedAt: t.integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const sessionTable = t.sqliteTable('session', {
   id: t.text('id').primaryKey(),
   userId: t
      .text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
   token: t.text('token').notNull().unique(),
   expiresAt: t.integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
   ipAddress: t.text('ip_address'),
   userAgent: t.text('user_agent'),
   createdAt: t.integer('created_at', { mode: 'timestamp_ms' }).notNull(),
   updatedAt: t.integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});
`;
}
