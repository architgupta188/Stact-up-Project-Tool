# VentureIQ — Backend Schema Documentation
**Version:** 1.0 | **Date:** March 31, 2026

---

## Overview

This document covers:
1. Complete PostgreSQL database schema with Drizzle ORM definitions
2. All API routes with request/response contracts
3. Middleware stack
4. Prompt pipeline architecture
5. Service layer design
6. Data access patterns and query examples

---

## 1. Database Schema

### 1.1 Enums

```sql
-- PostgreSQL enum types
CREATE TYPE role_enum    AS ENUM ('startup', 'investor', 'student');
CREATE TYPE verdict_enum AS ENUM ('go', 'revise', 'no-go', 'na');
CREATE TYPE status_enum  AS ENUM ('pending', 'generating', 'complete', 'failed');
```

```typescript
// src/db/schema.ts — Drizzle ORM definitions
import {
  pgTable, pgEnum, uuid, text, integer, boolean,
  jsonb, timestamp, index, uniqueIndex
} from 'drizzle-orm/pg-core'

export const roleEnum    = pgEnum('role_enum',    ['startup', 'investor', 'student'])
export const verdictEnum = pgEnum('verdict_enum', ['go', 'revise', 'no-go', 'na'])
export const statusEnum  = pgEnum('status_enum',  ['pending', 'generating', 'complete', 'failed'])
```

---

### 1.2 Table: `users`

```typescript
export const users = pgTable('users', {
  id:             uuid('id').primaryKey().defaultRandom(),
  email:          text('email').notNull(),
  name:           text('name'),
  passwordHash:   text('password_hash'),       // null for OAuth-only users
  googleId:       text('google_id'),           // null for email/password users
  defaultRole:    roleEnum('default_role'),    // last selected role (UX convenience)
  isVerified:     boolean('is_verified').notNull().default(false),
  refreshToken:   text('refresh_token'),       // hashed refresh token stored server-side
  createdAt:      timestamp('created_at').notNull().defaultNow(),
  updatedAt:      timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx:    uniqueIndex('users_email_idx').on(table.email),
  googleIdIdx: uniqueIndex('users_google_id_idx').on(table.googleId),
}))
```

**SQL equivalent:**
```sql
CREATE TABLE users (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT        NOT NULL UNIQUE,
  name            TEXT,
  password_hash   TEXT,
  google_id       TEXT        UNIQUE,
  default_role    role_enum,
  is_verified     BOOLEAN     NOT NULL DEFAULT false,
  refresh_token   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX users_email_idx    ON users(email);
CREATE INDEX users_google_id_idx ON users(google_id);
```

---

### 1.3 Table: `reports`

This is the central table. The `input_data` and `output_data` columns store structured JSON, allowing role-specific schemas without separate tables.

```typescript
export const reports = pgTable('reports', {
  id:           uuid('id').primaryKey().defaultRandom(),
  userId:       uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
                // set null (not cascade) so reports survive account deletion grace period
  role:         roleEnum('role').notNull(),
  status:       statusEnum('status').notNull().default('pending'),
  inputData:    jsonb('input_data').notNull(),   // see §1.3a for shape
  outputData:   jsonb('output_data'),            // see §1.3b for shape; null until complete
  score:        integer('score'),                // 0–100; null for investor/student paths
  verdict:      verdictEnum('verdict').default('na'),
  shareToken:   text('share_token'),
  pdfUrl:       text('pdf_url'),
  ideaName:     text('idea_name'),              // denormalised from inputData for list views
  generationMs: integer('generation_ms'),        // pipeline duration in ms (analytics)
  createdAt:    timestamp('created_at').notNull().defaultNow(),
  updatedAt:    timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx:       index('reports_user_id_idx').on(table.userId),
  shareTokenIdx:   uniqueIndex('reports_share_token_idx').on(table.shareToken),
  statusIdx:       index('reports_status_idx').on(table.status),
  createdAtIdx:    index('reports_created_at_idx').on(table.createdAt),
}))
```

#### 1.3a — `input_data` JSON Shape (Startup path)

```typescript
interface StartupInput {
  role: 'startup'
  ideaName:          string
  problemStatement:  string
  targetUsers:       string
  industry:          Industry          // enum value
  businessModel:     BusinessModel     // enum value
  countryRegion:     string
  stage:             StartupStage      // enum value
  budget:            BudgetRange       // enum value
  mvpStatus:         MVPStatus         // enum value
  knownCompetitors?: string
}
```

```typescript
interface InvestorInput {
  role: 'investor'
  preferredSectors:  Industry[]       // max 3
  investmentStage:   InvestmentStage
  riskAppetite:      'low' | 'medium' | 'high'
  budgetRange:       BudgetRange
  geography:         string
  interestKeywords?: string[]         // max 5
}
```

```typescript
interface StudentInput {
  role: 'student'
  interests:         string[]
  skills:            string[]
  preferredDomain:   Industry
  budget:            StudentBudget
  intent:            'build' | 'join' | 'explore'
}
```

#### 1.3b — `output_data` JSON Shape (Startup path)

```typescript
interface StartupReportOutput {
  role: 'startup'
  generatedAt: string    // ISO timestamp

  // Scoring
  dimensionScores: {
    painLevel:         DimensionScore
    urgency:           DimensionScore
    marketSize:        DimensionScore
    adoptionSpeed:     DimensionScore
    competitionIntensity: DimensionScore
    willingnessToPay:  DimensionScore
    differentiation:   DimensionScore
    executionDifficulty: DimensionScore
    mvpFeasibility:    DimensionScore
    marketTiming:      DimensionScore
  }
  compositeScore: number    // 0–100
  verdict:        'go' | 'revise' | 'no-go'
  verdictRationale: string

  // Report sections
  sections: {
    ideaSummary:          string
    problemAnalysis:      string
    targetAudienceAnalysis: string
    marketOpportunity:    MarketOpportunitySection
    competitionAnalysis:  CompetitionSection
    industryTrends:       TrendItem[]
    governmentSchemes:    SchemeItem[]
    mvpSuggestions:       string
    risks:                RiskItem[]
    recommendations:      RecommendationItem[]
    fundingFit:           string
    actionPlan:           ActionWeek[]
    finalVerdict:         string
  }

  // Metadata
  newsArticles:   NewsArticle[]     // raw news used in analysis
  researchContext: string           // summarised web grounding context
}

interface DimensionScore {
  score:     number      // 0–10
  rationale: string      // one sentence
}

interface MarketOpportunitySection {
  tamEstimate:  string   // qualitative, e.g. "₹2,000–8,000 crore"
  samEstimate:  string
  somEstimate:  string
  narrative:    string
}

interface CompetitionSection {
  competitors: CompetitorCard[]
  positioning: string        // summary paragraph
  gaps:        string[]      // opportunities identified
}

interface CompetitorCard {
  name:          string
  description:   string
  differentiator: string     // gap vs user's idea
  threat:        'low' | 'medium' | 'high'
}

interface TrendItem {
  title:   string
  summary: string
  source?: string
  date?:   string
}

interface SchemeItem {
  name:        string
  description: string
  eligibility: string
  benefit:     string
  link?:       string     // official portal URL if known
}

interface RiskItem {
  risk:      string
  severity:  'low' | 'medium' | 'high'
  mitigation: string
}

interface RecommendationItem {
  priority: number    // 1 = highest
  action:   string
  reason:   string
}

interface ActionWeek {
  week:   number     // 1–4
  goal:   string
  tasks:  string[]
}

interface NewsArticle {
  title:       string
  description: string
  source:      string
  publishedAt: string
  url:         string
}
```

#### 1.3c — `output_data` JSON Shape (Investor path)

```typescript
interface InvestorReportOutput {
  role: 'investor'
  generatedAt: string

  sections: {
    sectorOverview:        SectorOverview[]
    trendingCategories:    TrendingCategory[]
    redFlags:              RedFlag[]
    policyImpact:          string
    opportunityMap:        OpportunityMapItem[]
    sectorsToWatch:        string[]
    dueDiligenceAngles:    string[]
  }
}
```

#### 1.3d — `output_data` JSON Shape (Student path)

```typescript
interface StudentReportOutput {
  role: 'student'
  generatedAt: string

  sections: {
    ideaMatches:          StudentIdeaMatch[]    // top 3
    skillsToLearn:        SkillItem[]
    mvpRoadmap?:          MonthPlan[]           // only if intent='build'
    freeResources:        ResourceItem[]
    studentPrograms:      ProgramItem[]
    validationGuide:      string
  }
}
```

---

### 1.4 Table: `conversations`

Stores Q&A chat history for each report.

```typescript
export const conversations = pgTable('conversations', {
  id:          uuid('id').primaryKey().defaultRandom(),
  reportId:    uuid('report_id').notNull().references(() => reports.id, { onDelete: 'cascade' }),
  userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  messages:    jsonb('messages').notNull().default([]),  // see §1.4a
  turnCount:   integer('turn_count').notNull().default(0),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  reportIdIdx: uniqueIndex('conversations_report_id_idx').on(table.reportId),
              // one conversation per report
}))
```

#### 1.4a — `messages` JSON shape

```typescript
interface ConversationMessage {
  role:      'user' | 'assistant'
  content:   string
  timestamp: string    // ISO
}

// messages column stores: ConversationMessage[]
```

---

### 1.5 Table: `scheme_cache`

Caches government scheme lookups to avoid redundant AI calls.

```typescript
export const schemeCache = pgTable('scheme_cache', {
  id:        uuid('id').primaryKey().defaultRandom(),
  cacheKey:  text('cache_key').notNull(),    // `${industry}:${normalised_region}`
  schemes:   jsonb('schemes').notNull(),     // SchemeItem[]
  fetchedAt: timestamp('fetched_at').notNull().defaultNow(),
}, (table) => ({
  cacheKeyIdx: uniqueIndex('scheme_cache_key_idx').on(table.cacheKey),
}))
```

**Cache TTL:** 24 hours. Queries check `fetchedAt > NOW() - INTERVAL '24 hours'`.

---

### 1.6 Table: `news_cache`

Caches NewsAPI results per industry+region query.

```typescript
export const newsCache = pgTable('news_cache', {
  id:        uuid('id').primaryKey().defaultRandom(),
  query:     text('query').notNull(),     // the search query used
  articles:  jsonb('articles').notNull(), // NewsArticle[]
  fetchedAt: timestamp('fetched_at').notNull().defaultNow(),
}, (table) => ({
  queryIdx: uniqueIndex('news_cache_query_idx').on(table.query),
}))
```

**Cache TTL:** 6 hours (news changes faster than schemes).

---

### 1.7 Row Level Security (Supabase RLS)

```sql
-- Enable RLS on all user-data tables
ALTER TABLE users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports      ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own row
CREATE POLICY users_self_access ON users
  USING (id = auth.uid());

-- Users can read their own reports, or public shared reports
CREATE POLICY reports_own_or_shared ON reports
  FOR SELECT USING (
    user_id = auth.uid()
    OR share_token IS NOT NULL
  );

-- Users can only insert/update their own reports
CREATE POLICY reports_own_write ON reports
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY reports_own_update ON reports
  FOR UPDATE USING (user_id = auth.uid());

-- Conversations: only owner can access
CREATE POLICY conversations_own ON conversations
  USING (user_id = auth.uid());
```

**Note:** The Express backend connects as the `service_role` key (bypasses RLS) and enforces access control at the middleware level. RLS is an additional safety net for direct DB access.

---

## 2. API Routes

### 2.1 Authentication Routes (`/api/auth`)

#### `POST /api/auth/signup`

```typescript
// Request
{
  email:    string   // valid email format
  password: string   // min 8 chars, ≥1 number
  name:     string   // min 2 chars
}

// Response 201
{
  user: {
    id:    string
    email: string
    name:  string
  }
  accessToken: string    // JWT, 15min
  // refresh token set as HttpOnly cookie
}

// Errors
400: { error: 'VALIDATION_ERROR', fields: { email: 'Invalid format' } }
409: { error: 'EMAIL_EXISTS', message: 'An account with this email already exists' }
```

#### `POST /api/auth/login`

```typescript
// Request
{ email: string, password: string }

// Response 200
{ user: { id, email, name }, accessToken: string }

// Errors
401: { error: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' }
```

#### `POST /api/auth/refresh`

```typescript
// Request: no body; reads refresh_token from HttpOnly cookie

// Response 200
{ accessToken: string }

// Errors
401: { error: 'INVALID_REFRESH_TOKEN' }
```

#### `POST /api/auth/logout`

```typescript
// Request: Authorization: Bearer <accessToken>

// Response 200
{ message: 'Logged out successfully' }
// Clears refresh_token cookie + nullifies refreshToken in DB
```

#### `GET /api/auth/google`

Redirects to Google OAuth consent screen.

#### `GET /api/auth/google/callback`

Handles Google OAuth callback, creates/updates user, issues tokens, redirects to frontend.

---

### 2.2 Report Routes (`/api/report`)

All report routes (except share view) require `Authorization: Bearer <token>` unless noted.

#### `POST /api/report/generate`

```typescript
// Request — Startup
{
  role: 'startup'
  input: {
    ideaName:          string
    problemStatement:  string
    targetUsers:       string
    industry:          string
    businessModel:     string
    countryRegion:     string
    stage:             string
    budget:            string
    mvpStatus:         string
    knownCompetitors?: string
  }
}

// Response: SSE stream (Content-Type: text/event-stream)
// Events:
data: { "event": "pipeline_start",  "reportId": "uuid" }
data: { "event": "pipeline_step",   "step": 1, "label": "Classifying your idea..." }
data: { "event": "pipeline_step",   "step": 2, "label": "Researching market trends..." }
data: { "event": "pipeline_step",   "step": 3, "label": "Scanning government schemes..." }
data: { "event": "pipeline_step",   "step": 4, "label": "Evaluating competition..." }
data: { "event": "pipeline_step",   "step": 5, "label": "Calculating validation score..." }
data: { "event": "pipeline_step",   "step": 6, "label": "Writing your full report..." }
data: { "event": "pipeline_complete","reportId": "uuid", "score": 74, "verdict": "revise" }

// Or on failure:
data: { "event": "pipeline_error", "message": "Analysis failed. Please try again.", "code": "GEMINI_TIMEOUT" }

// HTTP status: 200 (streaming begins immediately); errors embedded in stream
```

**Rate limit:** 5 requests per user per hour. Returns `429` before stream opens if exceeded.

**Validation:** Zod schema checked before any AI calls. Returns `422` with field errors if invalid.

#### `GET /api/report/:reportId`

```typescript
// Auth: required for own reports; not required if report has shareToken
// Query params: ?token=<shareToken> (alternative to auth for shared access)

// Response 200
{
  id:          string
  role:        'startup' | 'investor' | 'student'
  status:      'complete' | 'generating' | 'failed'
  inputData:   StartupInput | InvestorInput | StudentInput
  outputData:  StartupReportOutput | InvestorReportOutput | StudentReportOutput
  score:       number | null
  verdict:     'go' | 'revise' | 'no-go' | 'na'
  shareToken:  string | null
  ideaName:    string | null
  createdAt:   string
}

// Errors
403: { error: 'FORBIDDEN' }      // authenticated but not owner, no shareToken
404: { error: 'NOT_FOUND' }
```

#### `GET /api/reports/history`

```typescript
// Auth: required

// Response 200
{
  reports: [
    {
      id:         string
      role:       string
      ideaName:   string | null
      score:      number | null
      verdict:    string
      createdAt:  string
    }
  ]
  total: number    // total owned reports (for pagination later)
}
// Returns up to 5 most recent reports, ordered by created_at DESC
```

#### `POST /api/report/:reportId/share`

```typescript
// Auth: required; must be report owner

// Response 200
{
  shareToken: string
  shareUrl:   string    // https://ventureiq.in/share/<shareToken>
}

// Creates a UUID-based share_token and stores it; idempotent (returns existing if already set)
```

#### `DELETE /api/report/:reportId/share`

```typescript
// Revokes share access by setting share_token = NULL

// Response 200
{ message: 'Share link revoked' }
```

#### `DELETE /api/report/:reportId`

```typescript
// Auth: required; must be report owner

// Response 200
{ message: 'Report deleted' }
// Cascades to: conversations, clears pdf_url
```

#### `GET /api/report/:reportId/export`

```typescript
// Auth: required

// Response 200 (if PDF already cached)
{
  pdfUrl:      string    // Cloudflare R2 presigned URL (15-min expiry)
  generatedAt: string
}

// Response 202 (if PDF generation queued — first request)
{
  status:  'generating'
  message: 'PDF is being generated. Poll this endpoint in 10 seconds.'
}
// Client polls every 5s until 200 received
```

---

### 2.3 Chat Routes

#### `POST /api/report/:reportId/chat`

```typescript
// Auth: required; must be report owner

// Request
{ message: string }   // max 1000 chars

// Response: SSE stream
data: { "event": "token", "content": "Your" }
data: { "event": "token", "content": " MVP" }
data: { "event": "token", "content": " should..." }
// ... (streamed token by token)
data: { "event": "done", "turnCount": 3 }

// Errors
403: { error: 'FORBIDDEN' }
429: { error: 'CHAT_LIMIT_REACHED', message: 'Maximum 10 turns per report.' }
```

#### `GET /api/report/:reportId/chat`

```typescript
// Auth: required

// Response 200
{
  messages: ConversationMessage[]
  turnCount: number
}
```

---

### 2.4 Health Route

#### `GET /api/health`

```typescript
// No auth

// Response 200
{
  status:    'ok'
  timestamp: string
  version:   string   // from package.json
  services: {
    database: 'ok' | 'degraded' | 'down'
    gemini:   'ok' | 'unknown'
    storage:  'ok' | 'degraded'
  }
}
```

---

## 3. Middleware Stack

### 3.1 Request Flow

```
Incoming Request
      │
      ▼
[1] Helmet (security headers)
      │
      ▼
[2] CORS (allow ventureiq.in + localhost in dev)
      │
      ▼
[3] Compression (gzip for responses > 1KB)
      │
      ▼
[4] express.json() (body parsing, 10KB limit)
      │
      ▼
[5] globalLimiter (100 req/IP/min)
      │
      ▼
[6] Route-specific middleware (auth, report limiter, etc.)
      │
      ▼
[7] Zod input validation
      │
      ▼
[8] Route handler
      │
      ▼
[9] Global error handler
```

### 3.2 Auth Middleware

```typescript
// src/middleware/auth.ts
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string }
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'MISSING_TOKEN' })
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string; email: string }
    const [user] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1)
    if (!user) return res.status(401).json({ error: 'USER_NOT_FOUND' })
    req.user = { id: user.id, email: user.email, role: user.defaultRole ?? 'startup' }
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'TOKEN_EXPIRED' })
    }
    return res.status(401).json({ error: 'INVALID_TOKEN' })
  }
}

// Optional auth — attaches user if token present, but doesn't block if absent
export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return next()
  try {
    const token = header.slice(7)
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }
    req.user = { id: payload.sub, email: '', role: '' }
  } catch {
    // ignore — optionalAuth does not fail on bad tokens
  }
  next()
}
```

### 3.3 Input Sanitisation

```typescript
// src/middleware/sanitise.ts
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window  = new JSDOM('').window
const DOMPurify = createDOMPurify(window as any)

// Recursively sanitise all string values in an object
function sanitiseObject(obj: Record<string, any>): Record<string, any> {
  if (typeof obj !== 'object' || obj === null) return obj
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      typeof v === 'string' ? DOMPurify.sanitize(v, { ALLOWED_TAGS: [] }) : sanitiseObject(v)
    ])
  )
}

export function sanitiseBody(req: Request, res: Response, next: NextFunction) {
  if (req.body) req.body = sanitiseObject(req.body)
  next()
}
```

### 3.4 Global Error Handler

```typescript
// src/middleware/errorHandler.ts
import { ZodError } from 'zod'
import * as Sentry from '@sentry/node'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log to Sentry (production only)
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(err)
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: 'VALIDATION_ERROR',
      fields: err.flatten().fieldErrors
    })
  }

  // Known operational errors (thrown intentionally)
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({
      error: err.code,
      message: err.message
    })
  }

  // Unknown errors — don't expose internals in production
  console.error('Unhandled error:', err)
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  })
}
```

---

## 4. Prompt Pipeline Architecture

### 4.1 Pipeline Orchestrator

```typescript
// src/services/pipelineService.ts

import { emitStep, emitComplete, emitError } from '../utils/sse'
import { classifyIdea }       from './geminiService'
import { fetchNews }          from './newsService'
import { fetchWebContext }    from './geminiService'
import { fetchSchemes }       from './schemeService'
import { scoreIdea }          from './geminiService'
import { generateReport }     from './geminiService'
import { db }                 from '../db'
import { reports }            from '../db/schema'
import { eq }                 from 'drizzle-orm'
import type { SSEEmitter }    from '../types'
import type { StartupInput }  from '../types/report'

export async function runStartupPipeline(
  reportId: string,
  input:    StartupInput,
  emit:     SSEEmitter
): Promise<void> {
  const startTime = Date.now()

  try {
    // Step 1: Classify
    emit('pipeline_step', { step: 1, label: 'Classifying your idea...' })
    const classification = await classifyIdea(input)

    // Step 2: Research (parallel — three calls at once)
    emit('pipeline_step', { step: 2, label: 'Researching market and trends...' })
    const [newsArticles, webContext, schemes] = await Promise.all([
      fetchNews(`${input.industry} startup trends ${input.countryRegion}`),
      fetchWebContext(input.industry, input.countryRegion),
      fetchSchemes(input.industry, input.countryRegion),
    ])

    const researchContext = { classification, newsArticles, webContext, schemes }

    // Step 3: Score
    emit('pipeline_step', { step: 3, label: 'Evaluating competition landscape...' })
    emit('pipeline_step', { step: 4, label: 'Scoring your idea on 10 dimensions...' })
    const scoringResult = await scoreIdea(input, researchContext)

    // Step 4: Report Generation
    emit('pipeline_step', { step: 5, label: 'Writing your full report...' })
    const reportOutput = await generateReport(input, researchContext, scoringResult)

    // Step 5: Save
    await db.update(reports)
      .set({
        status:       'complete',
        outputData:   reportOutput,
        score:        scoringResult.compositeScore,
        verdict:      scoringResult.verdict,
        generationMs: Date.now() - startTime,
        updatedAt:    new Date(),
      })
      .where(eq(reports.id, reportId))

    emit('pipeline_complete', {
      reportId,
      score:   scoringResult.compositeScore,
      verdict: scoringResult.verdict,
    })

  } catch (error: any) {
    await db.update(reports)
      .set({ status: 'failed', updatedAt: new Date() })
      .where(eq(reports.id, reportId))

    emit('pipeline_error', {
      message: 'Analysis failed. Please try again.',
      code:    error.code ?? 'PIPELINE_ERROR',
    })
  }
}
```

### 4.2 Gemini Service

```typescript
// src/services/geminiService.ts

import { geminiPro, geminiProWithGrounding } from '../config/gemini'
import { buildClassifyPrompt }  from '../prompts/classify'
import { buildScoringPrompt }   from '../prompts/score'
import { buildReportPrompt }    from '../prompts/report'
import { retry }                from '../utils/retry'
import type { StartupInput, ResearchContext, ScoringResult, StartupReportOutput } from '../types'

// ── Step 1: Classify ──────────────────────────────────────────────
export async function classifyIdea(input: StartupInput) {
  const prompt = buildClassifyPrompt(input)
  const result = await retry(() => geminiPro.generateContent(prompt), 3)
  const text   = result.response.text()
  return JSON.parse(text)   // { sector, subSector, businessModelType, targetMarket }
}

// ── Step 2b: Web context via Gemini grounding ─────────────────────
export async function fetchWebContext(industry: string, region: string): Promise<string> {
  const prompt = `Search for and summarise the current startup ecosystem, market trends, and opportunities in the ${industry} sector in ${region}. Focus on 2025–2026 developments. Be specific and data-driven.`
  const result = await retry(() => geminiProWithGrounding.generateContent(prompt), 2)
  // grounding returns text (not JSON)
  return result.response.text()
}

// ── Step 3: Score ─────────────────────────────────────────────────
export async function scoreIdea(input: StartupInput, context: ResearchContext): Promise<ScoringResult> {
  const prompt = buildScoringPrompt(input, context)
  const result = await retry(() => geminiPro.generateContent(prompt), 3)
  const text   = result.response.text()

  // Parse and validate output
  const parsed = JSON.parse(text)
  // ... Zod validation of parsed result ...
  return parsed
}

// ── Step 4: Report Generation ─────────────────────────────────────
export async function generateReport(
  input:   StartupInput,
  context: ResearchContext,
  scoring: ScoringResult
): Promise<StartupReportOutput> {
  const prompt = buildReportPrompt(input, context, scoring)
  const result = await retry(() => geminiPro.generateContent(prompt), 3)
  const text   = result.response.text()
  return JSON.parse(text)
}

// ── Chat: Streaming response ──────────────────────────────────────
export async function streamChatResponse(
  reportContext: string,
  history:       ConversationMessage[],
  userMessage:   string,
  onToken:       (token: string) => void,
  onDone:        () => void
) {
  const systemPrompt = buildChatSystemPrompt(reportContext)
  const contents = [
    { role: 'user',  parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Understood. I have reviewed the report and am ready to answer questions.' }] },
    ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
    { role: 'user',  parts: [{ text: userMessage }] },
  ]

  const stream = geminiPro.generateContentStream({ contents })
  for await (const chunk of (await stream).stream) {
    const token = chunk.text()
    if (token) onToken(token)
  }
  onDone()
}
```

### 4.3 Retry Utility

```typescript
// src/utils/retry.ts
export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number,
  baseDelayMs = 1000
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err: any) {
      if (i === attempts - 1) throw err
      const delay = baseDelayMs * Math.pow(2, i) + Math.random() * 500
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw new Error('Max retries exceeded')
}
```

---

## 5. Database Query Patterns

### 5.1 Common Queries

```typescript
// src/db/queries/reports.ts
import { db }      from '../index'
import { reports, conversations, schemeCache } from '../schema'
import { eq, desc, and, isNotNull, sql } from 'drizzle-orm'

// Get report with ownership check
export async function getReport(reportId: string, userId?: string) {
  const [report] = await db.select()
    .from(reports)
    .where(
      userId
        ? eq(reports.id, reportId)                                   // authenticated: must be any valid ID
        : and(eq(reports.id, reportId), isNotNull(reports.shareToken)) // unauthenticated: must be shared
    )
    .limit(1)

  if (!report) return null
  if (userId && report.userId !== userId && !report.shareToken) return null  // not owner, not shared
  return report
}

// Get user's report history (last 5)
export async function getUserReports(userId: string) {
  return db.select({
    id:        reports.id,
    role:      reports.role,
    ideaName:  reports.ideaName,
    score:     reports.score,
    verdict:   reports.verdict,
    createdAt: reports.createdAt,
  })
  .from(reports)
  .where(eq(reports.userId, userId))
  .orderBy(desc(reports.createdAt))
  .limit(5)
}

// Create report (returns ID before pipeline runs)
export async function createReport(userId: string, role: string, inputData: object, ideaName?: string) {
  const [report] = await db.insert(reports)
    .values({
      userId,
      role:      role as any,
      status:    'pending',
      inputData,
      ideaName:  ideaName ?? null,
    })
    .returning({ id: reports.id })
  return report.id
}

// Get or create conversation
export async function getOrCreateConversation(reportId: string, userId: string) {
  const existing = await db.select()
    .from(conversations)
    .where(and(eq(conversations.reportId, reportId), eq(conversations.userId, userId)))
    .limit(1)

  if (existing[0]) return existing[0]

  const [created] = await db.insert(conversations)
    .values({ reportId, userId, messages: [], turnCount: 0 })
    .returning()
  return created
}

// Append message to conversation
export async function appendMessage(conversationId: string, message: ConversationMessage) {
  await db.update(conversations)
    .set({
      messages:  sql`messages || ${JSON.stringify([message])}::jsonb`,
      turnCount: sql`turn_count + 1`,
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, conversationId))
}

// Check scheme cache
export async function getCachedSchemes(industry: string, region: string) {
  const cacheKey = `${industry}:${region.toLowerCase().replace(/\s+/g, '-')}`
  const [cached] = await db.select()
    .from(schemeCache)
    .where(
      and(
        eq(schemeCache.cacheKey, cacheKey),
        sql`fetched_at > NOW() - INTERVAL '24 hours'`
      )
    )
    .limit(1)
  return cached?.schemes ?? null
}
```

---

## 6. Migration Strategy

### 6.1 Initial Migration

```typescript
// src/db/migrations/0001_initial.ts (Drizzle Kit generates this)
// Run: npx drizzle-kit generate:pg
// Apply: npx drizzle-kit push:pg (dev) | custom migration runner (prod)
```

**Production migration process:**
1. PR merged to `main`
2. GitHub Actions runs `drizzle-kit migrate` against production DB before deploying new backend
3. If migration fails: stop deployment, alert team

**Rollback:**
- Each migration has a corresponding `down` migration
- Rollback script: `drizzle-kit migrate --to <previous_version>`

---

## 7. Environment Config (Validated)

```typescript
// src/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV:             z.enum(['development', 'test', 'production']),
  PORT:                 z.string().default('3000'),
  FRONTEND_URL:         z.string().url(),
  DATABASE_URL:         z.string().min(1),
  JWT_SECRET:           z.string().min(32),
  JWT_REFRESH_SECRET:   z.string().min(32),
  GEMINI_API_KEY:       z.string().min(1),
  NEWS_API_KEY:         z.string().min(1),
  R2_ACCOUNT_ID:        z.string().min(1),
  R2_ACCESS_KEY_ID:     z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME:       z.string().min(1),
  R2_PUBLIC_URL:        z.string().url(),
  GOOGLE_CLIENT_ID:     z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  SENTRY_DSN:           z.string().url().optional(),
})

export const env = envSchema.parse(process.env)
// App crashes on startup if any required env var is missing — fail fast
```

---

*End of Backend Schema Documentation*
