# VentureIQ — Frontend Guidelines
**Version:** 1.0 | **Date:** March 31, 2026

---

## Overview

These guidelines define the visual language, component system, coding conventions, and accessibility standards for the VentureIQ frontend. Every engineer and designer working on the product should treat this as the authoritative reference.

The design philosophy: **editorial confidence, not generic SaaS**. VentureIQ should feel like a high-stakes intelligence tool — precise, direct, and premium. Not a chatbot, not a dashboard, not a landing page template.

---

## 1. Design System

### 1.1 Typography

Two font families. Both imported from Google Fonts.

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');
```

| Role | Family | Weight | Usage |
|---|---|---|---|
| Display | Syne | 700–800 | Hero headlines, section titles, verdict banner |
| Body | DM Sans | 400–500 | Paragraph text, labels, descriptions |
| Body Strong | DM Sans | 600 | Emphasis, card titles, sub-headings |
| Mono | JetBrains Mono | 400 | Code blocks, API snippets, score numbers |

**Type scale (rem-based):**

```css
:root {
  --text-xs:   0.75rem;   /* 12px — captions, timestamps */
  --text-sm:   0.875rem;  /* 14px — helper text, tags */
  --text-base: 1rem;      /* 16px — body default */
  --text-lg:   1.125rem;  /* 18px — lead text, card titles */
  --text-xl:   1.25rem;   /* 20px — section headers */
  --text-2xl:  1.5rem;    /* 24px — page sub-headings */
  --text-3xl:  1.875rem;  /* 30px — page headings */
  --text-4xl:  2.25rem;   /* 36px — hero sub-headline */
  --text-5xl:  3rem;      /* 48px — hero headline */
  --text-7xl:  4.5rem;    /* 72px — verdict score number */
}
```

**Typography rules:**
- Headlines (Syne) are NEVER italic
- Body copy max line length: 68ch on desktop, unset on mobile
- Line height: 1.6 for body, 1.2 for display
- Never use font-weight below 400 for body

### 1.2 Colour System

```css
:root {
  /* ── Brand ── */
  --brand-50:   #f0f9ff;
  --brand-100:  #e0f2fe;
  --brand-200:  #bae6fd;
  --brand-400:  #38bdf8;
  --brand-500:  #0ea5e9;
  --brand-600:  #0284c7;
  --brand-700:  #0369a1;
  --brand-900:  #0c4a6e;

  /* ── Neutrals (cool-tinted, not pure grey) ── */
  --neutral-0:   #ffffff;
  --neutral-50:  #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;
  --neutral-950: #020617;

  /* ── Verdict colours ── */
  --verdict-go-bg:     #14532d;
  --verdict-go-text:   #bbf7d0;
  --verdict-go-border: #16a34a;

  --verdict-revise-bg:     #78350f;
  --verdict-revise-text:   #fde68a;
  --verdict-revise-border: #d97706;

  --verdict-nogo-bg:     #7f1d1d;
  --verdict-nogo-text:   #fecaca;
  --verdict-nogo-border: #dc2626;

  /* ── Semantic ── */
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error:   #dc2626;
  --color-info:    #0ea5e9;

  /* ── Surface (light mode) ── */
  --surface-bg:        var(--neutral-50);
  --surface-card:      var(--neutral-0);
  --surface-elevated:  var(--neutral-0);
  --surface-border:    var(--neutral-200);
  --surface-border-strong: var(--neutral-300);

  /* ── Text (light mode) ── */
  --text-primary:   var(--neutral-900);
  --text-secondary: var(--neutral-500);
  --text-muted:     var(--neutral-400);
  --text-inverse:   var(--neutral-0);
  --text-link:      var(--brand-600);
}

/* Dark mode */
[data-theme="dark"] {
  --surface-bg:        var(--neutral-950);
  --surface-card:      var(--neutral-900);
  --surface-elevated:  var(--neutral-800);
  --surface-border:    var(--neutral-800);
  --surface-border-strong: var(--neutral-700);

  --text-primary:   var(--neutral-50);
  --text-secondary: var(--neutral-400);
  --text-muted:     var(--neutral-600);
  --text-link:      var(--brand-400);
}
```

**Colour usage rules:**
- Never use hex values directly in component files — always use CSS variables or Tailwind semantic tokens
- Verdict colours are sacred — never use `--verdict-go-bg` for non-verdict elements
- Brand-500 (`#0ea5e9`) is the only allowed CTA colour

### 1.3 Spacing System

VentureIQ uses an 8px base grid. All spacing values are multiples of 4px (0.25rem), with common values at 8px increments.

```
4px   (0.25rem) — tight insets, icon gaps
8px   (0.5rem)  — compact element spacing
12px  (0.75rem) — form field internal padding
16px  (1rem)    — card padding (mobile), standard gap
20px  (1.25rem) — card padding (desktop small)
24px  (1.5rem)  — section gap, card padding (desktop)
32px  (2rem)    — between major sections
48px  (3rem)    — page section padding
64px  (4rem)    — large section dividers
96px  (6rem)    — hero section vertical padding
```

### 1.4 Elevation and Shadows

```css
:root {
  --shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05);
  --shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04);

  /* Verdict banner shadow */
  --shadow-verdict-go:     0 0 0 1px var(--verdict-go-border), 0 4px 16px -2px rgba(22,163,74,0.3);
  --shadow-verdict-revise: 0 0 0 1px var(--verdict-revise-border), 0 4px 16px -2px rgba(217,119,6,0.3);
  --shadow-verdict-nogo:   0 0 0 1px var(--verdict-nogo-border), 0 4px 16px -2px rgba(220,38,38,0.3);
}
```

**Elevation rules:**
- Cards use `shadow-md` by default, `shadow-lg` on hover
- Modals use `shadow-xl`
- Dropdowns use `shadow-lg`
- The verdict banner uses its coloured shadow variant

### 1.5 Border Radius

```css
:root {
  --radius-sm:   4px;    /* badges, tags, inline chips */
  --radius-md:   8px;    /* form inputs, small cards */
  --radius-lg:   12px;   /* primary cards */
  --radius-xl:   16px;   /* report section cards */
  --radius-2xl:  24px;   /* modals, hero cards */
  --radius-full: 9999px; /* pills, avatar, circular score ring */
}
```

### 1.6 Animation and Motion

```css
:root {
  --duration-fast:   150ms;
  --duration-normal: 250ms;
  --duration-slow:   400ms;
  --duration-slower: 600ms;

  --ease-out:        cubic-bezier(0.0, 0, 0.2, 1);
  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1); /* slight overshoot */
}
```

**Motion rules:**
- All interactive state changes (hover, focus, active): `duration-fast ease-out`
- Page transitions and panel slides: `duration-normal ease-out`
- Report section reveals (staggered on load): `duration-slow ease-out` with 60ms stagger delay between sections
- Verdict banner entrance: `duration-slower ease-spring` — this is the centrepiece, animate it deliberately
- **Reduce motion:** All animations wrapped in `@media (prefers-reduced-motion: reduce)` → instant transition

**Framer Motion patterns used:**

```tsx
// Section card entrance (staggered)
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
}
const cardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

// Verdict banner
const verdictVariants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } }
}
```

---

## 2. Component Library

### 2.1 Button

**Variants:**

```tsx
// Primary — for main CTAs
<Button variant="primary">Analyse My Idea</Button>
// → Sky blue bg, white text, hover: darken 10%

// Secondary — for secondary actions
<Button variant="secondary">Share Report</Button>
// → White bg, border, brand text

// Ghost — for tertiary/nav actions
<Button variant="ghost">← Back to Report</Button>
// → Transparent, text colour, hover: subtle bg

// Danger — for destructive actions
<Button variant="danger">Delete Report</Button>
// → Red bg or red text depending on context

// Sizes: sm | md (default) | lg
<Button size="lg">Start Free</Button>
```

**States:**
- Default, Hover (scale 1.01), Active (scale 0.99), Focus (visible ring), Disabled (opacity-50, cursor-not-allowed), Loading (spinner replaces text)

**Loading state:**
```tsx
<Button loading={isSubmitting}>
  {isSubmitting ? 'Analysing...' : 'Analyse My Idea'}
</Button>
```

### 2.2 Form Inputs

**Text Input:**
```tsx
<FormField
  label="Idea Name"
  hint="Give your startup idea a short, clear name"
  error={errors.ideaName?.message}
  required
>
  <Input
    placeholder="e.g. QuickDeliver"
    maxLength={80}
    {...register('ideaName')}
  />
</FormField>
```

- Label always above input (never placeholder-as-label)
- Hint text below label in secondary colour
- Error text below input in error colour, with error icon
- Character counter appears when field has maxLength and content > 50% of limit
- Focus ring: 2px brand-500 with 2px offset

**Textarea:**
- Minimum height: 100px
- Auto-resize up to max 280px (scrollable beyond)
- Same label/hint/error pattern as input

**Select / Dropdown:**
- Native select replaced with Radix UI `Select` for accessibility
- Opens as a floating panel (not a native dropdown)
- Keyboard navigable: arrow keys, letter-jump

**Multi-select (interests, sectors):**
- Tag-style: clicking an option adds a chip below the field
- Chips are dismissible with × button
- Keyboard: Tab to focus, Enter to add, Backspace to remove last

### 2.3 Report Section Card

The primary content container for report sections.

```tsx
<ReportSectionCard
  sectionNumber={1}
  title="Idea Summary"
  icon={<Lightbulb />}
  defaultExpanded={true}
>
  <p>{report.sections.idea_summary}</p>
</ReportSectionCard>
```

**Anatomy:**
```
┌────────────────────────────────────────────────────┐
│  [Icon] 01. IDEA SUMMARY                    [↕ ▼]  │  ← Header (sticky on scroll within section)
│  ─────────────────────────────────────────────     │
│  [Content]                                         │
│                                                    │
│  [Optional: chips, lists, nested cards]            │
└────────────────────────────────────────────────────┘
```

**Collapse behaviour:**
- Desktop: all sections expanded by default
- Mobile: sections 1–4 expanded, rest collapsed
- User preference persisted to localStorage

### 2.4 Verdict Banner

The most important single component in the product.

```tsx
<VerdictBanner
  verdict="revise"
  score={67}
  rationale="The problem is real but your target audience is too broad. Narrow down first."
/>
```

**Rules:**
- Always full-width, always at the top of the report
- Sticky on desktop (follows user as they scroll)
- Colour is determined by verdict: go=green, revise=amber, nogo=red
- Score displayed in `font-display` monospace-style with large `text-7xl` sizing
- Rationale is the AI's one-sentence explanation — always present

### 2.5 Score Ring

```tsx
<ScoreRing score={67} size={160} />
```

Built with `recharts` `RadialBarChart`:
- Background track in `neutral-200`
- Foreground arc: gradient from `verdict-nogo-border` (0) → `verdict-revise-border` (50) → `verdict-go-border` (80–100)
- Score number centred in ring using absolute positioning
- Animated on mount: arc draws from 0 to score over 800ms

### 2.6 Radar Chart (Score Dimensions)

```tsx
<DimensionRadar scores={report.sections.dimension_scores} />
```

10-axis radar chart using `recharts` `RadarChart`:
- Axes: Pain Level, Urgency, Market Size, Adoption, Competition (inverted), WTP, Differentiation, Execution, MVP Feasibility, Timing
- Colour fill: brand-500 at 30% opacity
- Stroke: brand-500
- Custom dot on each axis: hover shows dimension name + score + rationale (tooltip)
- Dot size proportional to score

### 2.7 Chat Message Bubble

```tsx
<MessageBubble role="assistant" isStreaming={true}>
  {message.content}
</MessageBubble>
```

- User messages: right-aligned, brand-100 bg
- Assistant messages: left-aligned, white card with subtle border
- Streaming: blinking cursor appended to end while `isStreaming=true`
- Markdown rendered inside assistant messages (using `react-markdown` with `remark-gfm`)

### 2.8 Pipeline Step Indicator

```tsx
<PipelineSteps currentStep={3} steps={PIPELINE_STEPS} />
```

- 6 steps shown as a vertical list
- Steps 1 to `currentStep-1`: filled green circle with checkmark
- Step `currentStep`: animated pulsing blue circle
- Steps after: empty grey circle
- Step labels animate in as the step activates

---

## 3. Page Layouts

### 3.1 App Shell

```tsx
// src/components/layout/AppShell.tsx
<div className="min-h-screen bg-[var(--surface-bg)]">
  <Header />                    {/* sticky, h-16, z-50 */}
  <main className="pt-16">     {/* offset for sticky header */}
    <Outlet />                  {/* React Router v6 */}
  </main>
</div>
```

### 3.2 Report Layout

```tsx
// Three-column on desktop, single-column on mobile
<div className="grid grid-cols-[240px_1fr_280px] gap-6 max-w-[1400px] mx-auto px-6">
  <aside className="sticky top-20 h-fit">     {/* TOC sidebar */}
    <ReportTOC sections={sections} />
  </aside>
  <article>                                   {/* Main report */}
    <VerdictBanner ... />
    {sections.map(s => <ReportSectionCard key={s.id} ... />)}
  </article>
  <aside className="sticky top-20 h-fit">     {/* Score sidebar */}
    <ScoreRing ... />
    <DimensionRadar ... />
    <QuickActions ... />
  </aside>
</div>
```

**Breakpoints:**
```
< 768px  (mobile):  Single column, no sidebars
768–1023 (tablet):  Two column: TOC hidden, right sidebar below content
≥ 1024px (desktop): Three column layout as above
≥ 1280px (wide):    Same, max-width cap at 1400px
```

### 3.3 Form Layout

Multi-step forms use a centred single-column layout:

```tsx
<div className="min-h-screen grid place-items-center px-4 py-12">
  <div className="w-full max-w-[640px]">
    <ProgressSteps current={step} total={3} />
    <div className="mt-8 bg-[var(--surface-card)] rounded-2xl shadow-lg p-8">
      {/* Form page content */}
    </div>
    <div className="flex justify-between mt-6">
      <Button variant="ghost" onClick={prevStep}>← Back</Button>
      <Button variant="primary" onClick={nextStep}>Next →</Button>
    </div>
  </div>
</div>
```

---

## 4. Coding Conventions

### 4.1 Component File Structure

```tsx
// src/components/report/VerdictBanner.tsx

// 1. Imports (external → internal)
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Verdict } from '@/types/report'

// 2. Types
interface VerdictBannerProps {
  verdict:   Verdict
  score:     number
  rationale: string
  className?: string
}

// 3. Constants (if needed)
const VERDICT_CONFIG = {
  go:     { label: 'GO',     icon: CheckCircle,    bg: 'bg-[var(--verdict-go-bg)]',     text: 'text-[var(--verdict-go-text)]' },
  revise: { label: 'REVISE', icon: AlertTriangle,  bg: 'bg-[var(--verdict-revise-bg)]', text: 'text-[var(--verdict-revise-text)]' },
  'no-go':{ label: 'NO-GO',  icon: XCircle,        bg: 'bg-[var(--verdict-nogo-bg)]',   text: 'text-[var(--verdict-nogo-text)]' },
}

// 4. Component (named export always)
export function VerdictBanner({ verdict, score, rationale, className }: VerdictBannerProps) {
  const config = VERDICT_CONFIG[verdict]
  const Icon = config.icon

  return (
    <motion.div
      className={cn('rounded-xl p-6 flex items-center gap-6', config.bg, config.text, className)}
      variants={verdictVariants}
      initial="hidden"
      animate="visible"
    >
      <Icon className="w-8 h-8 shrink-0" aria-hidden />
      <div>
        <div className="font-display text-4xl font-bold">{config.label}</div>
        <div className="text-sm opacity-80">{rationale}</div>
      </div>
      <div className="ml-auto font-mono text-7xl font-bold opacity-90" aria-label={`Score: ${score} out of 100`}>
        {score}
      </div>
    </motion.div>
  )
}
```

### 4.2 Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `VerdictBanner`, `ScoreRing` |
| Hooks | camelCase, `use` prefix | `useReport`, `useChat` |
| Utility functions | camelCase | `formatScore`, `buildShareUrl` |
| Constants | SCREAMING_SNAKE | `INDUSTRIES`, `VERDICT_CONFIG` |
| CSS variables | kebab-case in `--` | `--verdict-go-bg` |
| Tailwind classes | as-is | `bg-brand-500` |
| API endpoints | kebab-case | `/api/report/generate` |
| DB columns | snake_case | `share_token`, `created_at` |
| TypeScript types | PascalCase | `Report`, `StartupFormData` |
| Zod schemas | camelCase + Schema suffix | `startupFormSchema` |

### 4.3 Import Order (enforced by ESLint)

```typescript
// 1. Node built-ins
import path from 'path'

// 2. External packages
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// 3. Internal absolute imports (@ alias)
import { Button } from '@/components/ui/button'
import { useReport } from '@/hooks/useReport'
import type { Report } from '@/types/report'

// 4. Relative imports
import { ScoreRing } from './ScoreRing'
```

### 4.4 State Management Rules

- **Server state** (API data): TanStack Query — never duplicate in Zustand
- **UI state** (open/close modals, active tab): local `useState` in the component
- **Shared client state** (auth user, current report, chat messages): Zustand stores
- **Form state**: React Hook Form — never mix with Zustand

### 4.5 Error Handling in Components

```tsx
// Use ErrorBoundary for unexpected errors
<ErrorBoundary fallback={<ReportErrorFallback />}>
  <ReportView />
</ErrorBoundary>

// Use conditional rendering for expected error states
function ReportView() {
  const { data, error, isLoading } = useReport(reportId)

  if (isLoading) return <ReportSkeleton />
  if (error)     return <ReportLoadError error={error} onRetry={refetch} />
  if (!data)     return <ReportNotFound />

  return <ReportContent report={data} />
}
```

### 4.6 Performance Rules

- **Lazy load** all page components: `const Report = lazy(() => import('./pages/Report'))`
- **Memoize** expensive chart renders: `const RadarChart = memo(DimensionRadar)`
- **Avoid re-renders**: never create objects/arrays inline in JSX props (`{}` triggers re-render)
- **Images**: use `loading="lazy"` on all non-hero images
- **Fonts**: loaded via `<link rel="preload">` in `index.html`
- **Report JSON**: loaded once, cached by TanStack Query, never re-fetched mid-session unless user explicitly refreshes

---

## 5. Accessibility Standards

### 5.1 Principles

VentureIQ targets **WCAG 2.1 AA** compliance. Every feature shipped must pass:
- Keyboard navigation
- Screen reader compatibility
- Sufficient colour contrast (≥ 4.5:1 for normal text, ≥ 3:1 for large text)

### 5.2 Colour Contrast Matrix

| Combination | Ratio | Pass? |
|---|---|---|
| `--text-primary` on `--surface-bg` | 15.3:1 | ✅ AAA |
| `--text-secondary` on `--surface-card` | 4.7:1 | ✅ AA |
| `--text-muted` on `--surface-card` | 3.2:1 | ✅ AA (large text) |
| `--verdict-go-text` on `--verdict-go-bg` | 6.1:1 | ✅ AA |
| `--verdict-revise-text` on `--verdict-revise-bg` | 5.9:1 | ✅ AA |
| `--verdict-nogo-text` on `--verdict-nogo-bg` | 6.8:1 | ✅ AA |
| White text on `--brand-500` | 3.0:1 | ✅ AA (large) — only used on large buttons |

**Rule:** Never convey information with colour alone. Always pair with:
- Icon (verdict: icon + label + colour)
- Text label (score dimension: number + colour bar)
- Pattern or border (form error: red border + error icon + message text)

### 5.3 Keyboard Navigation Requirements

| Component | Keyboard behaviour |
|---|---|
| Multi-step form | Tab between fields; Enter to submit; Shift+Tab to go back |
| Dropdown (Select) | Tab to focus; Space/Enter to open; Arrow keys to navigate; Enter to select; Esc to close |
| Multi-select tags | Tab to field; Enter/Space to add; Backspace to remove last tag |
| Report TOC sidebar | Tab through links; Enter to activate; focus ring visible |
| Report section expand/collapse | Enter or Space to toggle |
| Chat input | Tab to input; Enter to send; Shift+Enter for newline |
| Modal | Focus trapped inside; Esc to close; Return focus to trigger |
| Verdict banner | Read-only; no interactive elements inside banner itself |

### 5.4 Screen Reader Requirements

**Landmark roles:**
```html
<header role="banner">     <!-- Site header -->
<nav role="navigation">    <!-- TOC sidebar, main nav -->
<main role="main">         <!-- Primary page content -->
<aside role="complementary"><!-- Score sidebar -->
```

**Live regions:**
```tsx
{/* Announce pipeline steps as they change */}
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {currentStepLabel}
</div>

{/* Announce streaming chat response completion */}
<div aria-live="polite" aria-atomic="false" className="sr-only">
  {isStreaming ? 'AI is responding...' : 'Response complete'}
</div>

{/* Toast announcements */}
<div role="alert" aria-live="assertive">
  {toastMessage}
</div>
```

**Score visualisation (non-text content):**
```tsx
<div
  aria-label={`Validation score: ${score} out of 100. Verdict: ${verdict}`}
  role="img"
>
  <ScoreRing score={score} aria-hidden="true" />
</div>
```

### 5.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration:   0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration:  0.01ms !important;
    scroll-behavior:      auto !important;
  }
}
```

In Framer Motion components:
```tsx
import { useReducedMotion } from 'framer-motion'

function VerdictBanner({ ... }) {
  const shouldReduceMotion = useReducedMotion()

  const variants = shouldReduceMotion
    ? { hidden: {}, visible: {} }           // instant
    : { hidden: { opacity: 0, scale: 0.97 }, visible: { opacity: 1, scale: 1 } }

  // ...
}
```

---

## 6. Responsive Design Rules

### 6.1 Breakpoints (matching Tailwind defaults)

```
sm:   640px  — large phones landscape
md:   768px  — tablets portrait
lg:   1024px — tablets landscape, small laptops
xl:   1280px — desktops
2xl:  1536px — large desktops
```

### 6.2 Mobile-Specific Rules

- Touch targets: minimum 44×44px for all interactive elements
- Form inputs: minimum `font-size: 16px` to prevent iOS auto-zoom
- Bottom navigation bar on mobile (`position: fixed; bottom: 0`) for report actions: Export / Share / Q&A
- Report sections: accordion pattern (collapsed by default), tap to expand
- Score ring: reduced size (120px, not 160px) with score displayed as text alongside on very small screens
- Radar chart: hidden on < 480px; replaced with a horizontal bar chart of dimension scores

### 6.3 Responsive Typography

```css
/* Fluid heading scale */
.heading-hero {
  font-size: clamp(2rem, 5vw, 3rem);
}
.heading-page {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
}
```

---

## 7. Icon System

Use **Lucide React** exclusively. No mixing with other icon libraries.

```tsx
import { Lightbulb, Target, TrendingUp, Shield, ChevronDown } from 'lucide-react'

// Standard sizes:
// Small (in text): w-4 h-4  (16px)
// Medium (in cards): w-5 h-5 (20px)
// Large (in heroes): w-8 h-8 (32px)
// XL (in verdict): w-10 h-10 (40px)

// Always add aria-hidden on decorative icons:
<TrendingUp className="w-5 h-5 text-brand-500" aria-hidden />

// Add aria-label on icons that convey meaning without adjacent text:
<CheckCircle className="w-5 h-5" aria-label="Completed" />
```

**Section-to-icon mapping:**

| Section | Icon |
|---|---|
| Idea Summary | `Lightbulb` |
| Problem Analysis | `Target` |
| Target Audience | `Users` |
| Market Opportunity | `TrendingUp` |
| Competition | `Swords` |
| Industry Trends | `BarChart2` |
| Gov Schemes | `Building2` |
| MVP Suggestions | `Wrench` |
| Validation Score | `Star` |
| Risks | `AlertTriangle` |
| Recommendations | `ListChecks` |
| Funding Fit | `Banknote` |
| 30-Day Plan | `Calendar` |
| Final Verdict | `Award` |

---

## 8. Linting and Formatting

**ESLint config:** `eslint-config-react-app` + `@typescript-eslint` + `eslint-plugin-jsx-a11y`

**Prettier config:**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

**Enforced ESLint rules:**
- `jsx-a11y/alt-text` — all images need alt text
- `jsx-a11y/aria-roles` — valid ARIA roles only
- `react-hooks/exhaustive-deps` — complete dependency arrays
- `no-console` — use the project logger utility instead
- `@typescript-eslint/no-explicit-any` — error; use proper types

**Pre-commit hooks (Husky + lint-staged):**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

---

*End of Frontend Guidelines*
