# Lucky Cable Responsive Website and Admin Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver an accessible, responsive, original-design public website and clearly non-production management shell for Lucky Cable Daman without inventing business data or representing deferred backend functions as implemented.

**Architecture:** Begin with a modular type-safe web frontend in the empty repository. Route-level public pages share marketing navigation and tokens; admin pages share a restrained workspace layout and honest setup/empty states. Keep API, auth/RBAC, persistence, MSR and operational data integration deferred; do not introduce a fake backend or client-side security boundary.

**Tech Stack:** Next.js App Router, TypeScript, CSS custom properties/Tailwind only if compatible with the clean starter setup, native CSS/SVG motion and semantic HTML, Vitest/Testing Library and Playwright where installable.

**Spec:** `docs/PROJECT_DESIGN.md`; awaiting future `LUCKY_CABLE_REQUIREMENTS.md` and original MSR workbook.

## Global Constraints

- No invented company details, prices, service guarantees, package/channel lists, subscriber/customer records, or operational metrics.
- Clearly label missing configuration and non-persisted interactions; never claim secure auth, authorization, data storage, or enquiry delivery exists.
- Do not infer the meaning or calculation of weekly MSR counts; do not overwrite or alter the original workbook.
- Preserve distinct expressive public and restrained enterprise-admin visual systems.
- Use native CSS/SVG and minimal dependencies; honor reduced motion and accessibility.
- Do not install agent plugins/hooks unless Cline compatibility and code have been verified.
- Test actual behavior and visually inspect rendered responsive pages in a real browser before declaring completion.

## Review Focus

- Public and admin page behavior at 390px and desktop widths, including overflow, focus, responsive navigation, and reduced motion.
- Every link resolves to the intended route; pages can be loaded directly after refresh.
- Carousel pointer, keyboard, buttons, announcements, and reduced-motion behavior.
- Contact validation does not imply production submission or message delivery.
- No sample business data enters admin cards/tables; no frontend-only login or false permission enforcement is introduced.

## File Map

- `package.json`, lockfile, `next.config.ts`, `tsconfig.json`, `postcss.config.*`: verified frontend runtime and commands.
- `app/layout.tsx`, `app/globals.css`: document metadata, shared primitives and root token entry.
- `app/(public)/...`: Home, About, Services, Cable TV, Broadband, Packages, Contact, with shared public navigation/layout.
- `app/admin/layout.tsx`, `app/admin/page.tsx`, `app/admin/[module]/page.tsx`: administration workspace shell and module-specific empty states.
- `components/brand/*`, `components/public/*`, `components/admin/*`: reusable brand mark, header/footer, carousel, form, sidebar/workspace primitives.
- `tests/unit/*`, `tests/e2e/*`, `playwright.config.ts`: behavior and browser acceptance coverage.
- `DESIGN.md`, `PRODUCT.md`, `docs/PROJECT_DESIGN.md`, `docs/IMPLEMENTATION_LOG.md`, `docs/COMPLETION_CHECKLIST.md`: preserved design/product boundaries and milestones.

## Milestones and Tasks

### Milestone 1 — Foundation and documentation

- [ ] Confirm Node/registry/browser prerequisites, create the smallest Next.js TypeScript App Router application, and record exact dependencies and commands. Validate install, typecheck, and the unstyled root render before designing UI.
- [ ] Create separate `DESIGN.md` public/admin token systems and `PRODUCT.md` scoped truths from the approved project design. Verify tokens are semantic, replaceable, contrast-conscious, and the documents contain no fabricated claims.
- [ ] Establish a green test runner and Playwright config. Verify a deliberately failing root-route assertion goes red before implementation, then passes when the smallest shell page is added.

### Milestone 2 — Public site

- [ ] Test and implement shared semantic public header/footer, skip link, responsive navigation, brand mark, typography and surface tokens. Browser-check link behavior and keyboard focus.
- [ ] Test and implement the home route with original layered CSS/SVG connection-to-home scene, purposeful entrance motion, content sections and reduced-motion behavior. Verify no third-party assets/claims and no mobile overflow.
- [ ] Test and implement the service carousel's next/previous actions, keyboard controls, pointer/touch navigation, accessible status and responsive behavior; verify those behaviors in actual Playwright browser.
- [ ] Test and implement About, Services, Cable TV, Broadband, Packages and Contact pages with approved-scope copy only. Each route must load directly and include meaningful, explicitly non-fabricated guidance where data is absent.
- [ ] Test contact fields, inline validation and honest disconnected-submission state; verify empty, malformed, and valid forms do not silently claim company receipt.

### Milestone 3 — Admin shell

- [ ] Test and implement separate responsive enterprise admin navigation, accessible collapse/open controls, current module labels and helpful blank states without false auth.
- [ ] Add requested module navigation entries and route-specific descriptions/blocked-prerequisite states. Verify each route, refresh behavior, visible deferred capability labels, and absence of fabricated records/KPIs.
- [ ] Verify shell communicates setup/admin prerequisites and never claims client-only authorization or backend persistence.

### Milestone 4 — QA and handoff

- [ ] Run typecheck, lint, unit tests and production build; fix all failures.
- [ ] Run Playwright journeys on public navigation, carousel, contact validation, admin navigation, direct route reload, mobile and desktop, and reduced-motion preference.
- [ ] Inspect browser console, accessibility semantics/focus, rendered screenshots at desktop/mobile, and horizontal overflow; fix observed issues and recheck.
- [ ] Update `docs/IMPLEMENTATION_LOG.md` and `docs/COMPLETION_CHECKLIST.md` with actual commands, outcomes, screenshot locations and each deferred input-dependent subsystem.

## Future blocked milestone — specification-dependent platform

Do not implement these tasks until the actual spec and workbook are supplied and reviewed: verified service content; production contact delivery; real authentication/session system and server-enforced RBAC; audit logs; MongoDB/Mongoose persistence and validation; data-bearing operational modules; and MSR inspection/import staging/validation/deduplication/approval/versioning/Excel export/PDF/history. First document source workbook sheet/format fidelity, identifiers-as-text and blank-versus-zero tests; stage every import for explicit human preview/commit; never overwrite the original.

## Execution notes

Implementation follows test-first red/green for behaviors. If a dependency is unavailable, select the smallest confirmed compatible alternative and document the limitation. No stage should claim milestones complete solely because source code exists: each requires its listed test and real rendered check.