📄 TechDoc.md

Project: ModCalc
Role: CTO Technical Architecture Document
Stack Decision: Finalized Below
Target: High-performance, modular, open-source toolkit

1️⃣ Technology Stack Decision

You proposed:

React

Vite

Tailwind CSS

SQLite

That’s good — but we’ll refine it.

✅ Final Recommended Stack
Frontend

React 18+

Vite (for lightning-fast dev + optimized build)

TypeScript (mandatory for Level 3 complexity)

Tailwind CSS

Framer Motion (controlled animations)

Zustand (lightweight state management)

Decimal.js (financial precision)

React Router (lazy loaded modules)

Backend (Only If Needed)

We actually do NOT need a backend for MVP v1.0 unless:

We add saved sessions

Cloud sync

User accounts

For now:

👉 This should be a frontend-first PWA

Currency API can be fetched directly with caching layer.

Database Decision

If offline persistence is needed:

Use:

IndexedDB (via Dexie.js)

NOT SQLite for MVP.

Why?

SQLite in browser = heavy + unnecessary
IndexedDB = native, performant, async, perfect for PWA

SQLite only makes sense if:

You build desktop app (Tauri / Electron)

Or server-backed app

2️⃣ System Architecture Overview

High-level structure:

/src
  /app
  /modules
    /standard
    /scientific
    /financial
    /unit
    /programmer
    /graph
    /ai
  /components
  /hooks
  /store
  /services
  /utils
  /types
  /workers
3️⃣ Component Architecture
🔹 Root Level

App
├── ThemeProvider
├── Router
│ ├── StandardModule
│ ├── ScientificModule
│ ├── FinancialModule
│ ├── UnitModule
│ ├── ProgrammerModule
│ ├── GraphModule
│ └── AIModule
└── GlobalToastProvider

🔹 Shared Core Components

Reusable:

CalculatorButton

ExpressionDisplay

TabNavigation

AnimatedContainer

InputField

ChartContainer

LoadingSkeleton

ErrorBoundary

🔹 Module Isolation Principle

Each module must:

Contain its own state logic

Export only UI entry component

Not depend on other modules

Use shared utils only

This prevents scaling issues.

4️⃣ State Management Design

Use Zustand.

Global store only for:

Theme

History

Currency rates cache

Settings

User preferences

Module state remains local unless necessary.

Avoid global calculation state.

5️⃣ Database Schema (IndexedDB via Dexie)

If persistence is enabled:

🗂 Tables
1. calculation_history
id: string (uuid)
module: string
expression: string
result: string
metadata: JSON
created_at: timestamp
2. currency_cache
id: "latest"
rates: JSON
base_currency: string
last_updated: timestamp
3. settings
id: "global"
theme: string
rad_deg: string
precision: number
6️⃣ API Endpoints

For MVP:

🔹 External Currency API

Example:

GET https://api.exchangerate-api.com/v4/latest/USD

Wrapped in service:

/services/currencyService.ts

Must include:

Rate limiting

Error fallback

Cache TTL = 1 hour

AbortController for cancellation

🔹 Future Backend (Optional)

If backend added later:

GET /api/rates

Returns cached rates

POST /api/calc/save

Stores calculation

GET /api/calc/history

Fetch user history

7️⃣ Graph Engine Architecture

Heavy computation should:

Run inside Web Worker

Not block main thread

Memoize function parsing

Generate dataset only when expression changes

Use:

/workers/graphWorker.ts

This prevents UI freeze.

8️⃣ AI Natural Input Layer

Do NOT call large LLM in production.

Instead:

Rule-based parser

Regex intent detection

Predefined financial formula mappings

Example:

"EMI for 5L at 8% for 10 years"

→ detect EMI intent
→ extract numbers
→ map to EMI formula

Keep AI deterministic.

9️⃣ Performance Optimization Strategy
Must Implement:

Route-level code splitting

Lazy load graph engine

Memoize heavy components

Avoid re-render of entire layout

Virtualize long amortization tables

Debounce financial input

🔟 Potential Fatal Bottlenecks (Your Hardware)

System:

8GB VRAM

24GB RAM

i7 14th Gen

That’s powerful — but these are risks:

⚠️ 1. Graph Memory Leaks

If:

You regenerate large datasets repeatedly

Don’t clean event listeners

Don’t terminate workers

Memory usage will balloon.

Fix:
Always terminate workers on unmount.

⚠️ 2. Heavy Animations

Too many:

blur effects

backdrop filters

box shadows

animated gradients

Can spike GPU usage.

Glassmorphism + large background blur is GPU heavy.

Solution:
Limit blur layers.
Avoid animating blur itself.

⚠️ 3. Currency API Spam

If every input triggers fetch:
You’ll hit rate limits.

Solution:
Cache properly.
Only fetch when base currency changes.

⚠️ 4. Financial Table Rendering

Large amortization schedules (30 years monthly = 360 rows)

Rendering full table repeatedly can lag.

Solution:
React Window virtualization.

⚠️ 5. Precision Library Overuse

Decimal.js is slower than native number.

Use only in financial mode.
Not everywhere.

⚠️ 6. Bundle Size Explosion

Risk areas:

Chart.js

Framer Motion

Decimal.js

Large icon libraries

Keep under control.

Target build size:
< 250KB gzipped

1️⃣1️⃣ Security Considerations

Sanitize user input

Prevent XSS via dynamic expression rendering

No eval()

Use safe math parser

Validate API responses

1️⃣2️⃣ Testing Strategy

Unit tests for financial formulas

Expression parser tests

Edge case tests (NaN, Infinity)

Worker memory tests

Performance profiling

1️⃣3️⃣ Lighthouse Strategy

To hit >95:

Minimize blocking scripts

Preload fonts

Use system font if possible

Optimize images

Defer non-critical JS

Avoid layout shift

1️⃣4️⃣ Deployment Strategy

Build as PWA

Enable offline mode

GitHub Pages or Vercel

Add manifest.json

Enable service worker caching

Final CTO Summary

This project should be:

Frontend-first

Modular

Worker-enabled for heavy tasks

IndexedDB for persistence

Deterministic AI logic

Precision-scoped financial math

Optimized for performance from day one