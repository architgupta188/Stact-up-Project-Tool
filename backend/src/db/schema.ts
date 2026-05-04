import { pgTable, pgEnum, uuid, text, integer, boolean, jsonb, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role_enum', ['startup', 'investor', 'student']);
export const verdictEnum = pgEnum('verdict_enum', ['go', 'revise', 'no-go', 'na']);
export const statusEnum = pgEnum('status_enum', ['pending', 'generating', 'complete', 'failed']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  name: text('name'),
  passwordHash: text('password_hash'),
  googleId: text('google_id'),
  defaultRole: roleEnum('default_role'),
  isVerified: boolean('is_verified').notNull().default(false),
  refreshToken: text('refresh_token'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
  googleIdIdx: uniqueIndex('users_google_id_idx').on(table.googleId),
}));

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  role: roleEnum('role').notNull(),
  status: statusEnum('status').notNull().default('pending'),
  inputData: jsonb('input_data').notNull(),
  outputData: jsonb('output_data'),
  score: integer('score'),
  verdict: verdictEnum('verdict').default('na'),
  shareToken: text('share_token'),
  pdfUrl: text('pdf_url'),
  ideaName: text('idea_name'),
  generationMs: integer('generation_ms'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('reports_user_id_idx').on(table.userId),
  shareTokenIdx: uniqueIndex('reports_share_token_idx').on(table.shareToken),
  statusIdx: index('reports_status_idx').on(table.status),
  createdAtIdx: index('reports_created_at_idx').on(table.createdAt),
}));

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('report_id').notNull().references(() => reports.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  messages: jsonb('messages').notNull().default([]),
  turnCount: integer('turn_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  reportIdIdx: uniqueIndex('conversations_report_id_idx').on(table.reportId),
}));

export const schemeCache = pgTable('scheme_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  cacheKey: text('cache_key').notNull(),
  schemes: jsonb('schemes').notNull(),
  fetchedAt: timestamp('fetched_at').notNull().defaultNow(),
}, (table) => ({
  cacheKeyIdx: uniqueIndex('scheme_cache_key_idx').on(table.cacheKey),
}));

export const newsCache = pgTable('news_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  query: text('query').notNull(),
  articles: jsonb('articles').notNull(),
  fetchedAt: timestamp('fetched_at').notNull().defaultNow(),
}, (table) => ({
  queryIdx: uniqueIndex('news_cache_query_idx').on(table.query),
}));
