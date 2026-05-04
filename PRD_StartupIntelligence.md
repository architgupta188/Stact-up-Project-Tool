a# Product Requirements Document
## VentureIQ — AI Startup Validation & Intelligence Platform
**Version:** 1.0 | **Date:** March 31, 2026 | **Status:** Draft — Ready for Engineering Handoff  
**Owner:** Product Team | **Reviewers:** Engineering Lead, Design Lead, QA Lead

---

## Project Brief

VentureIQ is a web-based AI intelligence platform that gives three distinct audiences — startup founders, investors, and students — a structured, data-backed decision-making engine. A founder submits their idea, VentureIQ runs it through an AI pipeline (Gemini API + live news + government scheme lookups), returns a scored validation report in the style of a YC partner review, and lets the user export a PDF and continue with follow-up Q&A.

The platform is not a chatbot. It is a decision-support system with role-aware flows, structured scoring, live market context, and professional report output.

---

## 1. Vision and Problem Statement

### Vision
Every year, thousands of founders in India and other emerging markets build the wrong thing because they lack access to structured market validation, investor-grade analysis, and policy intelligence. VentureIQ democratises access to startup due-diligence quality thinking — in minutes, not months.

### Problem Statement
| Segment | Core Pain |
|---|---|
| Startup founders | No structured way to know if an idea is viable before spending months building it |
| Investors | Market intelligence is scattered; identifying promising early-stage sectors requires time-consuming research |
| Students | No clear path from "I have an idea" to "here's what I should do first" |

### Target Users
- **Primary:** Early-stage founders in India (pre-seed to seed), ages 22–40
- **Secondary:** Angel investors and VC analysts in South/Southeast Asia
- **Tertiary:** College students at engineering and business institutions exploring entrepreneurship

### Measurable Success Criteria
- 70% of users complete the full validation flow (from role selection to report generation) within a single session
- Average report generation time < 45 seconds
- 60%+ of startup users rate the report "useful" or "very useful" in post-session survey
- PDF export used by ≥ 40% of users who complete a report
- Month-3 retention (users returning for a second report): ≥ 25%

---

## 2. Goals and Success Metrics

### Primary Goals
| Goal | KPI | Threshold |
|---|---|---|
| Drive report completion | Funnel completion rate (role select → report) | ≥ 70% |
| Deliver fast analysis | P95 report generation latency | ≤ 60 seconds |
| Ensure output quality | User satisfaction score (post-report survey) | ≥ 4.0 / 5.0 |
| Enable export utility | PDF export conversion | ≥ 40% of completions |
| Build retention | D30 return rate | ≥ 25% |

### Secondary Goals
| Goal | KPI | Threshold |
|---|---|---|
| Grow organic reach | Shareable report links clicked | ≥ 500/month by Month 2 |
| Validate multi-role value | Investor path completion rate | ≥ 55% |
| Support student engagement | Student path completion rate | ≥ 65% |
| System reliability | Uptime | ≥ 99.5% |
| Contain costs | Gemini API cost per report | ≤ ₹8 (~$0.10) |

---

## 3. Personas and User Scenarios

### Persona 1 — Priya, the First-Time Founder
**Background:** 26-year-old software engineer in Jaipur. Has an idea for a hyperlocal delivery platform targeting Tier 2 cities. No startup experience. Has ₹50,000 to invest.

**Goals:** Know if the idea is worth pursuing. Understand who the competitors are. Find any government grants she qualifies for.

**Frustrations:** Generic Google searches return big-city-focused data. Startup forums are noisy. She doesn't know what a go-to-market strategy even means yet.

**User Story:**
> As a first-time founder, I want to enter my idea and business details and receive a scored, structured analysis with clear next steps so that I can decide whether to pursue the idea or pivot before wasting time or money.

**Typical Workflow:**
1. Opens VentureIQ → selects "Startup / Company"
2. Fills idea form: name, problem, target users, industry (Logistics), region (Rajasthan), stage (Idea), budget (< ₹1L), no MVP yet
3. Submits → waits ≤ 45 seconds
4. Reads validation report: sees score 62/100 ("Revise"), strong problem-solution fit but high competition
5. Reviews government schemes (MSME Digital India, Startup India Seed Fund)
6. Opens follow-up chat: "What should I build in my MVP first?"
7. Exports PDF to share with her mentor

---

### Persona 2 — Rahul, the Angel Investor
**Background:** 38-year-old former SaaS founder turned angel investor in Bengaluru. Has a ₹50L deployment budget. Focuses on B2B SaaS and deep tech. Wants to stay ahead of policy-driven sector shifts.

**Goals:** Identify which sectors are heating up. Avoid over-crowded markets. Understand government-backed opportunities.

**User Story:**
> As an angel investor, I want sector intelligence and startup trend analysis filtered by my investment criteria so that I can prioritise which categories to source deals in this quarter.

**Typical Workflow:**
1. Selects "Investor" → fills profile: B2B SaaS + Deep Tech, Early stage, Medium risk, India, ₹10L–₹50L ticket
2. Report generates: top 3 trending sectors, red flags, government-backed opportunities, policy news
3. Clicks into "High-growth potential sectors" card → sees 5 specific startup categories
4. Bookmarks report → shares link with co-investor

---

### Persona 3 — Arjun, the Engineering Student
**Background:** 20-year-old B.Tech student at MUJ. Interested in EdTech and AI. Has no budget but has 6 months before placement season. Wants to either build something or join an early-stage startup.

**Goals:** Understand what startup he could realistically build. Get a roadmap. Learn what skills to develop.

**User Story:**
> As a student with limited resources, I want to discover startup ideas that match my skills and interests and get a step-by-step learning roadmap so that I can begin building before graduation.

**Typical Workflow:**
1. Selects "Student / Explorer" → enters interests (AI, EdTech), skills (Python, React), domain preference (Education), zero budget, wants to build
2. Report: 3 suitable startup ideas ranked by beginner-friendliness, skills-to-learn list, 90-day MVP roadmap, free government/incubator resources
3. Asks follow-up: "How do I validate an EdTech idea with no money?"
4. Exports PDF as a personal action plan

---

## 4. Scope and Boundaries

### In-Scope (MVP — Weeks 1–4)
- Role-based onboarding (Startup / Investor / Student)
- Structured input forms for each role
- Gemini API-powered analysis pipeline
- Validation scoring engine (0–100 score, Go/Revise/No-Go verdict)
- Structured report UI (all sections listed in §5)
- Government scheme discovery (India-focused, keyword-matched via AI)
- News and trend context (via Gemini web grounding or NewsAPI)
- Follow-up Q&A chat (scoped to the current report context)
- PDF export of full report
- Shareable report link (public, read-only)
- Basic authentication (email/password + Google OAuth)
- Report history (last 5 reports per user)

### Non-Goals (Explicitly Excluded from MVP)
- Mobile native app (web-responsive only)
- Real-time competitor monitoring dashboard
- Investor-to-startup matching / deal-flow CRM
- Multi-language support (English only in MVP)
- Payment/subscription tier enforcement (MVP is free)
- Admin analytics panel
- Trend forecasting / predictive models
- Vector database semantic search
- Email digests / alerts

### Constraints
| Constraint | Detail |
|---|---|
| Timeline | 4-week MVP; 8-week full v1 |
| Team | 2 frontend devs, 1 backend dev, 1 AI/prompt engineer, 1 designer |
| Budget | ₹0 external data subscriptions in MVP; use free tiers (NewsAPI free, Gemini API free tier) |
| Tech Stack | React + Vite, Node.js/Express, PostgreSQL, Gemini 1.5 Pro, Tailwind CSS |
| Hosting | Vercel (frontend), Railway or Render (backend), Supabase (DB) |

---

## 5. Requirements

### 5A. Functional Requirements

#### User Flow 1: Startup Validation

**Entry:** User selects "Startup / Company" on role screen

**Form Fields (all required unless marked optional):**
- Idea Name (text, max 80 chars)
- Problem Statement (textarea, 50–500 chars)
- Target Users (text, max 200 chars)
- Industry (dropdown: 20 predefined categories)
- Business Model (dropdown: SaaS / Marketplace / D2C / Service / Hardware / Other)
- Country / Region (text with autocomplete)
- Startup Stage (dropdown: Idea / MVP / Early Revenue / Growth)
- Budget Range (dropdown: < ₹1L / ₹1–5L / ₹5–25L / ₹25L+ / Undisclosed)
- Current MVP Status (dropdown: None / Wireframe / Prototype / Live)
- Known Competitors (textarea, optional)

**Acceptance Criteria:**
- AC-1: Form validates all required fields before submission; inline error messages appear within 200ms of blur
- AC-2: On submit, a loading state with progress indicator appears immediately
- AC-3: Report renders within 60 seconds (P95); error message shown if timeout exceeded
- AC-4: Report contains all 14 sections defined in §5A Report Structure
- AC-5: Validation score is a number 0–100 with a coloured badge (Red: 0–39, Amber: 40–69, Green: 70–100) and one of three verdicts: No-Go / Revise / Go

**Report Structure (Startup Path):**

| # | Section | Description |
|---|---|---|
| 1 | Idea Summary | AI-rewritten one-paragraph summary |
| 2 | Problem Statement Analysis | Depth and urgency of the problem |
| 3 | Target Audience Clarity | How well-defined the user segment is |
| 4 | Market Opportunity | TAM/SAM/SOM (estimated, qualitative) |
| 5 | Competition Analysis | Known + AI-discovered competitors, positioning |
| 6 | Industry Trends & News | 3–5 relevant recent news items or trends |
| 7 | Government Schemes & Support | Applicable schemes for this startup profile |
| 8 | MVP Suggestions | Specific, narrow MVP recommendation |
| 9 | Validation Score | 0–100 composite score with sub-scores |
| 10 | Risks & Weaknesses | Top 3–5 critical risks |
| 11 | Improvement Recommendations | Prioritised action items |
| 12 | Funding & Investor Fit | Suitable funding type and investor profile |
| 13 | Next 30-Day Action Plan | Concrete weekly milestones |
| 14 | Final Verdict | Go / Revise / No-Go with one-sentence rationale |

**Scoring Sub-Dimensions (each 0–10, averaged and normalised to 100):**
- Pain Level, Urgency, Market Size, Speed of Adoption, Competition Intensity (inverted), Willingness to Pay, Differentiation, Execution Difficulty (inverted), MVP Feasibility, Market Timing

#### User Flow 2: Investor Intelligence

**Form Fields:**
- Preferred Sector(s) (multi-select, up to 3)
- Investment Stage (Early / Growth / Late)
- Risk Appetite (Low / Medium / High)
- Budget Range (dropdown)
- Geography (text)
- Interest Keywords (optional, freetext)

**Output Sections:**
1. Sector Overview & Momentum
2. Trending Startup Categories (top 5)
3. Red Flags / Market Risks
4. Government Policy Impact
5. Investment Opportunity Map
6. Sectors to Watch This Quarter
7. Recommended Due Diligence Angles

#### User Flow 3: Student Discovery

**Form Fields:**
- Interests (multi-select or freetext)
- Current Skills (multi-select)
- Preferred Domain (dropdown)
- Available Budget (dropdown)
- Intent (Build a Startup / Join a Startup / Explore Only)

**Output Sections:**
1. Matching Startup Ideas (top 3, ranked by feasibility)
2. Skills to Develop (prioritised list)
3. 90-Day MVP Roadmap (if "Build" intent selected)
4. Free/Low-Cost Resources
5. Incubators & Government Programs for Students
6. How to Validate Without Money

#### Follow-Up Q&A
- Available after any report is generated
- Maintains report context in prompt (report JSON passed as context)
- Maximum 10 follow-up turns per session
- Response streamed token-by-token
- AC: Response latency first token ≤ 3 seconds

#### PDF Export
- Exports full report as a styled A4 PDF
- Includes VentureIQ header, report date, user role, and all sections
- Generated server-side using Puppeteer
- AC: PDF downloads within 10 seconds of clicking export; file size < 3MB

#### Shareable Link
- Generates a unique public URL: `/report/:reportId`
- No login required to view shared report
- Report content read-only; no Q&A on shared view
- AC: Link is generated within 2 seconds of report completion

---

### 5B. Data Model

```
users
  id            UUID PK
  email         TEXT UNIQUE NOT NULL
  name          TEXT
  role          ENUM('startup', 'investor', 'student')
  created_at    TIMESTAMPTZ

reports
  id            UUID PK
  user_id       UUID FK → users.id
  role          ENUM('startup', 'investor', 'student')
  input_data    JSONB            -- raw form submission
  output_data   JSONB            -- full structured report from AI
  score         INTEGER          -- 0–100 (startup path only, else NULL)
  verdict       ENUM('go','revise','no-go', 'n/a')
  share_token   TEXT UNIQUE      -- used for /report/:token
  pdf_url       TEXT             -- S3/storage URL
  created_at    TIMESTAMPTZ
  updated_at    TIMESTAMPTZ

conversations
  id            UUID PK
  report_id     UUID FK → reports.id
  messages      JSONB            -- [{role, content, timestamp}]
  turn_count    INTEGER DEFAULT 0
  created_at    TIMESTAMPTZ

scheme_cache
  id            UUID PK
  industry      TEXT
  region        TEXT
  schemes       JSONB
  fetched_at    TIMESTAMPTZ      -- cache TTL: 24 hours
```

---

### 5C. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | P95 report generation ≤ 60s; page load (LCP) ≤ 2.5s; API response (non-AI) ≤ 300ms P99 |
| **Security** | JWT auth (access token 15min / refresh 7d); input sanitised before AI prompt injection; rate limit: 5 reports/user/hour, 100 req/IP/min; no PII in AI prompts beyond what user submits |
| **Accessibility** | WCAG 2.1 AA; keyboard-navigable forms; screen-reader compatible report sections; colour contrast ≥ 4.5:1 |
| **Reliability** | ≥ 99.5% uptime; graceful degradation if Gemini API fails (show cached results or error with retry) |
| **Scalability** | Backend stateless; horizontal scaling via Railway/Render autoscale; DB connection pooling via pgBouncer |
| **Privacy** | No user data sold or used to train AI; reports stored encrypted at rest; users can delete account and all data |

---

## 6. UX/UI Concepts

### Information Architecture
```
/                   Landing page (hero + role selector CTA)
/onboard            Role selection screen
/startup            Startup idea submission form
/investor           Investor profile form
/student            Student discovery form
/report/:id         Generated report view
/report/:id/chat    Follow-up Q&A (authenticated users only)
/history            Saved reports (authenticated)
/login              Auth (email + Google)
/signup             Registration
```

### Key UX Principles
- **Role-first thinking:** Every screen after `/onboard` is role-specific. No generic dashboards.
- **Zero ambiguity in verdicts:** The Go/Revise/No-Go badge is the first thing a user sees on the report, above the fold, in large type with clear colour coding.
- **Progressive disclosure:** Report sections collapsed by default on mobile; expanded on desktop. User scrolls into depth rather than being overwhelmed.
- **Blunt AI tone:** UI copy reflects the YC-advisor voice. Section headers like "What's Actually Wrong Here" instead of "Weaknesses."

### Landing Page Layout
```
[Hero] "Validate your startup idea like a YC partner would."
  → [3 Role Cards] Startup / Investor / Student — each with one-line value prop
[Social Proof Bar] "X reports generated this week"
[Sample Report Preview] Blurred/anonymised report screenshot
[How It Works] 3-step horizontal flow: Submit → Analyse → Report
[CTA] "Start Free — No Credit Card"
```

### Report Page Layout (Desktop)
```
┌─────────────────────────────────────────────────┐
│  VERDICT BANNER: [GO / REVISE / NO-GO]  Score: 74/100  │
├──────────────────────┬──────────────────────────┤
│  LEFT SIDEBAR        │  MAIN CONTENT            │
│  Table of Contents   │  Section 1: Idea Summary │
│  (sticky, active     │  Section 2: Problem...   │
│   section highlight) │  Section 3: Market...    │
│                      │  ...                     │
│  [Export PDF]        │  Section 14: Verdict     │
│  [Share Link]        ├──────────────────────────┤
│  [Ask Follow-up]     │  FOLLOW-UP CHAT          │
└──────────────────────┴──────────────────────────┘
```

### Score Visualisation
- Large circular progress ring (0–100) with colour gradient (red → amber → green)
- 10 sub-dimension radar chart (spider chart) showing dimension scores
- Tooltip on each sub-dimension: "Pain Level: 8/10 — Users show strong, urgent need"

### Accessibility Notes
- All form inputs have visible labels (no placeholder-only patterns)
- Error messages linked via `aria-describedby`
- Loading states announced via `aria-live="polite"`
- PDF export button has `aria-label="Download full report as PDF"`
- Colour is never the sole indicator of status (badges include icon + text)

---

## 7. Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT (React + Vite)                  │
│   Role Onboarding → Forms → Report View → Chat → PDF Export     │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS / REST + SSE (streaming)
┌─────────────────────────▼───────────────────────────────────────┐
│                    API GATEWAY (Express / Node.js)               │
│   Auth Middleware → Rate Limiter → Route Handlers               │
│   /api/auth  /api/report  /api/chat  /api/export                │
└──────┬────────────────┬──────────────────┬──────────────────────┘
       │                │                  │
┌──────▼──────┐  ┌──────▼──────┐  ┌───────▼──────────┐
│  Gemini API │  │  NewsAPI /  │  │  Supabase (PG)   │
│  (Analysis  │  │  Web Fetch  │  │  users, reports, │
│   Engine)   │  │  (context)  │  │  conversations   │
└─────────────┘  └─────────────┘  └──────────────────┘
       │
┌──────▼──────────────────┐
│  Prompt Pipeline        │
│  1. Classify & structure│
│  2. Enrich with news    │
│  3. Score dimensions    │
│  4. Generate report     │
│  5. Return structured   │
│     JSON                │
└─────────────────────────┘
       │
┌──────▼──────────────────┐
│  PDF Service (Puppeteer)│
│  Renders report HTML →  │
│  PDF → Uploads to R2/S3 │
└─────────────────────────┘
```

### Tech Stack Rationale

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Fast HMR, component reuse across role paths, Tailwind for rapid UI iteration |
| Component Library | shadcn/ui | Accessible primitives, unstyled base allows full custom design |
| Charts | Recharts | Lightweight, React-native, good radar + progress ring support |
| Backend | Node.js + Express | JS across stack reduces context switching; express is minimal and team-familiar |
| AI | Gemini 1.5 Pro via Google AI SDK | Strong long-context, structured JSON output, web grounding capability, generous free tier |
| Database | Supabase (PostgreSQL) | Managed PG, built-in auth, row-level security, free tier sufficient for MVP |
| PDF | Puppeteer (headless Chrome) | Best-in-class HTML-to-PDF fidelity; runs server-side |
| Hosting | Vercel (FE) + Render (BE) | Free tier deployment; zero-config CI/CD for Vercel |
| File Storage | Cloudflare R2 | S3-compatible, free egress, PDF storage |

### Prompt Pipeline Design

```
Step 1 — CLASSIFY
  Input: raw form JSON
  Output: {sector, business_model_type, startup_stage, region_context}

Step 2 — RESEARCH CONTEXT (parallel)
  2a. Gemini web grounding: "latest trends in {sector} in {region} 2025-2026"
  2b. NewsAPI: top 5 articles matching {sector} keywords
  2c. Government scheme lookup: prompt Gemini with sector+region → known schemes

Step 3 — SCORE
  Input: form JSON + context from Step 2
  System prompt: YC-style evaluator persona
  Output: JSON with 10 dimension scores + rationale per dimension

Step 4 — REPORT GENERATION
  Input: all above
  Output: Structured JSON with all 14 sections, each section as a string

Step 5 — ASSEMBLE & CACHE
  Store in reports.output_data JSONB
  Return to client
```

---

## 8. Milestones and Timeline

### Week-by-Week MVP Plan (4 Weeks)

#### Week 1 — Foundation
**Deliverables:**
- Project scaffolding (React + Express + Supabase)
- Auth system (email/password + Google OAuth)
- Role selection screen + routing
- Startup form (all fields, validation)
- Basic Gemini integration: raw text response from form input
- DB schema deployed

**Success Criteria:**
- A user can sign up, select "Startup," fill the form, and receive any AI response
- Auth tokens issued and validated correctly

#### Week 2 — Core Pipeline & Report Engine
**Deliverables:**
- Full 5-step prompt pipeline implemented
- Scoring engine (all 10 dimensions)
- Structured JSON report output
- Report UI rendered from JSON (all 14 sections)
- Score visualisation (circular progress + radar chart)
- Verdict banner (Go/Revise/No-Go)

**Success Criteria:**
- End-to-end startup flow produces a structured, sectioned report
- Score renders correctly for 10 test submissions
- Report generation P95 < 90 seconds (target 60s by Week 4)

#### Week 3 — Multi-Role + Export
**Deliverables:**
- Investor path: form + AI report generation
- Student path: form + AI report generation
- Follow-up Q&A chat with streaming response
- PDF export via Puppeteer
- Shareable report link
- Government scheme section live

**Success Criteria:**
- All three role paths produce complete reports
- PDF exported correctly on ≥ 95% of attempts
- Shared link is accessible without login

#### Week 4 — Polish, QA & Launch
**Deliverables:**
- Report history page (last 5 reports)
- Rate limiting and input sanitisation
- Error handling (Gemini timeout, NewsAPI failure — graceful fallbacks)
- Performance optimisation (target P95 < 60s)
- WCAG 2.1 AA audit and fixes
- User survey widget (post-report)
- Staging → Production deployment
- Smoke test suite passing

**Success Criteria:**
- All acceptance criteria from §5A pass
- Zero P1 bugs in staging
- Uptime > 99.5% over 72-hour soak test

### Phase 2 — v1 Full (Weeks 5–8)

| Week | Focus |
|---|---|
| 5 | Live news digest, government scheme caching + refresh job |
| 6 | Idea comparison tool, bookmarking, saved reports dashboard |
| 7 | Shareable report with OG preview image, subscription tier UI |
| 8 | Admin analytics panel, monitoring dashboard, v1 production release |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation | Contingency |
|---|---|---|---|---|
| Gemini API response quality is inconsistent or hallucinated | High | High | Structured JSON output with schema validation; system prompt engineering with examples (few-shot); output reviewed in QA | Add GPT-4o as fallback model |
| Report generation exceeds 60s P95 | Medium | High | Parallel prompt steps (Steps 2a/2b/2c run concurrently); streaming response to client; timeout at 90s with partial results | Show partial report with "generating more..." state |
| NewsAPI free tier is insufficient | High | Medium | Cache news results for 6 hours per query; limit to 5 articles per report | Remove live news section from MVP; use Gemini web grounding only |
| User drops off during long form | Medium | Medium | Progress indicator (Step 1 of 3); autosave form state to localStorage; reduce required fields | A/B test shorter form vs full form in Week 4 |
| Supabase free tier limits hit | Low | High | Monitor row counts and bandwidth weekly | Migrate to Railway PostgreSQL (< ₹1500/month) |
| Government scheme data is inaccurate or outdated | High | Medium | Clearly label all scheme info as "AI-suggested — verify on official portal" + link to startup-india.gov.in | Add disclaimer banner; crowdsource corrections in v2 |
| PDF export fails on complex reports | Medium | Low | Server-side Puppeteer with sanitised HTML; tested on 20+ report variants | Fallback: client-side print-to-PDF with window.print() |

---

## 10. Metrics, Analytics, and Feedback

### Instrumentation Plan

All events tracked via PostHog (free tier, self-hosted option available):

```
Events to capture:
  role_selected         { role: 'startup' | 'investor' | 'student' }
  form_started          { role, fields_count }
  form_submitted        { role, time_to_complete_seconds }
  report_generated      { role, score, verdict, generation_time_ms }
  report_section_viewed { section_name, time_spent_seconds }
  chat_message_sent     { report_id, turn_number }
  pdf_exported          { report_id }
  share_link_created    { report_id }
  share_link_viewed     { report_id, viewer_is_owner }
```

### Dashboards (PostHog + Supabase Studio)
- Daily active users by role
- Funnel: role select → form submit → report complete → export
- Average score distribution (histogram)
- Verdict breakdown (Go/Revise/No-Go %)
- P95 report generation latency
- Top drop-off points in forms

### User Feedback Loops
- Post-report rating widget: "How useful was this report?" (1–5 stars + optional comment)
- Follow-up prompt after PDF export: "What would you improve?"
- Monthly 30-minute user interviews with 3–5 active users (screened via survey)
- In-app bug report button (Sentry integration)

---

## 11. QA and Testing Plan

### Test Types

**Unit Tests (Vitest / Jest)**
- Scoring engine: 10 test cases with known inputs → expected score
- Prompt pipeline: mock Gemini responses → verify JSON schema compliance
- Form validation: all required field combinations

**Integration Tests**
- API endpoints: all 6 core routes tested with Supertest
- Auth flow: sign-up → login → token refresh → logout
- Report generation: end-to-end with Gemini API (staging key, real call)

**E2E Tests (Playwright)**
- Happy paths for all 3 roles (script each role's full flow)
- PDF download verification
- Shared link access without auth
- Chat Q&A sends and receives response

**Performance Tests**
- K6 load test: 50 concurrent report generations; confirm P95 < 60s
- Lighthouse CI on key pages: target LCP < 2.5s, CLS < 0.1

**Accessibility Tests**
- axe-core automated scan on all routes
- Manual keyboard navigation audit on forms and report
- Screen reader test (NVDA + Chrome)

### Release Criteria
- All P1 (critical) bugs resolved
- Zero regression in smoke test suite
- Lighthouse Accessibility score ≥ 90
- E2E test suite passing ≥ 95%
- Report generation P95 ≤ 60 seconds confirmed by K6

---

## 12. Documentation, Onboarding, and Support

### User Documentation
- In-app tooltip system: each form field has a "?" icon with a brief explanation
- Report section tooltips: explain what each score dimension means
- Public help centre (Notion-based): "Getting started," "What does my score mean," "How to use follow-up chat"

### API Documentation (Internal)
- All endpoints documented in Postman collection (exported to `/docs/api`)
- Prompt templates versioned in `/src/prompts/` with changelog comments

### Developer Onboarding
- `README.md` with local setup in < 5 commands
- `.env.example` with all required environment variables annotated
- `docker-compose.yml` for local Postgres + Redis (if added later)
- Architecture decision records (ADRs) in `/docs/adr/`

### Support Plan
- MVP phase: GitHub Issues for bug reports; team monitors daily
- v1 phase: Add Crisp chat widget for in-app support
- Triage SLA: P1 (app down) → 2h response; P2 (broken feature) → 24h; P3 (cosmetic) → next sprint

---

## 13. Deployment and Operations

### Environments
| Environment | Purpose | Branch | URL |
|---|---|---|---|
| Local | Development | feature/* | localhost:5173 |
| Staging | QA + Review | develop | staging.ventureiq.in |
| Production | Live users | main | ventureiq.in |

### CI/CD Pipeline (GitHub Actions)
```
On PR to develop:
  → Run unit tests
  → Run integration tests
  → Run Lighthouse CI
  → Deploy to staging (Vercel preview URL)

On merge to main:
  → All tests pass (gate)
  → Build frontend (Vite)
  → Deploy frontend to Vercel production
  → Deploy backend to Render (Docker image)
  → Run smoke test suite against production
  → Notify Slack #deployments
```

### Rollback Strategy
- Vercel: instant rollback to previous deployment via dashboard (< 1 minute)
- Render: re-deploy previous Docker image tag
- Database: migrations run with `up` and `down` scripts; rollback triggers `down` migration

### Monitoring
- **Sentry:** Frontend + backend error tracking; alert on error rate spike > 5% in 5 min
- **BetterUptime:** HTTP uptime check every 60 seconds; SMS + Slack alert on downtime
- **Render metrics:** CPU, memory, response time dashboards
- **Supabase dashboard:** DB query performance, connection pool usage

### Maintenance Schedule
- Weekly: review Sentry error log; triage new issues
- Monthly: rotate API keys; review Gemini API usage + cost; dependency `npm audit`
- Quarterly: performance regression test; review and update prompt templates based on quality feedback

---

## 14. Appendix

### A. API Contract (Core Endpoints)

```
POST /api/auth/signup
Body:    { email, password, name, role }
Returns: { user: { id, email, role }, access_token, refresh_token }
Errors:  400 (validation), 409 (email exists)

POST /api/auth/login
Body:    { email, password }
Returns: { user, access_token, refresh_token }

POST /api/report/generate
Auth:    Bearer token
Body:    {
           role: 'startup' | 'investor' | 'student',
           input: { ...role-specific form fields }
         }
Returns: {
           report_id: UUID,
           role,
           score: 74,
           verdict: 'revise',
           sections: {
             idea_summary: "...",
             problem_analysis: "...",
             market_opportunity: "...",
             competition_analysis: "...",
             industry_trends: [...],
             government_schemes: [...],
             mvp_suggestions: "...",
             dimension_scores: { pain_level: 8, urgency: 7, ... },
             risks: [...],
             recommendations: [...],
             funding_fit: "...",
             action_plan: [...],
             final_verdict: "..."
           },
           share_token: "abc123",
           created_at: "2026-03-31T..."
         }
Errors:  429 (rate limit), 504 (Gemini timeout), 422 (invalid input)

GET /api/report/:id
Auth:    Bearer token (own reports) OR no auth (shared via share_token)
Returns: Full report object as above

POST /api/report/:id/chat
Auth:    Bearer token
Body:    { message: "What should I build first?" }
Returns: SSE stream → { role: 'assistant', content: "..." } (streamed)
Limits:  Max 10 turns per report; 429 if exceeded

GET /api/report/:id/export
Auth:    Bearer token
Returns: { pdf_url: "https://r2.ventureiq.in/reports/{id}.pdf" }
Notes:   PDF generated async if not cached; poll with retry if 202 returned

GET /api/reports/history
Auth:    Bearer token
Returns: [{ report_id, role, score, verdict, created_at, idea_name }] (last 5)
```

### B. Gemini Prompt Template (Startup Path — Scoring Step)

```
System:
You are a YC-style startup evaluator. You are blunt, structured, and precise.
You do not give empty encouragement. You identify real problems and real opportunities.
Respond ONLY with valid JSON matching the provided schema. No preamble or markdown.

User:
Evaluate this startup idea on the following 10 dimensions, each scored 0-10.
Return a JSON object with scores and one-sentence rationale per dimension.

Startup:
- Idea: {idea_name}
- Problem: {problem_statement}
- Target Users: {target_users}
- Industry: {industry}
- Business Model: {business_model}
- Region: {country_region}
- Stage: {stage}
- Budget: {budget}
- MVP Status: {mvp_status}
- Known Competitors: {competitors}

Market Context (from research step):
{news_context}
{scheme_context}

Dimensions to score:
1. pain_level: How intense and real is the user pain?
2. urgency: How urgently do users need this solved today?
3. market_size: How large is the addressable market?
4. adoption_speed: How quickly would users adopt this?
5. competition_intensity: How crowded is the space? (10 = no competition)
6. willingness_to_pay: Would users pay for this?
7. differentiation: How differentiated from existing solutions?
8. execution_difficulty: How achievable is this? (10 = very achievable)
9. mvp_feasibility: Can a lean MVP be built and tested quickly?
10. market_timing: Is the timing right for this idea now?

Schema:
{
  "scores": {
    "pain_level": { "score": 0-10, "rationale": "..." },
    ...
  },
  "composite_score": 0-100,
  "verdict": "go" | "revise" | "no-go"
}
```

### C. Glossary

| Term | Definition |
|---|---|
| Validation Score | Composite 0–100 score representing idea viability across 10 YC-style dimensions |
| Verdict | AI-assigned Go / Revise / No-Go classification based on score thresholds (70+ = Go, 40–69 = Revise, < 40 = No-Go) |
| Follow-up Q&A | Contextual chat session scoped to a specific generated report; max 10 turns |
| Report Context | The full report JSON passed as context to the Gemini API for follow-up chats |
| Scheme | Government financial or institutional support programme relevant to the startup's sector and region |
| Web Grounding | Gemini's ability to search the live web to augment responses with current information |
| Share Token | A unique short token appended to the report URL enabling public read-only access |
| Verdict Banner | The prominent UI element at the top of every report displaying Go/Revise/No-Go with colour coding |
| Prompt Pipeline | The sequential (with parallel substeps) chain of AI calls that transforms raw form input into a structured report |
| P95 Latency | The 95th-percentile latency — the response time within which 95% of requests complete |

---

*Document last updated: March 31, 2026. Next review: April 28, 2026 (post-MVP launch retrospective).*  
*For questions, contact the Product Owner or open an issue in the project repo.*
