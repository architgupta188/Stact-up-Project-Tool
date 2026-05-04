# VentureIQ — Tech Stack Documentation
**Version:** 1.0 | **Date:** March 31, 2026

---

## Stack at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER              CHOICE                    VERSION           │
├─────────────────────────────────────────────────────────────────┤
│  Frontend           React + Vite              React 18, Vite 5  │
│  Styling            Tailwind CSS              v3.4              │
│  UI Components      shadcn/ui + Radix UI      latest            │
│  Charts             Recharts                  v2.12             │
│  State Management   Zustand                   v4                │
│  Data Fetching      TanStack Query            v5                │
│  Forms              React Hook Form + Zod     v7 + v3.22        │
│  Animations         Framer Motion             v11               │
│  PDF Client         —                         (server-side only) │
├─────────────────────────────────────────────────────────────────┤
│  Backend            Node.js + Express         Node 20 LTS       │
│  Language           TypeScript                v5.4              │
│  Auth               JWT + bcrypt              jsonwebtoken v9   │
│  Validation         Zod                       v3.22             │
│  Rate Limiting      express-rate-limit        v7                │
│  PDF Generation     Puppeteer                 v22               │
│  File Storage       Cloudflare R2 (S3-compat) —                 │
│  Streaming          Server-Sent Events (SSE)  native            │
├─────────────────────────────────────────────────────────────────┤
│  AI Layer           Google Gemini 1.5 Pro     API v1beta        │
│  AI SDK             @google/generative-ai     v0.15             │
│  News               NewsAPI.org               free tier         │
├─────────────────────────────────────────────────────────────────┤
│  Database           PostgreSQL via Supabase   PG 15             │
│  ORM                Drizzle ORM               v0.30             │
│  Migrations         Drizzle Kit               v0.20             │
├─────────────────────────────────────────────────────────────────┤
│  Hosting — FE       Vercel                    —                 │
│  Hosting — BE       Render                    —                 │
│  Hosting — DB       Supabase                  free tier         │
│  CDN / Storage      Cloudflare R2             free tier         │
├─────────────────────────────────────────────────────────────────┤
│  Monitoring         Sentry                    v8 SDK            │
│  Analytics          PostHog                   v1.136 (self-host)│
│  Uptime             BetterUptime              —                 │
│  CI/CD              GitHub Actions            —                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Frontend Stack

### 1.1 React + Vite

**Why React:** Team familiarity, component reuse across 3 role paths, mature ecosystem for charts and form handling. React 18 concurrent features needed for smooth streaming (Q&A responses).

**Why Vite over Next.js:**
- VentureIQ's routes are client-side; no need for SSR/SSG on the main app
- Vite's dev server is significantly faster (< 500ms HMR vs Next.js ~2s)
- Simpler deployment: output is a static bundle deployed to Vercel CDN
- No server component complexity — keeps codebase approachable for a 2-person frontend team

**Vite config (`vite.config.ts`):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['framer-motion'],
        }
      }
    }
  }
})
```

**Key project structure:**
```
src/
  assets/           Static assets (fonts, icons, illustrations)
  components/
    ui/             shadcn/ui primitives (Button, Input, etc.)
    layout/         Header, Footer, Sidebar, PageWrapper
    report/         ReportCard, ScoreRing, RadarChart, VerdictBanner
    forms/          StartupForm, InvestorForm, StudentForm
    chat/           ChatWindow, MessageBubble, StreamingMessage
    shared/         LoadingSpinner, ErrorBoundary, Toast
  hooks/            useReport, useChat, useAuth, useExport
  lib/
    api.ts          Axios instance + interceptors
    queryClient.ts  TanStack Query setup
    store.ts        Zustand store definitions
    validators.ts   Zod schemas for all forms
  pages/
    Landing.tsx
    Onboard.tsx
    StartupForm.tsx
    InvestorForm.tsx
    StudentForm.tsx
    Generating.tsx
    Report.tsx
    Chat.tsx
    History.tsx
    Share.tsx        Public read-only shared report
    Login.tsx
    Signup.tsx
  routes/
    index.tsx       React Router v6 route definitions
    ProtectedRoute.tsx
  styles/
    globals.css     Tailwind base + custom CSS variables
  types/
    report.ts       TypeScript types for all report shapes
    api.ts          API request/response types
    user.ts
```

### 1.2 Tailwind CSS

**Version:** 3.4 (not v4 yet — v4 alpha, too unstable for production)

**Configuration (`tailwind.config.ts`):**
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
        verdict: {
          go:     '#16a34a',
          revise: '#d97706',
          nogo:   '#dc2626',
        }
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-in-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ]
} satisfies Config
```

### 1.3 shadcn/ui

Used for accessible component primitives. Components used:
- `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`
- `Dialog` (modals for share link, sample report)
- `Tooltip` (score dimension tooltips)
- `Tabs` (report section navigation on mobile)
- `Accordion` (collapsible report sections on mobile)
- `Toast` / `Sonner` (success/error notifications)
- `Progress` (form step progress)
- `Badge` (verdict badge, score label)
- `Sheet` (mobile sidebar drawer)

All shadcn components live in `src/components/ui/` and are customised via Tailwind classes to match the VentureIQ design system.

### 1.4 State Management — Zustand

Zustand manages client-side state. Three stores:

**authStore:**
```typescript
interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setUser: (user: User, token: string) => void
  logout: () => void
}
```

**reportStore:**
```typescript
interface ReportStore {
  currentReport: Report | null
  generationStatus: 'idle' | 'generating' | 'complete' | 'error'
  pipelineStep: number        // 0–5, drives the generating screen
  setReport: (report: Report) => void
  setPipelineStep: (step: number) => void
  setStatus: (status: string) => void
}
```

**chatStore:**
```typescript
interface ChatStore {
  messages: Message[]
  isStreaming: boolean
  turnsUsed: number
  addMessage: (msg: Message) => void
  setStreaming: (v: boolean) => void
}
```

### 1.5 TanStack Query

Handles all server state — report fetching, history, export status.

```typescript
// Example query setup in src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:   5 * 60 * 1000,  // 5 minutes
      gcTime:      10 * 60 * 1000, // 10 minutes
      retry:       2,
      retryDelay:  (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      refetchOnWindowFocus: false,
    }
  }
})
```

Key queries:
- `useReport(reportId)` — fetches and caches single report
- `useReportHistory()` — fetches last 5 reports for /history
- `useExportPDF(reportId)` — triggers PDF generation, polls if async

### 1.6 Forms — React Hook Form + Zod

All three role forms use React Hook Form with Zod schemas for validation.

```typescript
// Example: Startup form schema (src/lib/validators.ts)
import { z } from 'zod'

export const startupFormSchema = z.object({
  page1: z.object({
    ideaName:        z.string().min(3).max(80),
    problemStatement:z.string().min(50).max(500),
    targetUsers:     z.string().min(10).max(200),
    industry:        z.enum([INDUSTRIES]),
    businessModel:   z.enum([BUSINESS_MODELS]),
  }),
  page2: z.object({
    countryRegion:   z.string().min(2),
    stage:           z.enum([STAGES]),
    budget:          z.enum([BUDGETS]),
    mvpStatus:       z.enum([MVP_STATUSES]),
    knownCompetitors:z.string().max(300).optional(),
  })
})

export type StartupFormData = z.infer<typeof startupFormSchema>
```

### 1.7 Recharts

Used for two visualisations in the startup report:

**Score Ring:** Custom `CircularProgressBar` built with recharts `RadialBarChart`
**Radar Chart:** `RadarChart` with `Radar` for 10-dimension score visualisation

Both are wrapped in custom components at `src/components/report/ScoreRing.tsx` and `src/components/report/RadarChart.tsx`.

---

## 2. Backend Stack

### 2.1 Node.js + Express + TypeScript

**Runtime:** Node.js 20 LTS (active support until April 2026)

**Why Express over Fastify or Hono:**
- Team already knows Express
- Sufficient performance for MVP (Gemini API calls are the bottleneck, not Express)
- Vast middleware ecosystem (rate limiting, multer, cors, helmet)

**Backend project structure:**
```
src/
  config/
    env.ts          Validated env vars (via zod)
    gemini.ts       Gemini client initialisation
    supabase.ts     Supabase client
    r2.ts           Cloudflare R2 client
  middleware/
    auth.ts         JWT verification middleware
    rateLimit.ts    Rate limit configs
    errorHandler.ts Global error handler
    sanitise.ts     Input sanitisation (DOMPurify on server)
  routes/
    auth.ts         /api/auth/*
    report.ts       /api/report/*
    chat.ts         /api/report/:id/chat
    export.ts       /api/report/:id/export
    health.ts       /api/health
  services/
    geminiService.ts    All Gemini API calls
    pipelineService.ts  Orchestrates the 5-step pipeline
    newsService.ts      NewsAPI integration
    pdfService.ts       Puppeteer PDF generation
    storageService.ts   R2 upload/download
    schemeService.ts    Government scheme lookup logic
  db/
    schema.ts       Drizzle ORM schema definitions
    migrations/     Drizzle migration files
    queries/        Typed query functions
  prompts/
    classify.ts     Step 1 prompt template
    research.ts     Step 2 prompt templates
    score.ts        Step 3 prompt template
    report.ts       Step 4 prompt template
    chat.ts         Follow-up Q&A system prompt
    investor.ts     Investor path prompts
    student.ts      Student path prompts
  types/
    report.ts
    gemini.ts
    api.ts
  utils/
    logger.ts       Pino logger
    retry.ts        Exponential backoff retry
    validation.ts   Zod schemas for API inputs
  app.ts            Express app setup
  server.ts         HTTP server entry point
```

**Express app setup (`src/app.ts`):**
```typescript
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { errorHandler } from './middleware/errorHandler'
import { authRouter, reportRouter, chatRouter, exportRouter } from './routes'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(compression())
app.use(express.json({ limit: '10kb' })) // prevent large payload attacks

app.use('/api/auth',   authRouter)
app.use('/api/report', reportRouter)
app.use('/api',        chatRouter)
app.use('/api',        exportRouter)
app.use('/api/health', (_, res) => res.json({ status: 'ok' }))

app.use(errorHandler)

export { app }
```

### 2.2 Authentication — JWT + bcrypt

**Access token:** 15-minute expiry, signed with `HS256`, stored in memory (not localStorage)
**Refresh token:** 7-day expiry, stored in `HttpOnly` cookie
**Passwords:** bcrypt with salt rounds = 12

**Auth flow:**
```
Login:
  POST /api/auth/login
  → Verify password with bcrypt.compare()
  → Issue access_token (15min) + refresh_token (7d in HttpOnly cookie)
  → Return { user, access_token } in body

Refresh:
  POST /api/auth/refresh
  → Read refresh_token from cookie
  → Verify → issue new access_token
  → Return { access_token }

Protected routes:
  Authorization: Bearer <access_token>
  → middleware/auth.ts verifies JWT
  → attaches req.user = { id, email, role }
```

**Google OAuth:**
- Uses `passport-google-oauth20` (or simple redirect to Google OAuth 2.0 URL)
- Callback: `GET /api/auth/google/callback` → creates/updates user → issues tokens

### 2.3 Rate Limiting

```typescript
// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit'

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,    // 1 minute
  max: 100,               // 100 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
})

export const reportGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 5,                     // 5 report generations per user per hour
  keyGenerator: (req) => req.user?.id ?? req.ip,
  message: { error: 'RATE_LIMIT_EXCEEDED', retryAfter: '...' }
})

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,               // 30 chat messages per minute per user
  keyGenerator: (req) => req.user?.id ?? req.ip,
})
```

### 2.4 PDF Generation — Puppeteer

PDF is generated server-side for consistent layout across all browsers.

**Flow:**
1. Report JSON fetched from DB
2. Render report as HTML string using a server-side template (`src/templates/report.html`)
3. Puppeteer launches headless Chrome, loads the HTML
4. Prints to PDF with A4 dimensions
5. PDF buffer uploaded to Cloudflare R2
6. R2 URL saved to `reports.pdf_url` in DB
7. Presigned download URL returned to client

```typescript
// src/services/pdfService.ts (simplified)
import puppeteer from 'puppeteer'
import { renderReportHTML } from '../templates/report'

export async function generatePDF(report: Report): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  const html = renderReportHTML(report)
  
  await page.setContent(html, { waitUntil: 'networkidle0' })
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' }
  })
  
  await browser.close()
  return pdf
}
```

**Render runs on Render.com** which supports the Chromium binary. Vercel serverless functions don't support Puppeteer.

### 2.5 Server-Sent Events (SSE) for Streaming

Two SSE uses:

1. **Pipeline progress** (report generation steps 1–5)
2. **Chat streaming** (token-by-token Gemini response)

```typescript
// SSE helper
export function createSSEResponse(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  return {
    send: (event: string, data: object) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
    },
    close: () => res.end()
  }
}
```

---

## 3. AI Layer — Gemini 1.5 Pro

### 3.1 Why Gemini 1.5 Pro

| Factor | Gemini 1.5 Pro | GPT-4o | Claude 3.5 Sonnet |
|---|---|---|---|
| Context window | 1M tokens | 128K | 200K |
| Structured JSON output | Native | Yes | Yes |
| Web grounding | Yes (native) | No (needs tools) | No |
| Free tier | Generous | No | No |
| India region latency | Low (Google infra) | Medium | Medium |
| Cost per report (est.) | ~₹5 | ~₹30 | ~₹20 |

Web grounding (the ability to search the live web during a Gemini call) is the decisive advantage — it allows Step 2b (market trend research) without a separate NewsAPI call or web scraping setup.

### 3.2 Gemini Client Setup

```typescript
// src/config/gemini.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiPro = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
  generationConfig: {
    responseMimeType: 'application/json',  // enforce structured output
    temperature: 0.4,      // lower = more consistent, less creative
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  }
})

export const geminiProWithGrounding = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  tools: [{ googleSearch: {} }],  // web grounding
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 4096,
  }
})
```

### 3.3 Prompt Versioning Strategy

All prompts are TypeScript functions that take typed inputs and return a string. This enables:
- Type-safe prompt construction
- Easy A/B testing (swap prompt function, not business logic)
- Version tracking in git

```typescript
// src/prompts/score.ts
export function buildScoringPrompt(input: StartupFormData, context: ResearchContext): string {
  return `
SYSTEM: You are a YC-style startup evaluator...
[full prompt — see PRD Appendix B]
STARTUP DATA: ${JSON.stringify(input)}
MARKET CONTEXT: ${JSON.stringify(context)}
`
}
```

---

## 4. Database — PostgreSQL via Supabase + Drizzle ORM

### 4.1 Why Supabase

- Managed PostgreSQL (no DevOps overhead in MVP)
- Built-in Row Level Security (RLS) — users can only read their own reports
- Free tier: 500MB storage, 2GB bandwidth, 50,000 monthly active users
- Built-in auth (used as a fallback, but we manage our own JWTs for more control)
- Supabase Studio for DB inspection and debugging

### 4.2 Why Drizzle ORM

- TypeScript-first (types inferred from schema)
- Lightweight (no heavy abstraction like Sequelize/Prisma)
- SQL-like query syntax (team transitions easily)
- Drizzle Kit for type-safe migrations

### 4.3 Drizzle schema (see Backend Schema doc for full detail)

```typescript
// src/db/schema.ts (abbreviated)
import { pgTable, uuid, text, integer, jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum     = pgEnum('role', ['startup', 'investor', 'student'])
export const verdictEnum  = pgEnum('verdict', ['go', 'revise', 'no-go', 'na'])

export const users = pgTable('users', {
  id:        uuid('id').primaryKey().defaultRandom(),
  email:     text('email').notNull().unique(),
  name:      text('name'),
  role:      roleEnum('role'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const reports = pgTable('reports', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  role:        roleEnum('role').notNull(),
  inputData:   jsonb('input_data').notNull(),
  outputData:  jsonb('output_data'),
  score:       integer('score'),
  verdict:     verdictEnum('verdict'),
  shareToken:  text('share_token').unique(),
  pdfUrl:      text('pdf_url'),
  createdAt:   timestamp('created_at').defaultNow(),
  updatedAt:   timestamp('updated_at').defaultNow(),
})
```

---

## 5. Infrastructure and DevOps

### 5.1 Hosting Architecture

```
[User Browser]
      │
      ▼
[Vercel CDN — React SPA]          ventureiq.in
      │
      │ API calls
      ▼
[Render.com — Express API]        api.ventureiq.in
      │
      ├──► [Supabase PG]          db.supabase.co (managed)
      ├──► [Gemini API]           generativelanguage.googleapis.com
      ├──► [NewsAPI]              newsapi.org
      └──► [Cloudflare R2]        r2.ventureiq.in (PDF storage)
```

### 5.2 Environment Variables

**Frontend (`VITE_` prefix for client exposure):**
```
VITE_API_URL=https://api.ventureiq.in
VITE_POSTHOG_KEY=phc_xxx
VITE_SENTRY_DSN=https://xxx@sentry.io/yyy
```

**Backend:**
```
# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://ventureiq.in

# Auth
JWT_SECRET=<256-bit random>
JWT_REFRESH_SECRET=<256-bit random>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# AI
GEMINI_API_KEY=AIza...

# Database
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# News
NEWS_API_KEY=xxx

# Storage
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=ventureiq-pdfs
R2_PUBLIC_URL=https://r2.ventureiq.in

# Google OAuth
GOOGLE_CLIENT_ID=xxx.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=https://api.ventureiq.in/api/auth/google/callback

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/yyy
```

### 5.3 CI/CD — GitHub Actions

```yaml
# .github/workflows/deploy.yml (simplified)
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

### 5.4 Cost Estimate (MVP Phase, Monthly)

| Service | Plan | Estimated Cost |
|---|---|---|
| Vercel | Hobby (free) | ₹0 |
| Render | Starter ($7/mo) | ~₹580 |
| Supabase | Free tier | ₹0 |
| Cloudflare R2 | Free (10GB) | ₹0 |
| Gemini API | Free tier (60 QPM) | ₹0 |
| NewsAPI | Free (100 req/day) | ₹0 |
| Sentry | Developer (free) | ₹0 |
| PostHog | Open-source (free) | ₹0 |
| Domain | — | ~₹800/year |
| **Total** | | **~₹580/month** |

**Scale threshold:** Free tiers support ~500 report generations/day. Beyond that, Gemini API paid tier (~₹5/report) + Supabase Pro (~$25/mo) kicks in.

---

## 6. Key Technical Decisions Log

| Decision | Chosen | Rejected | Reason |
|---|---|---|---|
| Frontend framework | React + Vite | Next.js | No SSR needed; Vite faster DX |
| Backend language | TypeScript | JavaScript | Type safety across API contracts |
| ORM | Drizzle | Prisma | Lighter, SQL-like, faster migrations |
| AI model | Gemini 1.5 Pro | GPT-4o | Web grounding, cost, India latency |
| PDF generation | Puppeteer (server) | jsPDF (client) | Better fidelity, no browser dependency |
| State management | Zustand | Redux / Jotai | Simplest API, minimal boilerplate |
| Auth storage | Memory + HttpOnly cookie | localStorage | Security (no XSS token theft) |
| Streaming protocol | SSE | WebSocket | One-way server→client sufficient; simpler |
| DB hosting | Supabase | Railway PG | Free tier, managed, built-in RLS |

---

*End of Tech Stack Documentation*
