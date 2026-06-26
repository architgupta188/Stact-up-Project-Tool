import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { randomUUID } from 'crypto';
export const users = sqliteTable('users', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    email: text('email').notNull(),
    name: text('name'),
    passwordHash: text('password_hash'),
    googleId: text('google_id'),
    defaultRole: text('default_role', { enum: ['startup', 'investor', 'student'] }),
    isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
    refreshToken: text('refresh_token'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    googleIdIdx: uniqueIndex('users_google_id_idx').on(table.googleId),
}));
export const reports = sqliteTable('reports', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    role: text('role', { enum: ['startup', 'investor', 'student'] }).notNull(),
    status: text('status', { enum: ['pending', 'generating', 'complete', 'failed'] }).notNull().default('pending'),
    inputData: text('input_data', { mode: 'json' }).notNull(),
    outputData: text('output_data', { mode: 'json' }),
    score: integer('score'),
    verdict: text('verdict', { enum: ['go', 'revise', 'no-go', 'na'] }).default('na'),
    shareToken: text('share_token'),
    pdfUrl: text('pdf_url'),
    ideaName: text('idea_name'),
    generationMs: integer('generation_ms'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
    userIdIdx: index('reports_user_id_idx').on(table.userId),
    shareTokenIdx: uniqueIndex('reports_share_token_idx').on(table.shareToken),
    statusIdx: index('reports_status_idx').on(table.status),
    createdAtIdx: index('reports_created_at_idx').on(table.createdAt),
}));
export const conversations = sqliteTable('conversations', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    reportId: text('report_id').notNull().references(() => reports.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    messages: text('messages', { mode: 'json' }).notNull().default('[]'),
    turnCount: integer('turn_count').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
    reportIdIdx: uniqueIndex('conversations_report_id_idx').on(table.reportId),
}));
export const schemeCache = sqliteTable('scheme_cache', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    cacheKey: text('cache_key').notNull(),
    schemes: text('schemes', { mode: 'json' }).notNull(),
    fetchedAt: integer('fetched_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
    cacheKeyIdx: uniqueIndex('scheme_cache_key_idx').on(table.cacheKey),
}));
export const newsCache = sqliteTable('news_cache', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    query: text('query').notNull(),
    articles: text('articles', { mode: 'json' }).notNull(),
    fetchedAt: integer('fetched_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
    queryIdx: uniqueIndex('news_cache_query_idx').on(table.query),
}));
//# sourceMappingURL=schema.js.map