# VentureIQ — App Flow Documentation
**Version:** 1.0 | **Date:** March 31, 2026

---

## Overview

VentureIQ has three distinct user paths branching from a single role-selection entry point. Every path follows the same macro-structure: **Onboard → Input → Process → Report → Action**. The branching happens at Input and Report — each role gets a different form and a different report format.

This document covers:
- Global app states and navigation
- Screen-by-screen breakdown for all three roles
- State transitions and data flows
- Error states and edge cases
- Follow-up Q&A flow
- Export and sharing flows

---

## 1. Global App States

```
┌─────────────────────────────────────────────────────────────────┐
│                        GLOBAL APP STATES                        │
├──────────────────┬──────────────────────────────────────────────┤
│  UNAUTHENTICATED │  Landing → Role Select → Form → Report View  │
│                  │  (shared links accessible without auth)       │
├──────────────────┼──────────────────────────────────────────────┤
│  AUTHENTICATED   │  All above + History + Q&A Chat + Export     │
│                  │  + Account settings + Bookmark               │
├──────────────────┼──────────────────────────────────────────────┤
│  LOADING         │  Report generating: progress overlay active  │
├──────────────────┼──────────────────────────────────────────────┤
│  ERROR           │  Gemini timeout / API failure: error screen  │
│                  │  with retry CTA and partial data if any       │
└──────────────────┴──────────────────────────────────────────────┘
```

### Route Map

```
/                           Landing Page
/onboard                    Role Selection
/signup                     Sign Up
/login                      Login
/startup                    Startup Idea Form
/investor                   Investor Profile Form
/student                    Student Discovery Form
/generating                 Report Generation Loading Screen
/report/:reportId           Report View (full)
/report/:reportId/chat      Follow-Up Q&A (auth required)
/share/:shareToken          Public Shared Report (read-only, no auth)
/history                    Report History (auth required)
/account                    Account Settings (auth required)
```

---

## 2. Screen-by-Screen: Global Flows

### Screen 0 — Landing Page (`/`)

**Purpose:** Convert visitor → role selection

**Sections (top to bottom):**
1. **Hero block**
   - Headline: *"Validate your startup idea like a YC partner would."*
   - Sub-headline: *"AI-powered analysis. Investor-grade reports. In under 60 seconds."*
   - Primary CTA: `[Start Free — No Credit Card]` → `/onboard`
   - Secondary CTA: `[See a sample report]` → opens modal with anonymised report

2. **Role cards row (3 cards)**
   - Startup / Company → "Validate your idea, score your MVP, find funding paths"
   - Investor → "Discover promising sectors and emerging opportunities"
   - Student / Explorer → "Find startup ideas that match your skills and budget"
   - Each card has a `[Get Started]` button → `/onboard` (with role pre-selected)

3. **Social proof bar**
   - "2,400+ reports generated" | "3 user types" | "India-focused scheme database"

4. **How It Works (3 steps)**
   - Step 1: Pick your role and fill in your details
   - Step 2: AI analyses market, competition, trends and schemes
   - Step 3: Get a scored report with a 30-day action plan

5. **Sample report preview**
   - Blurred screenshot of a report with verdict badge visible
   - CTA: `[See full sample]`

6. **Footer**
   - Links: About, Privacy Policy, Terms, GitHub (if open-source)

**State transitions:**
- `[Start Free]` → if unauthenticated: `/onboard` (guest flow allowed)
- `[Get Started]` on role card → `/onboard?role=startup|investor|student`

---

### Screen 1 — Role Selection (`/onboard`)

**Purpose:** Route user to the correct input form

**Layout:**
```
"Who are you?"

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  🚀         │  │  💼         │  │  🎓         │
│  Startup /  │  │  Investor   │  │  Student /  │
│  Company    │  │             │  │  Explorer   │
│             │  │             │  │             │
│  [Select]   │  │  [Select]   │  │  [Select]   │
└─────────────┘  └─────────────┘  └─────────────┘

Already have a report? [View History] (only if logged in)
```

**Behaviour:**
- If `?role=` param present, pre-highlight that card
- Clicking a card triggers a brief selection animation then navigates to the corresponding form
- No auth required at this point — guest can proceed

**State transitions:**
- Startup card → `/startup`
- Investor card → `/investor`
- Student card → `/student`

---

## 3. Path A — Startup / Company Flow

### Screen A1 — Startup Idea Form (`/startup`)

**Purpose:** Collect all data needed for idea validation

**Form structure (multi-step, 3 pages):**

#### Page 1 of 3 — The Idea

| Field | Type | Validation |
|---|---|---|
| Idea Name | Text input | Required, max 80 chars |
| Problem Statement | Textarea | Required, 50–500 chars, char counter shown |
| Target Users | Text input | Required, max 200 chars |
| Industry | Dropdown (20 options) | Required |
| Business Model | Dropdown | Required |

**Industry options:**
Agriculture, CleanTech, Construction & Real Estate, D2C / E-commerce, Deep Tech, EdTech, FinTech, FoodTech, Government / GovTech, HealthTech, HR & Future of Work, Legal Tech, Logistics & Supply Chain, Manufacturing, Media & Entertainment, Mobility & EV, Retail & Consumer, SaaS / B2B Software, Social Impact, Travel & Hospitality

**Business Model options:**
SaaS, Marketplace, D2C / E-commerce, Service Business, Hardware / IoT, Subscription, Freemium, Transactional, Other

#### Page 2 of 3 — Your Context

| Field | Type | Validation |
|---|---|---|
| Country / Region | Text with autocomplete | Required |
| Startup Stage | Dropdown | Required |
| Monthly Budget | Dropdown | Required |
| Current MVP Status | Dropdown | Required |
| Known Competitors | Textarea | Optional, max 300 chars |

**Stage options:** Idea Only, Wireframe / Concept, Prototype Built, MVP Live, Early Revenue, Growth Stage

**Budget options:** Below ₹1 Lakh, ₹1–5 Lakhs, ₹5–25 Lakhs, ₹25 Lakhs – ₹1 Crore, Above ₹1 Crore, Not Disclosed

**MVP Status options:** No MVP yet, Wireframe done, Prototype built, MVP live (beta), Launched and getting users

#### Page 3 of 3 — Review & Submit

- Summary of all entered data in a read-only card format
- `[Edit]` link on each section to go back
- `[Analyse My Idea]` primary CTA
- Disclaimer: *"Analysis is AI-generated. Government scheme info should be verified on official portals."*

**Progress indicator:** `Page 1 of 3 ──●──○──○`

**State transitions:**
- Page 1 `[Next]` → Page 2 (if Page 1 valid)
- Page 2 `[Next]` → Page 3 (if Page 2 valid)
- Page 3 `[Analyse My Idea]` → POST `/api/report/generate` → `/generating`

---

### Screen A2 — Report Generation (`/generating`)

**Purpose:** Communicate that analysis is running (up to 60s)

**Layout:**
```
      [VentureIQ logo]

      Analysing your idea...

  ●  Classifying your industry and business model
  ●  Researching market trends and news               ← animated dots
  ◌  Scanning for government schemes
  ◌  Evaluating competition landscape
  ◌  Calculating your validation score
  ◌  Generating your full report

      This usually takes 30–60 seconds.
```

**Behaviour:**
- Steps animate in sequence as backend pipeline progresses (via SSE events from backend)
- If > 90 seconds: show error state with `[Try Again]` and `[Contact Support]`
- If user navigates away: report continues generating server-side; on return shows "Your report is ready"

**SSE event structure from backend:**
```json
{ "event": "pipeline_step", "step": 1, "label": "Classifying idea..." }
{ "event": "pipeline_step", "step": 2, "label": "Fetching market news..." }
{ "event": "pipeline_complete", "reportId": "uuid-here" }
{ "event": "pipeline_error", "message": "Gemini API timeout. Retrying..." }
```

**State transitions:**
- `pipeline_complete` event → redirect to `/report/:reportId`
- Error → show retry UI inline

---

### Screen A3 — Report View (`/report/:reportId`)

**Purpose:** Display the full structured validation report

**Layout (Desktop — 3-column):**

```
┌──────────────────────────────────────────────────────────────────┐
│  VERDICT BANNER (full width, sticky)                             │
│  ● REVISE   Score: 67/100   "The problem is real but your       │
│             target audience is too broad. Narrow down."          │
├───────────────┬──────────────────────────────┬───────────────────┤
│  LEFT SIDEBAR │  MAIN CONTENT AREA           │  RIGHT SIDEBAR    │
│               │                              │                   │
│  Table of     │  [Section cards rendered     │  Score Ring       │
│  Contents     │   sequentially]              │  (74/100, colour) │
│  (sticky)     │                              │                   │
│  1. Summary   │  1. Idea Summary             │  Radar Chart      │
│  2. Problem   │  2. Problem Analysis         │  (10 dimensions)  │
│  3. Market    │  3. Target Audience          │                   │
│  4. ...       │  4. Market Opportunity       │  Quick Actions    │
│  14. Verdict  │  5. Competition              │  [Export PDF]     │
│               │  6. Industry Trends          │  [Share Report]   │
│  ─────────    │  7. Gov Schemes              │  [Ask Follow-up]  │
│  [Export PDF] │  8. MVP Suggestions          │  [Bookmark]       │
│  [Share]      │  9. Validation Score         │                   │
│  [Bookmark]   │  10. Risks                   │  Report Date      │
│               │  11. Recommendations         │  Idea Name        │
│               │  12. Funding Fit             │  Industry         │
│               │  13. 30-Day Plan             │                   │
│               │  14. Final Verdict           │                   │
└───────────────┴──────────────────────────────┴───────────────────┘
```

**Layout (Mobile — Single column):**
- Verdict banner pinned to top
- Sidebar collapses into a horizontal scrollable pill nav
- Right sidebar content moves below verdict banner
- Sections accordion-collapsed by default, expand on tap

**Section Card Anatomy:**

```
┌─────────────────────────────────────────────────┐
│  [Section Icon]  SECTION TITLE             [↕]  │
│  ─────────────────────────────────────────────  │
│  [Content — paragraphs, bullet lists, tables]   │
│                                                 │
│  [Subsections if applicable]                    │
└─────────────────────────────────────────────────┘
```

**Section-specific UI notes:**

- **Section 5 (Competition):** Each competitor rendered as a card with name, positioning, and a 1-line differentiator gap
- **Section 6 (Trends & News):** News items as a feed with source label, headline, and 1-line summary
- **Section 7 (Gov Schemes):** Each scheme as a card: scheme name, eligibility summary, benefit, and `[Verify on official portal →]` link
- **Section 9 (Score):** Interactive score card with circular ring + radar chart + per-dimension score rows with rationale tooltips
- **Section 13 (30-Day Plan):** Calendar-style timeline: Week 1 / Week 2 / Week 3 / Week 4 with task chips

**Verdict Banner States:**

```
GO (score 70–100):
  Background: Deep green   Text: White
  "✓ GO — Score: 82/100"  "Strong validation signal. Move fast."

REVISE (score 40–69):
  Background: Amber        Text: Dark
  "⚠ REVISE — Score: 61/100"  "Solid core, but key issues to fix first."

NO-GO (score 0–39):
  Background: Deep red     Text: White
  "✕ NO-GO — Score: 28/100"  "Fundamental issues with market or model."
```

**Unauthenticated user experience:**
- Full report visible (to reduce friction)
- A non-blocking banner at top: "Sign up to save this report and ask follow-up questions"
- Q&A Chat section shows a lock icon: "Create a free account to ask follow-up questions"

**State transitions:**
- `[Export PDF]` → GET `/api/report/:id/export` → triggers download
- `[Share Report]` → POST to generate share token → modal shows copyable link
- `[Ask Follow-up]` → if auth: scrolls to chat panel OR opens `/report/:id/chat` | if guest: auth prompt
- `[Bookmark]` → if auth: saves to history with flag | if guest: auth prompt
- TOC link click → smooth-scroll to section

---

### Screen A4 — Follow-Up Q&A (`/report/:reportId/chat`)

**Purpose:** Let the user drill deeper into any aspect of their report

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Report                                       │
│  ─────────────────────────────────────────────────      │
│  Ask anything about your VentureIQ Report               │
│  Idea: HyperLocal Delivery | Score: 67 | REVISE         │
│  ─────────────────────────────────────────────────      │
│                                                         │
│  [Chat history — messages listed oldest to newest]      │
│                                                         │
│  Assistant: "Your report is ready. What would you       │
│  like to explore first?"                                │
│                                                         │
│  User: "What should I build in my MVP first?"           │
│                                                         │
│  Assistant: [streaming response rendered token by       │
│  token with blinking cursor while streaming]            │
│                                                         │
│  ─────────────────────────────────────────────────      │
│  [Text input]                   [Send ↑]  (5/10 turns) │
└─────────────────────────────────────────────────────────┘
```

**Behaviour:**
- Turn counter shown: `(5/10 turns used)`
- At turn 10: input disabled, message shown: "You've reached the Q&A limit for this report. Start a new analysis to continue."
- Responses stream token-by-token via SSE
- Report JSON is passed as context in every message to Gemini
- Previous turns included in conversation history for continuity
- Markdown rendered in assistant responses (bold, bullets, code blocks)

---

## 4. Path B — Investor Flow

### Screen B1 — Investor Profile Form (`/investor`)

**Form structure (2 pages):**

#### Page 1 of 2 — Investment Profile

| Field | Type | Validation |
|---|---|---|
| Preferred Sector(s) | Multi-select (up to 3) | Required, min 1 |
| Investment Stage | Dropdown | Required |
| Risk Appetite | 3-option toggle | Required |
| Budget Range | Dropdown | Required |
| Geography | Text with autocomplete | Required |
| Interest Keywords | Tags input | Optional, max 5 tags |

**Stage options:** Pre-seed / Angel, Seed, Series A, Growth / Series B+, Any Stage

**Risk options (toggle pill):** Conservative · Moderate · Aggressive

#### Page 2 of 2 — Review & Submit

- Summary card with all selections
- `[Discover Opportunities]` CTA

### Screen B2 — Investor Report View

**Report sections displayed:**

```
┌──────────────────────────────────────────────────────────────┐
│  INTELLIGENCE BANNER                                         │
│  "Market Intelligence Report — B2B SaaS · India · Seed      │
│  Stage · Generated March 31, 2026"                           │
├───────────────┬──────────────────────────────────────────────┤
│  Navigation   │  1. Sector Overview & Momentum               │
│               │  2. Top 5 Trending Startup Categories        │
│               │  3. Red Flags & Market Risks                 │
│               │  4. Government Policy Impact                 │
│               │  5. Investment Opportunity Map               │
│               │  6. Sectors to Watch This Quarter            │
│               │  7. Recommended Due Diligence Angles         │
│               │                                              │
│  [Export]     │  [Each section rendered as card]             │
│  [Share]      │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

**Section 2 (Trending Categories) special UI:**
- 5 cards in a horizontal scroll row
- Each card: Category name, growth signal (🔺 High / 🔶 Medium), 2-line description, example startup types

**Section 5 (Opportunity Map) special UI:**
- 2×2 matrix chart: X-axis = Market Maturity, Y-axis = Growth Rate
- Sectors plotted as bubbles (bubble size = market size)

---

## 5. Path C — Student Flow

### Screen C1 — Student Discovery Form (`/student`)

**Form structure (2 pages):**

#### Page 1 of 2 — About You

| Field | Type | Validation |
|---|---|---|
| Interests | Multi-select (from list + freetext) | Required, min 1 |
| Current Skills | Multi-select (from list + freetext) | Required, min 1 |
| Preferred Domain | Dropdown | Required |
| Available Budget | Dropdown | Required |
| Intent | 3-option toggle | Required |

**Interest options:** AI / ML, Agriculture, Art & Design, Biotech, Climate & Sustainability, Content & Media, Data Science, EdTech, Finance, Gaming, Hardware, HealthTech, Legal, Logistics, SaaS / B2B, Social Impact, Other

**Skill options:** Python, JavaScript / React, Java, No-Code Tools, Data Analysis, Design (Figma), Marketing, Finance / Accounting, Domain Expertise, Communication, Research, Other

**Domain options:** Same 20 as Startup form

**Budget options:** Zero budget, Below ₹10,000, ₹10,000 – ₹50,000, ₹50,000+

**Intent toggle:** Build a Startup · Join a Startup · Explore & Learn

#### Page 2 of 2 — Review & Submit

- Summary card
- `[Discover My Path]` CTA

### Screen C2 — Student Report View

**Report sections:**

```
1. Your Startup Idea Matches (top 3, ranked by feasibility)
2. Skills to Develop (prioritised list with resources)
3. 90-Day MVP Roadmap (if Build intent selected)
4. Free & Low-Cost Resources
5. Incubators & Student Programs
6. How to Validate Without Money
```

**Section 1 (Idea Matches) special UI:**
- 3 cards ranked #1, #2, #3
- Each card: Idea name, one-line description, Feasibility badge (Beginner / Intermediate / Advanced), Budget required, Key challenge

**Section 3 (90-Day Roadmap) special UI — if "Build" intent:**
- 3-column timeline: Month 1 / Month 2 / Month 3
- Each month has a header goal + 4–5 task chips
- Task chips are colour-coded: Research (blue), Build (green), Talk to Users (orange), Launch (purple)

---

## 6. Supporting Flows

### Flow: Sign Up (`/signup`)

```
[Email input]
[Password input]      → validation: min 8 chars, 1 number
[Confirm password]
[Name input]
[Sign Up with Email]  → POST /api/auth/signup → set JWT cookie → redirect to /onboard

─── OR ───

[Continue with Google] → Google OAuth flow → set JWT → redirect to /onboard
```

**Post-signup:** If user had just completed a report as a guest, prompt: "Save your last report to your account?" with `[Yes, save it]` or `[Skip]`

### Flow: Share Report

Triggered by `[Share Report]` button in report view:

```
1. Button clicked
2. Modal opens:
   ┌─────────────────────────────────────┐
   │  Share this Report                  │
   │                                     │
   │  Anyone with the link can view      │
   │  this report (read-only).           │
   │                                     │
   │  [https://ventureiq.in/share/abc123]│
   │  [Copy Link]   [Open in new tab]    │
   │                                     │
   │  ─────────────────────────────────  │
   │  Share on:  [Twitter/X]  [LinkedIn] │
   └─────────────────────────────────────┘
3. [Copy Link] → copies to clipboard → button changes to "Copied!"
```

### Flow: PDF Export

```
1. [Export PDF] clicked
2. Inline loading state: "Generating your PDF..."
3. GET /api/report/:id/export
   - If PDF already cached: immediate download
   - If not: server generates (5–10 seconds) → download
4. File: "VentureIQ-Report-[IdeaName]-[Date].pdf"
5. Success toast: "PDF downloaded successfully"
6. Failure toast: "Export failed. Try again." with retry button
```

### Flow: Report History (`/history`)

```
[Report History page]

Filter: All | Startup | Investor | Student

┌──────────────────────────────────────────────────────┐
│  HyperLocal Delivery   Startup  •  Score: 67  REVISE │
│  March 31, 2026                    [View]  [Delete]  │
├──────────────────────────────────────────────────────┤
│  B2B SaaS Intel        Investor •  —          —      │
│  March 28, 2026                    [View]  [Delete]  │
├──────────────────────────────────────────────────────┤
│  EdTech Startup Path   Student  •  —          —      │
│  March 25, 2026                    [View]  [Delete]  │
└──────────────────────────────────────────────────────┘

Showing 3 of 3 saved reports. (Max 5 on free plan)
```

---

## 7. Error States

### E1 — Gemini API Timeout (> 90 seconds)

```
┌────────────────────────────────────────────────────┐
│  ⚠  Analysis taking longer than expected           │
│                                                    │
│  Our AI engine is under high load. Your idea has  │
│  been queued — we'll email you when it's ready.   │
│                                                    │
│  [Try Again Now]      [Go to Home]                 │
└────────────────────────────────────────────────────┘
```

### E2 — Partial Report (some sections failed)

- Affected section shows: *"This section could not be generated. [Retry section]"*
- Other sections render normally
- Verdict banner shows: *"Partial report — some sections unavailable"*

### E3 — Form Validation Errors

- Inline error below each invalid field (red border + message)
- On submit with errors: scroll to first error, announce via `aria-live`

### E4 — Rate Limit Hit (5 reports/hour)

```
"You've reached the limit of 5 reports per hour.
 Come back in 47 minutes or upgrade to Pro for unlimited reports."
[Set a reminder]   [Learn about Pro]
```

### E5 — Unauthenticated Access to Protected Route

- Redirect to `/login?redirect=/report/:id/chat`
- After login, redirect back to intended URL

---

## 8. Data Flow Summary

```
USER INPUT
    │
    ▼
FORM VALIDATION (client-side, real-time)
    │
    ▼
POST /api/report/generate
    │
    ▼
SERVER RECEIVES INPUT
    │
    ├──► STEP 1: Classify (Gemini API, ~2s)
    │
    ├──► STEP 2a: News context (NewsAPI, ~3s)  ─── parallel
    ├──► STEP 2b: Web grounding (Gemini, ~5s)  ─── parallel
    ├──► STEP 2c: Scheme lookup (Gemini, ~4s)  ─── parallel
    │
    ▼ (all Step 2 results merged)
    │
    ├──► STEP 3: Score 10 dimensions (Gemini, ~8s)
    │
    ├──► STEP 4: Generate all 14 report sections (Gemini, ~15s)
    │
    ▼
ASSEMBLE REPORT JSON
    │
    ├──► SAVE to reports table (Supabase)
    ├──► EMIT pipeline_complete event via SSE
    │
    ▼
CLIENT RECEIVES reportId → REDIRECT to /report/:reportId
    │
    ▼
GET /api/report/:reportId → return cached report JSON
    │
    ▼
RENDER REPORT UI
```

---

*End of App Flow Documentation*
