# ModCalc - Tasks

## 1. Project Initialization & Infrastructure

- [x] Initialize Vite project with React and TypeScript
- [x] Configure Tailwind CSS with custom theme variables (colors, fonts)
- [x] Install and configure ESLint and Prettier for strict TypeScript
- [x] Set up Vitest for unit testing
- [x] Set up Path Aliases (@/components, @/modules, etc.) in vite.config.ts and tsconfig.json
- [x] Initialize Git repository

## 2. Core Architecture & UI Foundation

- [x] Create directory structure (modules, components, hooks, services, workers)
- [x] Install dependencies: `react-router-dom`, `zustand`, `framer-motion`, `clsx`, `tailwind-merge`, `lucide-react`
- [x] Create `ThemeProvider` and Theme Store (Zustand) for Light/Dark/Neon/Minimal modes
- [x] Create MainLayout and standard UI components
- [x] Configure Routing
- [x] Create `App` layout component with `GlobalToastProvider` and `Background`
- [x] Create reusable `CalculatorButton` component with variants
- [x] Create `InputDisplay` component with animation support
- [x] Create `TabNavigation` component for switching modules
- [x] Set up React Router with lazy loading for modules

## 3. Storage & Services Layer

- [x] Install `dexie` and `decimal.js`
- [x] Create `db/index.ts` configuration for IndexedDB (History, Settings, Currency Cache)
- [x] Create `useHistory` hook for saving/retrieving calculation history
- [x] Create `CurrencyService` with caching logic (fetch + localStorage/IndexedDB fallback)
- [x] Create `SettingsStore` (Zustand) for global preferences (precision, radians/degrees)

## 4. Standard Calculator Module

- [x] Create `modules/standard/StandardCalculator.tsx` layout
- [x] Implement basic arithmetic logic (add, subtract, multiply, divide)
- [x] Implement keyboard support for standard operations
- [x] Connect input/output to Global History
- [ ] Write unit tests for standard math operations

## 5. Scientific Calculator Module

- [ ] Create `modules/scientific/ScientificCalculator.tsx` layout
- [ ] Implement trigonometric functions (sin, cos, tan) with Rad/Deg toggle
- [ ] Implement logarithmic functions (log, ln)
- [ ] Implement power and root functions
- [ ] Write unit tests for scientific functions

## 6. Financial Toolkit Module

- [ ] Create `modules/financial/FinancialModule.tsx` layout with sub-tabs (EMI, SIP, CAGR)
- [ ] Implement `Decimal.js` wrapper for financial precision
- [ ] **EMI Calculator**:
  - [ ] Create Input Form (Amount, Rate, Tenure)
  - [ ] Implement EMI calculation logic
  - [ ] Create Amortization Table component (virtualized list)
  - [ ] Write unit tests for EMI formulas
- [ ] **SIP Calculator**:
  - [ ] Create Input Form (Monthly Investment, Rate, Time)
  - [ ] Implement Future Value logic
  - [ ] Create Growth Chart wrapper (using lightweight chart library or SVG)
  - [ ] Write unit tests for SIP formulas
- [ ] **CAGR Calculator**:
  - [ ] Implement CAGR logic and UI
  - [ ] Write unit tests for CAGR

## 7. Programmer Mode Module

- [ ] Create `modules/programmer/ProgrammerCalculator.tsx` layout
- [ ] Implement Base Conversion logic (Bin, Oct, Dec, Hex)
- [ ] Implement Bitwise Operations (AND, OR, XOR, NOT, Shifts)
- [ ] Implement Word Size toggles (8, 16, 32, 64-bit)
- [ ] Write unit tests for bitwise logic

## 8. Unit Converter Module

- [ ] Create `modules/unit/UnitConverter.tsx` layout
- [ ] Create Unit Conversion Service/Utilities (Length, Weight, Temp)
- [ ] Implement Currency Conversion UI connected to `CurrencyService`
- [ ] Add swap animation for inputs
- [ ] Write unit tests for unit conversions

## 9. Graphing Engine

- [ ] Create `workers/graphWorker.ts` for background computation
- [ ] Create `modules/graph/GraphCalculator.tsx` layout with Canvas
- [ ] Implement function parser for graphing (y = f(x))
- [ ] Implement Pan/Zoom logic on Canvas
- [ ] Integrate Worker with UI to render points
- [ ] Write unit tests for graph coordinator

## 10. AI/Natural Input Mode

- [ ] Create `modules/ai/NaturalInput.tsx` layout
- [ ] Implement Regex-based Intent Parser (detect "EMI", "50% of", units)
- [ ] Map intents to specific module functions
- [ ] Display step-by-step explanation for parsed result
- [ ] Write unit tests for intent parser

## 11. Final Polish & Performance

- [ ] Audit Lighthouse score and optimize (Fonts, Lazy Loading)
- [ ] Verify PWA manifest and Service Worker
- [ ] Ensure 100% keyboard accessibility (Tab order, Focus rings)
- [ ] Run full test suite and fix regressions
- [ ] Create User Guide / Documentation in UI

---

## Reference: Previous Roadmap (Legacy)
*Merged from previous session plans. Most items are covered above.*

### Phase 1: Deep Audit
- [x] **State Flow & Re-render Analysis**: Identify prop drilling and unnecessary renders.
- [x] **Component Responsibility Review**: Check for monolithic components code splitting opportunities.
- [x] **Precision & Logic Check**: Audit floating point handling and edge cases.
- [x] **Accessibility & Motion Audit**: Evaluate ARIA usage and animation performance.
- [x] **Report Generation**: Compile findings into an audit summary.

### Phase 2: Core Optimization
- [x] **State Management**: Implement Context/Zustand, remove prop drilling.
- [x] **Precision Fixes**: Integrate `decimal.js` or `big.js`, fix rounding errors.
- [x] **Performance**: Lazy load modes, code-split routes, memoize graph data.

### Phase 3: Real-Time Data Integration
- [x] **Currency Converter**: Integrate external API with caching and fallback.
- [x] **Financial Enhancements**: Add Amortization schedule, SIP yearly growth chart.

### Phase 4: Graphing Engine Upgrade
- [x] **Optimization**: Memoize rendering, use `requestAnimationFrame`.
- [x] **UX**: Add crosshair, tooltips, smooth zoom/pan.

### Phase 5: Motion System Upgrade
- [ ] **Unified Motion**: Implement page transitions, micro-interactions using Framer Motion (or optimized CSS).

### Phase 6: Edge Case Handling
- [ ] **Robustness**: Handle massive numbers, division by zero, API failures, offline state.

### Phase 7: Architecture Upgrade
- [ ] **Restructure**: Reorganize into `/modules`, `/services`, `/hooks`, `/context`.

### Phase 8: Accessibility
- [ ] **A11y**: Add ARIA roles, focus rings, keyboard navigation.

### Phase 9: Responsive Optimization
- [ ] **Mobile/Tablet**: optimize layouts and touch interactions.

### Phase 10: Testing & Final Polish
- [ ] **Testing**: Add unit tests, snapshot tests.
- [ ] **Final Polish**: Lighthouse score > 90, documentation, cleanup.
