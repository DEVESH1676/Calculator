# 🛡️ MODCALC CERTIFICATION STANDARD v1.0

A calculator must pass ALL of these to be considered production-grade.

---

# ✅ SECTION 1 — Core Functional Validation

Every calculator MUST pass:

## 🔹 Arithmetic Integrity

* [x] 0.1 + 0.2 = 0.3 (precision handled)
* [x] 9999999999999999 + 1 handled safely
* [x] Division by zero handled gracefully
* [x] Negative number operations correct
* [x] Decimal chaining works (1.2 + 3.4 - 5.6)
* [x] No operator stacking (e.g., ++, ** unless supported)
* [x] Parentheses nesting works correctly
* [x] Large input doesn’t freeze UI
* [x] Result formatting consistent

---

## 🔹 Scientific Validation

* [x] sin(90°) correct in degree mode
* [x] sin(π/2) correct in radian mode
* [x] log(-1) handled safely
* [x] sqrt(-4) handled properly
* [x] Overflow values handled
* [x] Nested functions work
* [x] Expression parser rejects invalid syntax

---

## 🔹 Financial Validation

* [x] EMI formula correct to 2 decimal precision
* [x] Amortization totals match EMI * months
* [x] SIP compound calculation correct
* [x] CAGR formula validated
* [x] Rounding strategy consistent
* [x] Decimal.js used only where required
* [x] Extremely long tenure (30–40 years) doesn’t freeze UI

---

## 🔹 Currency Validation

* [ ] API fetch successful
* [ ] API failure fallback works
* [ ] Rates cached properly
* [ ] No API spam
* [ ] Offline mode works
* [ ] Timestamp visible
* [ ] Base currency switching works

---

# 🎨 SECTION 2 — UI & UX Validation

## 🔹 Layout

* [ ] No overflow at any breakpoint
* [ ] Mobile fully usable
* [ ] Graph collapses correctly
* [ ] Scroll performance smooth
* [ ] No layout shift (CLS stable)

---

## 🔹 Interaction

* [ ] Button hover responsive
* [ ] No double-click glitches
* [ ] Keyboard navigation works
* [ ] Focus ring visible
* [ ] Tabs animate smoothly
* [ ] Mode switching has transition

---

## 🔹 Motion System

* [ ] No janky animations
* [ ] No 60fps drops
* [ ] No GPU spike from blur
* [ ] Animations not blocking main thread
* [ ] Graph animation smooth

---

# 🧠 SECTION 3 — Performance Stress Tests

Run these intentionally:

* [x] Enter 500-digit number
* [x] Rapidly switch modes 50 times
* [x] Spam graph input changes
* [x] Generate 360-row amortization repeatedly
* [x] Toggle themes rapidly
* [x] Simulate slow network
* [x] Simulate offline mode
* [x] Simulate API 429 error

App must:

* Not crash
* Not freeze
* Not leak memory
* Not exceed reasonable CPU spikes

---

# 🐛 SECTION 4 — Bug Hunter / Exploitation Tests

Now we go dangerous.

---

## 🔥 Input Exploits

Test:

* `<script>alert(1)</script>`
* `1e9999`
* `Infinity`
* `NaN`
* `()()()`
* Very long string input
* Unicode injection
* SQL-like strings

Must:

* Not crash
* Not render HTML
* Not eval()
* Not execute JS
* Not freeze

---

## 🔥 Graph Exploits

* y = 1/x at x=0
* y = 10^1000
* Infinite loops in parsing
* Malformed expression
* Rapid re-render

Graph worker must terminate safely.

---

## 🔥 Financial Exploits

* Negative tenure
* 0% interest
* 1000% interest
* Extremely high principal
* Zero months

Must not break formula logic.

---

## 🔥 Currency Exploits

* Fake API response
* Modified response structure
* Missing rates
* Corrupt cache
* Expired cache

Must fallback safely.

---

# 🛡️ SECTION 5 — Security Hardening Checklist

* [x] No eval()
* [x] No dangerouslySetInnerHTML
* [x] Strict input validation
* [x] API responses sanitized
* [x] Worker properly terminated
* [x] IndexedDB structured access only
* [x] No console errors
* [x] No dependency vulnerabilities

Run:

```
npm audit
```

All high severity must be resolved.

---

# 📊 SECTION 6 — Memory Leak Detection

Use:

* Chrome DevTools Memory tab
* Performance profiler

Test:

* Open graph → close → open → close
* Switch modes 100 times
* Generate 10 large amortization tables

Memory must stabilize.

If it keeps increasing → fail.

---

# ⚡ SECTION 7 — Lighthouse Certification

Minimum:

* Performance > 95
* Accessibility > 95
* Best Practices > 95
* SEO > 90

No unused JS chunks.
No layout shifts.
No blocking scripts.

---

# 📦 SECTION 8 — Bundle Size Check

* Build size < 300kb gzipped
* No duplicated dependencies
* No heavy chart library bloat
* No unnecessary icon packs

---

# 🧪 SECTION 9 — Automated Testing Requirements

Must include:

* [x] Unit tests for financial formulas
* [x] Parser tests
* [x] Edge case tests
* [x] Worker cleanup tests
* [x] Mock API failure tests

Minimum 80% coverage.

---

# 💀 FATAL FAILURE CONDITIONS

Calculator is disqualified if:

* Uses eval()
* Freezes UI > 1 second
* Memory leak detected
* Precision errors in finance
* API spam detected
* XSS possible
* Unhandled promise rejection
* Console errors in production

---

# 🧠 SECTION 10 — Developer Experience Test

* Clean folder structure
* Clear module separation
* No massive 1000-line component
* Reusable components
* Proper TypeScript typing
* Documented functions