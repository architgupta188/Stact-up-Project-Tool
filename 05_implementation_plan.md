# VentureIQ — Implementation Plan
**Version:** 1.0 | **Date:** March 31, 2026  
**MVP Duration:** 4 Weeks | **Full v1 Duration:** 8 Weeks

---

## Team

| Role | Count | Responsibility |
|---|---|---|
| Frontend Dev (FE1, FE2) | 2 | React components, pages, form logic, report UI |
| Backend Dev (BE) | 1 | API routes, auth, pipeline orchestration, DB queries |
| AI/Prompt Engineer (AI) | 1 | Gemini integration, prompt design, output validation |
| Designer (DS) | 1 | Component specs, design tokens, review |

**Collaboration tools:** GitHub (code), Linear (tasks), Figma (design), Slack (comms)  
**Branching:** `main` → production | `develop` → staging | `feature/*` → PRs into develop  
**PR rule:** ≥ 1 approval required; all CI checks must pass

---

## Pre-Sprint: Setup (Days 1–2, before Week 1)

**Owner: All**

| Task | Owner | Done When |
|---|---|---|
| Create GitHub repos (frontend + backend) | BE | Repos exist with `.gitignore`, `README.md` |
| Set up Supabase project and get credentials | BE | DB accessible, env vars noted |
| Set up Vercel project linked to frontend repo | FE1 | Auto-deploy on push to `main` |
| Set up Render project linked to backend repo | BE | Auto-deploy on push to `main` |
| Set up Cloudflare R2 bucket | BE | Bucket exists, credentials in `.env.example` |
| Get Gemini API key | AI | Key in team password manager |
| Get NewsAPI key | BE | Key in team password manager |
| Initialise frontend: `npm create vite@latest` + Tailwind + shadcn | FE1 | `npm run dev` opens blank app |
| Initialise backend: Express + TypeScript + Drizzle setup | BE | `npm run dev` starts Express on 3000 |
| Set up `.env` files from `.env.example` | All | Local dev works end-to-end |
| Figma design file created with colour tokens + type scale | DS | Shared link sent to team |
| Create Linear project with all Week 1 tasks | FE1 | All tasks visible in board |

---

## Week 1: Foundation & Auth

**Goal:** A user can sign up, pick a role, fill the startup form, and get any AI response back.

### Day 1 (Monday)

**FE1:**
- [ ] Set up React Router v6 with all routes (`/`, `/onboard`, `/startup`, `/investor`, `/student`, `/login`, `/signup`, `/report/:id`, `/history`)
- [ ] Create `AppShell` component with `Header` (logo + nav + login CTA)
- [ ] Create `ProtectedRoute` component (redirects unauthenticated users to `/login`)
- [ ] Set up Zustand `authStore`

**FE2:**
- [ ] Install and configure `react-hook-form` + `zod`
- [ ] Create `FormField` wrapper component (label + input/textarea + error + hint)
- [ ] Create `Button` component with all variants (primary, secondary, ghost, danger, sizes, loading state)
- [ ] Set up global CSS variables (all colour tokens from Frontend Guidelines §1.2)

**BE:**
- [ ] Define full Drizzle ORM schema (`users`, `reports`, `conversations`, `scheme_cache`, `news_cache`)
- [ ] Run `drizzle-kit generate:pg` and apply migration to Supabase
- [ ] Scaffold Express app with all middleware (helmet, cors, compression, rate-limit)
- [ ] Add `/api/health` route

**DS:**
- [ ] Deliver Figma specs for: Landing page hero, Role selection screen, Sign Up / Login forms

---

### Day 2 (Tuesday)

**FE1:**
- [ ] Build Landing page (`/`) — hero, role cards, how-it-works section
- [ ] Build Role Selection page (`/onboard`) — 3 cards, role state passed to next route
- [ ] Build Login page (`/login`) — form + Google OAuth button (placeholder)
- [ ] Build Sign Up page (`/signup`) — form with confirm password

**BE:**
- [ ] `POST /api/auth/signup` — bcrypt hash, insert user, issue JWT pair
- [ ] `POST /api/auth/login` — verify password, issue JWT pair
- [ ] `POST /api/auth/refresh` — verify HttpOnly cookie, issue new access token
- [ ] `POST /api/auth/logout` — clear cookie, null refresh token in DB
- [ ] `requireAuth` middleware

**AI:**
- [ ] Set up `@google/generative-ai` SDK
- [ ] Configure `geminiPro` client (with JSON output mode)
- [ ] Configure `geminiProWithGrounding` client
- [ ] Write and test basic classify prompt (input: startup form → output: classification JSON)

---

### Day 3 (Wednesday)

**FE1:**
- [ ] Wire login/signup forms to `POST /api/auth/login` and `/signup`
- [ ] Store `accessToken` in memory (Zustand `authStore`), `refresh_token` in HttpOnly cookie
- [ ] Implement token refresh interceptor in Axios (`src/lib/api.ts`)
- [ ] Set up TanStack Query `queryClient`

**FE2:**
- [ ] Build Startup Form — Page 1 of 3 (Idea Name, Problem Statement, Target Users, Industry dropdown, Business Model dropdown)
- [ ] All form fields validated with Zod schema on blur + submit
- [ ] Progress step indicator component (`ProgressSteps`)
- [ ] Form state persisted to `localStorage` (so refresh doesn't wipe the form)

**BE:**
- [ ] Google OAuth routes (`GET /api/auth/google`, `GET /api/auth/google/callback`)
- [ ] `POST /api/report/generate` route scaffold — create report record, return `reportId` + begin pipeline as async job
- [ ] Retry utility (`src/utils/retry.ts`)

**AI:**
- [ ] Write and validate `classifyIdea()` function against 10 test inputs
- [ ] Write `fetchWebContext()` with web grounding
- [ ] Unit test: mock Gemini response → validate JSON shape with Zod

---

### Day 4 (Thursday)

**FE2:**
- [ ] Build Startup Form — Page 2 of 3 (Region, Stage, Budget, MVP Status, Competitors)
- [ ] Build Startup Form — Page 3 of 3 (Review screen, read-only summary cards, [Edit] links)
- [ ] `[Analyse My Idea]` button submits → POST to `/api/report/generate`

**FE1:**
- [ ] Build `/generating` page — pipeline step indicator
- [ ] SSE connection to backend: receive `pipeline_step` events, update `reportStore.pipelineStep`
- [ ] On `pipeline_complete`: redirect to `/report/:reportId`
- [ ] On `pipeline_error`: show error state with retry

**BE:**
- [ ] SSE response helper (`createSSEResponse`)
- [ ] `runStartupPipeline()` orchestrator — Steps 1 + 2 (parallel) working
- [ ] `fetchNews()` via NewsAPI + `newsCache` table logic (6-hour TTL)
- [ ] `fetchSchemes()` via Gemini + `schemeCache` table logic (24-hour TTL)

**AI:**
- [ ] Complete `fetchSchemes()` prompt — India-specific government programs, tested for B2B SaaS, EdTech, LogTech
- [ ] Validate scheme output schema

---

### Day 5 (Friday) — Week 1 Integration + Review

**All:**
- [ ] Full end-to-end test: sign up → startup form → generating screen → any AI output in console
- [ ] Fix all integration blockers
- [ ] Week 1 retrospective (15 min): what's blocked, what's changing for Week 2

**Done criteria for Week 1:**
- [ ] User can sign up with email/password ✓
- [ ] User can log in and stay logged in (token refresh works) ✓
- [ ] Role selection screen routes to startup form ✓
- [ ] Startup form validates all fields and submits ✓
- [ ] Backend receives submission, creates report record, begins pipeline ✓
- [ ] Pipeline Steps 1 + 2 complete and emit SSE events ✓
- [ ] `/api/health` returns `{ status: 'ok' }` ✓

---

## Week 2: Core Pipeline & Report Engine

**Goal:** End-to-end startup report with structured content, scoring, and all 14 sections rendered.

### Day 1 (Monday)

**AI:**
- [ ] Write scoring prompt (`buildScoringPrompt`) — all 10 dimensions, few-shot examples
- [ ] Test against 5 real startup ideas — verify scores are sensible
- [ ] Write `scoreIdea()` service function
- [ ] Zod validation for scoring output

**BE:**
- [ ] Add Steps 3 and 4 to `runStartupPipeline()` (scoring + report generation)
- [ ] Validate pipeline completes end-to-end with real Gemini calls (staging key)
- [ ] Measure average pipeline duration; aim < 60s

**DS:**
- [ ] Deliver Figma specs for: Report page layout (verdict banner, section cards, sidebar, score ring, radar chart)

---

### Day 2 (Tuesday)

**AI:**
- [ ] Write report generation prompt (`buildReportPrompt`) — all 14 sections as structured JSON
- [ ] Test report output for 3 different startup profiles
- [ ] Iterate on prompt until all 14 sections are consistently populated

**FE1:**
- [ ] Build `VerdictBanner` component (verdict + score + rationale, all three colour states)
- [ ] Build `ScoreRing` component (Recharts `RadialBarChart`, animated mount)
- [ ] Build `DimensionRadar` component (10-axis radar chart)

**FE2:**
- [ ] Build `ReportSectionCard` component (expand/collapse, numbered header, icon)
- [ ] Build report page layout (3-column desktop, responsive breakpoints)
- [ ] TOC sidebar with active section highlight (using `IntersectionObserver`)

---

### Day 3 (Wednesday)

**FE1 + FE2:**
- [ ] `GET /api/report/:reportId` — fetch and display full report
- [ ] Render all 14 sections from `outputData.sections`
- [ ] Section 5 (Competition): competitor cards with threat badge
- [ ] Section 6 (Trends): news feed cards
- [ ] Section 7 (Gov Schemes): scheme cards with "verify on portal" link
- [ ] Section 9 (Score): interactive score card — ring + radar + dimension rows with tooltips
- [ ] Section 13 (30-Day Plan): weekly timeline chips

**BE:**
- [ ] `GET /api/report/:reportId` route — with ownership check
- [ ] `GET /api/reports/history` route — last 5 reports
- [ ] Add `ideaName` denormalisation (extracted from inputData on insert)

**AI:**
- [ ] Fine-tune report prompt: ensure `action_plan` has Week 1–4 structure
- [ ] Fine-tune competition section: always return 3–5 competitors (real or researched)

---

### Day 4 (Thursday)

**FE1:**
- [ ] Build `/history` page — report history list with role/score/verdict
- [ ] Build report skeleton loading state (Tailwind `animate-pulse` placeholders)
- [ ] Error states: `ReportLoadError`, `ReportNotFound`, `GenerationTimeout`

**FE2:**
- [ ] Mobile responsive report: accordion sections, collapsed by default
- [ ] Mobile bottom action bar (Export / Share / Q&A)
- [ ] Score ring scaled for mobile (120px)

**BE:**
- [ ] `GET /api/report/:reportId` — handle shared token access (no auth required if `shareToken` matches)
- [ ] Input sanitisation middleware active on all POST routes

---

### Day 5 (Friday) — Week 2 Integration + Review

**All:**
- [ ] Full end-to-end test: sign up → startup form → report with all 14 sections → history shows it
- [ ] Test 5 different startup ideas; verify reports are coherent
- [ ] Performance check: pipeline duration P95 measured (target < 90s this week, < 60s by Week 4)

**Done criteria for Week 2:**
- [ ] All 14 report sections populated from AI ✓
- [ ] Score renders with ring + radar chart ✓
- [ ] Verdict banner correct colour per score range ✓
- [ ] Report history shows last 5 reports ✓
- [ ] Mobile layout renders correctly ✓
- [ ] P95 pipeline duration < 90s ✓

---

## Week 3: Multi-Role + Export + Chat

**Goal:** All three role paths working; PDF export; shareable links; Q&A chat.

### Day 1 (Monday)

**AI:**
- [ ] Write investor path prompts (sector overview, opportunity map, red flags, policy impact)
- [ ] Write student path prompts (idea matches, roadmap, resource list)
- [ ] Test both paths against 3 profiles each

**FE2:**
- [ ] Build Investor Form (2 pages: sector multi-select, stage, risk, budget, geography)
- [ ] Build Student Form (2 pages: interests, skills, domain, budget, intent)

**BE:**
- [ ] `runInvestorPipeline()` orchestrator (Step 1: classify, Step 2: research, Step 4: generate report — no scoring step)
- [ ] `runStudentPipeline()` orchestrator (same structure)

---

### Day 2 (Tuesday)

**FE1:**
- [ ] Build Investor Report UI — 7 sections, opportunity map 2×2 matrix
- [ ] Build Student Report UI — idea match cards (ranked #1/2/3), 90-day roadmap timeline

**BE:**
- [ ] Investor report route (`POST /api/report/generate` with `role: 'investor'`)
- [ ] Student report route (`POST /api/report/generate` with `role: 'student'`)

**AI:**
- [ ] Validate investor report: opportunity map data structure works for 2×2 matrix chart
- [ ] Validate student report: roadmap has Month 1/2/3 structure

---

### Day 3 (Wednesday)

**BE:**
- [ ] PDF service: `generatePDF(report)` with Puppeteer
- [ ] PDF HTML template (`src/templates/report.html`) — styled A4 layout
- [ ] PDF upload to Cloudflare R2 (`storageService.ts`)
- [ ] `GET /api/report/:id/export` route — returns URL or 202 if generating

**FE1:**
- [ ] Export button wired to `/api/report/:id/export`
- [ ] Poll mechanism if 202 returned (every 5s, max 10 attempts)
- [ ] Download triggered on 200 response
- [ ] Success/failure toast notifications

---

### Day 4 (Thursday)

**BE:**
- [ ] `POST /api/report/:id/share` — generate `shareToken`, save to DB
- [ ] `DELETE /api/report/:id/share` — revoke share
- [ ] `POST /api/report/:id/chat` — SSE streaming Q&A using `streamChatResponse()`
- [ ] `GET /api/report/:id/chat` — return conversation history
- [ ] Turn limit enforcement (max 10 turns per conversation)

**FE1:**
- [ ] Share modal component — copy link, Twitter/LinkedIn share
- [ ] `/share/:shareToken` page — public read-only report (no chat, no export)
- [ ] Chat window component (`ChatWindow`, `MessageBubble`, `StreamingMessage`)

**FE2:**
- [ ] Wire chat to `POST /api/report/:id/chat` SSE
- [ ] Streaming tokens rendered progressively (blinking cursor)
- [ ] Turn counter UI

---

### Day 5 (Friday) — Week 3 Integration + Review

**All:**
- [ ] Test investor path end-to-end ✓
- [ ] Test student path end-to-end ✓
- [ ] Export PDF: verify layout, file size < 3MB ✓
- [ ] Share link: verify accessible without auth ✓
- [ ] Chat: 5-turn conversation on a report, verify context retained ✓

**Done criteria for Week 3:**
- [ ] All 3 role paths produce complete reports ✓
- [ ] PDF export functional with correct layout ✓
- [ ] Share link generates and is accessible read-only ✓
- [ ] Chat responds in context of the report ✓
- [ ] Turn limit enforced at 10 ✓

---

## Week 4: Polish, Performance, QA, Launch

**Goal:** Hit all acceptance criteria; pass accessibility audit; deploy to production.

### Day 1 (Monday) — Performance + Security

**BE:**
- [ ] Measure pipeline P95 with 20 real submissions; identify slowest step
- [ ] If > 60s: optimise slowest step (usually report generation — reduce `maxOutputTokens` or split sections)
- [ ] Rate limiting verified for all routes (report: 5/hr, chat: 30/min, global: 100/min)
- [ ] Input sanitisation tested with XSS payloads (all stripped)
- [ ] JWT secret strength verified (256-bit random)

**FE1:**
- [ ] Lazy load all page components (`React.lazy()`)
- [ ] Code-split: vendor / charts / UI chunks (see `vite.config.ts`)
- [ ] Add `<link rel="preload">` for fonts in `index.html`
- [ ] Memoize `DimensionRadar` and `ScoreRing` with `React.memo()`

---

### Day 2 (Tuesday) — Accessibility Audit

**FE2 (accessibility lead):**
- [ ] Run `axe-core` automated scan on all 8 pages; fix all critical issues
- [ ] Keyboard navigation test: complete full startup flow without mouse
- [ ] Screen reader test (NVDA + Chrome): landing → form → report → chat
- [ ] Add `aria-live="polite"` to pipeline step announcer
- [ ] Add `aria-label` to all icon-only buttons (Export, Share, Bookmark)
- [ ] Verify all colour contrast ratios (use Figma contrast plugin or Chrome DevTools)
- [ ] Add `@media (prefers-reduced-motion: reduce)` overrides

**DS:**
- [ ] Review all implemented pages against Figma specs; file cosmetic issues in Linear
- [ ] Sign off or flag blocking design issues

---

### Day 3 (Wednesday) — Error States + Edge Cases

**FE1:**
- [ ] Gemini timeout error state (`> 90s`): email notification placeholder + retry
- [ ] Partial report state (some sections missing): per-section "retry" option
- [ ] Rate limit UI: "Come back in X minutes" with countdown
- [ ] Network offline: toast notification, retry button
- [ ] Empty history state (first-time user): illustration + "Create your first report" CTA

**BE:**
- [ ] Global error handler tested with all error types
- [ ] Graceful Gemini failure: save `status: 'failed'` to DB, SSE emits `pipeline_error`
- [ ] Graceful NewsAPI failure: falls back to Gemini web grounding only (no crash)
- [ ] Log all pipeline errors to Sentry

**AI:**
- [ ] Test 10 edge-case inputs (very vague idea, very niche market, no competitors provided, maximum field lengths)
- [ ] Verify outputs for all 10 are coherent and structured correctly

---

### Day 4 (Thursday) — QA Pass

**All (QA day):**

**Backend integration tests (Supertest):**
- [ ] `POST /api/auth/signup` — success, duplicate email, invalid password
- [ ] `POST /api/auth/login` — success, wrong password, nonexistent user
- [ ] `POST /api/report/generate` — startup success, investor success, student success, rate limit
- [ ] `GET /api/report/:id` — owner access, share token access, forbidden access
- [ ] `POST /api/report/:id/chat` — success, turn limit, forbidden
- [ ] `GET /api/report/:id/export` — success, 202 then 200 polling

**Frontend E2E tests (Playwright):**
- [ ] Happy path: signup → startup form → report → PDF export
- [ ] Happy path: login → investor form → report → share
- [ ] Happy path: guest → student form → report (no chat available)
- [ ] Error path: Gemini timeout simulation → error state shown
- [ ] Auth path: unauthenticated → report page → auth prompt → login → back to report

**Performance:**
- [ ] Lighthouse CI on: `/` (landing), `/startup` (form), `/report/:id` (report)
- [ ] Target: LCP < 2.5s, CLS < 0.1, Accessibility ≥ 90

---

### Day 5 (Friday) — Staging Soak + Production Deploy

**All:**
- [ ] Deploy to staging (`develop` → staging Vercel + Render URLs)
- [ ] 4-hour soak test on staging (team uses staging normally, generates real reports)
- [ ] Monitor Sentry for any new errors
- [ ] Verify uptime > 99.5% during soak (BetterUptime)

**If all checks pass:**
- [ ] Merge `develop` → `main`
- [ ] GitHub Actions deploys to production automatically
- [ ] Smoke test on production: one report from each role path
- [ ] Verify PostHog receiving events

**Done criteria for Week 4 (= MVP Launch Criteria):**
- [ ] P95 pipeline duration < 60s ✓
- [ ] All E2E tests passing ✓
- [ ] All integration tests passing ✓
- [ ] Zero P1 bugs in staging ✓
- [ ] Lighthouse Accessibility ≥ 90 on all key pages ✓
- [ ] Sentry error rate < 1% over 4-hour soak ✓
- [ ] Production smoke test: 3 reports (one per role) generated successfully ✓
- [ ] PostHog events: `role_selected`, `report_generated`, `pdf_exported` confirmed firing ✓

---

## Phase 2: v1 Full (Weeks 5–8)

### Week 5 — Live Data Layer

| Task | Owner | Priority |
|---|---|---|
| Government scheme database: manual curated seed data (50 schemes) covering all 20 industries | AI + BE | P1 |
| Scheme refresh cron job (daily, 2am IST) | BE | P1 |
| News digest: scheduled daily pull of top 10 stories per industry | BE | P1 |
| News cache strategy: store 7-day rolling history | BE | P2 |
| Government scheme "Verify" deep links to official portals for top 20 schemes | DS + FE | P2 |
| Industry trend signal page (new route `/trends`) — live news feed by sector | FE + BE | P2 |

---

### Week 6 — User Features

| Task | Owner | Priority |
|---|---|---|
| Idea comparison tool: submit 2 ideas → side-by-side score comparison | FE + BE + AI | P1 |
| Bookmarking: save report with custom label | FE + BE | P1 |
| Report history: expand from 5 to 20 with pagination | FE + BE | P1 |
| Search within report history | FE | P2 |
| Report notes: user can add private annotations to sections | FE + BE | P2 |
| Dark mode: implement `[data-theme="dark"]` CSS variable toggle | FE | P2 |

---

### Week 7 — Share + Discovery

| Task | Owner | Priority |
|---|---|---|
| Share page OG preview image (dynamic, server-rendered): verdict + score + idea name | BE | P1 |
| Public report directory (opt-in): users can list their report publicly | FE + BE | P2 |
| Shareable report with inline "Generate yours" CTA (growth loop) | FE + DS | P1 |
| Referral tracking: `?ref=` param on share links → PostHog attribution | BE | P2 |
| Report embed widget (iframe embed for blogs) | FE | P3 |

---

### Week 8 — Admin + Stability

| Task | Owner | Priority |
|---|---|---|
| Admin panel: daily active users, report count by role, avg score, pipeline latency | FE + BE | P1 |
| Monitoring dashboard: Sentry + BetterUptime + PostHog in one Notion page | All | P1 |
| Gemini cost tracker: daily Gemini API token usage vs budget | BE | P1 |
| Load test: K6 script, 100 concurrent users, confirm stability | BE | P1 |
| User email notification: "Your report is ready" (for reports that timeout > 90s) | BE | P2 |
| v1 production release notes + changelog | All | P1 |

---

## Risk-Adjusted Buffer Plan

If Week 4 ends with P1 bugs not resolved, the priority order for deferral is:

1. Move `idea comparison tool` to Week 6 scope (already planned there)
2. Move `dark mode` to Week 7
3. Move `public report directory` to post-v1
4. Keep: auth, all 3 role paths, export, share, chat — these are non-negotiable for launch

**Never defer:**
- PDF export
- Share link
- Rate limiting
- Error states
- Accessibility audit

---

## Definition of Done (Global)

A task is "Done" when:
1. Code is written and self-reviewed
2. PR opened with description linking to Linear task
3. ≥ 1 peer approval received
4. All CI checks pass (lint, type-check, tests)
5. Merged to `develop` (or `main` for production)
6. Acceptance criteria from the PRD or this plan are demonstrably met

A feature is "Done" when:
1. All tasks in the feature are Done
2. E2E test exists and passes
3. Designer has reviewed the implementation
4. No P1 bugs filed against it

---

## Metrics to Track During Build

Check these every Friday:

| Metric | Week 1 Target | Week 2 Target | Week 3 Target | Week 4 Target |
|---|---|---|---|---|
| Pipeline P95 latency | — (unmeasured) | < 90s | < 75s | < 60s |
| E2E test coverage | 0 | 1 path | 3 paths | 6 paths |
| Open P1 bugs | — | 0 | 0 | 0 |
| Lighthouse Accessibility | — | ≥ 75 | ≥ 85 | ≥ 90 |
| API test coverage (routes) | 30% | 60% | 80% | 100% |

---

*End of Implementation Plan*
