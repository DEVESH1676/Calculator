📄 PRD.md

Product Name: ModCalc (Working Title)
Version: v1.0 (Open Source Professional Toolkit)
Owner: Product Team

1️⃣ Product Overview

ModCalc is a premium, modular, all-in-one calculator toolkit designed for general users, students, developers, and finance-focused users.

It combines:

Standard + Scientific calculator

Financial calculator (EMI, SIP, CAGR)

Real-time currency conversion

Unit conversion

Programmer tools

Graphing engine

AI-enhanced natural input

Premium UI/UX

High performance (Lighthouse > 95)

This is not just a calculator.
It is a professional-grade computation platform.

2️⃣ Vision

Create the most polished open-source modular calculator system that:

Feels like a premium SaaS product

Handles professional-grade financial and technical calculations

Maintains high performance and accessibility

Becomes a reference-level open-source project

3️⃣ Target Users (Personas)
👨‍🎓 Persona 1 — Student

Age: 16–24

Uses scientific + graph mode

Needs quick calculations

Values visual clarity

Often switches between basic & scientific

Pain Points:

Basic system calculator is too limited

Desmos feels heavy

Financial tools are scattered

👨‍💻 Persona 2 — Developer

Needs programmer mode

Base conversions

Bitwise operations

Quick productivity tool

Pain Points:

Switching between tools slows workflow

No premium UI developer calculator exists

💰 Persona 3 — Finance User / Trader

Uses EMI, SIP, CAGR

Needs amortization breakdown

Needs real-time currency rates

Values financial precision

Pain Points:

Online calculators are ad-heavy

Financial math lacks transparency

No clean, unified tool

👤 Persona 4 — General User

Wants simple, fast calculator

Appreciates clean UI

Occasionally needs unit or currency conversion

4️⃣ Core Features (MVP v1.0)
🔹 1. Standard + Scientific Calculator

Full operator support

Parentheses parsing

Trigonometry (rad/deg)

Logarithmic functions

High-precision math

Expression history

Keyboard support

🔹 2. Financial Toolkit
EMI

Monthly EMI

Total interest

Amortization schedule

Principal vs interest chart

SIP

Future value calculation

Yearly growth visualization

CAGR

CAGR %

Comparison visualization

Precision handled using Decimal.js.

🔹 3. Real-Time Currency Converter

Live exchange rate API

1-hour caching

Last updated timestamp

Offline fallback mode

Error handling UI

🔹 4. Unit Converter

Length

Weight

Temperature

Currency (linked to API)

Swap animation

Real-time conversion

🔹 5. Programmer Mode

BIN / OCT / DEC / HEX

Bitwise operations

Shift operators

Immediate base sync

Overflow protection

🔹 6. Graphing Engine

Function input: y = f(x)

Plot range -10 to 10 (configurable)

Zoom & pan

Tooltip hover

Animated curve drawing

Crosshair cursor

🔹 7. AI Natural Input Mode

Parse: “45% of 380”

Parse: “EMI for 5L at 8% for 10 years”

Parse: “BMI 70kg 175cm”

Show explanation steps

Suggest corrections for invalid input

5️⃣ Non-Goals (v1.0)

No user authentication

No cloud sync

No payment system

No advanced financial portfolio management

No heavy AI backend hosting

6️⃣ Design Requirements

Premium glassmorphism UI

Unified motion system

Microinteractions

Smooth tab transitions

Animated theme switching

Dark-first design

Theme presets:

Dark

Light

Neon

Minimal

7️⃣ Performance Requirements

Lighthouse > 95

No console errors

Lazy loading per module

Code splitting

Memoized graph datasets

API caching

Minimal bundle size

8️⃣ Accessibility Requirements

ARIA roles

Keyboard navigation

Focus indicators

Proper tab ordering

Screen reader compatibility

9️⃣ Technical Architecture
/modules
/standard
/scientific
/financial
/unit
/programmer
/hooks
/utils
/services
/context
/components
/animations

State management via Context or Zustand

API abstraction layer

Reusable button components

Unified animation system

🔟 Success Metrics
🎯 Performance

Lighthouse score > 95

FCP < 1.5s

TTI < 2.5s

🎯 Technical Quality

90% test coverage for financial formulas

Zero console warnings

Clean TypeScript types (if used)

🎯 Open Source Success

100+ GitHub stars (first milestone)

Clean documentation

Contributor-friendly structure

🎯 UX Quality

Smooth transitions (no abrupt state shifts)

Zero precision errors

API failures handled gracefully

1️⃣1️⃣ Future Roadmap (v2+)

Cloud sync

Saved sessions

Financial portfolio simulator

Plugin system

Shareable calculation links

Mobile app version

PWA offline install

1️⃣2️⃣ Competitive Positioning

This is positioned between:

Basic system calculators

Heavy tools like WolframAlpha

Desmos graphing tool

Scattered financial calculators

It becomes:

“Premium, modular, open-source professional calculator toolkit.”

Final Summary

This product is:

Open-source

High-performance

Modular

Visually premium

Financially precise

Developer-friendly

Production-grade
