# Implementation Plan - Project Initialization & Infrastructure

## Goal

Complete the initialization of the ModCalc project by setting up code quality tools (Prettier, Strict ESLint), testing infrastructure (Vitest), and developer experience improvements (Path Aliases).

## User Review Required

> [!IMPORTANT]
> I will be modifying `vite.config.ts` and `tsconfig.app.json` to support path aliases (e.g., `@/components`).
> I will also add `prettier` and `vitest` to `package.json`.

## Proposed Changes

### Infrastructure & Config

#### [MODIFY] [package.json](file:///d:/VSCode/Calculator/package.json)

- Add `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier` dependencies.
- Add `vitest`, `@testing-library/react`, `@testing-library/dom`, `jsdom` for testing.
- Add `test` and `format` scripts.

#### [NEW] [.prettierrc](file:///d:/VSCode/Calculator/.prettierrc)

- Create Prettier configuration file.

#### [MODIFY] [eslint.config.js](file:///d:/VSCode/Calculator/eslint.config.js)

- Integrate Prettier with ESLint.
- Ensure strict TypeScript rules are enabled.

#### [MODIFY] [tsconfig.app.json](file:///d:/VSCode/Calculator/tsconfig.app.json)

- Add `baseUrl` and `paths` for alias support (`@/*` -> `./src/*`).

#### [MODIFY] [vite.config.ts](file:///d:/VSCode/Calculator/vite.config.ts)

- Add `resolve.alias` configuration to match TypeScript paths.
- Add `test` configuration for Vitest.

### Verification Plan

#### Automated Tests

- Run `npm run format` to verify Prettier.
- Run `npm run lint` to verify ESLint.
- Run `npm test` (after creating a dummy test) to verify Vitest.
- Check if the app builds with `npm run build`.

#### Manual Verification

- I will create a simple test file `src/utils/math.test.ts` to verify Vitest is working.
- I will inspect `vite.config.ts` and `tsconfig.app.json` to ensure aliases are correctly configured.
