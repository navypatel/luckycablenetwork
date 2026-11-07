# Lucky Cable Management Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a private MongoDB-backed management portal and staged MSR workflow, then deploy to a Vercel preview before an explicitly approved live-domain cutover.

**Architecture:** Extend the existing Next.js 16 App Router modular monolith without changing the public site or data-free preview. MongoDB/Mongoose is the sole operational database; server-only services own validation, authorization and audit, and admin routes fail closed when no database/staff account is configured. Source workbooks remain immutable and private; MSR import is staged and approved before a separate immutable version is created.

**Tech Stack:** Next.js, TypeScript, Mongoose/MongoDB, Zod, bcrypt, ExcelJS (subject to workbook fidelity testing), browser Playwright; npm. GitHub repository `https://github.com/navypatel/luckycablenetwork.git` (remote main currently initial README only).

**Spec:** `LUCKY_CABLE_REQUIREMENTS.md`; workbook profile `docs/MSR_WORKBOOK_PROFILE.md`.

## Global Constraints

- Preserve `124190_SMS_EXL_JUN_2025.xlsx` verbatim and outside public assets/version control; hash `4515e7ae61dcd4f95c9fcb63c31be0e95778da8ac3bd9d4ad1873421f5e811ee`.
- Weekly count meanings, approval policy, fine-grained role matrix, financial/tax rules and customer retention are **TBD**. Never infer them or silently delete/transform data.
- `/preview/admin` remains explicitly data-free; no customer/payment/workbook data through public preview routes.
- No operational data is accepted or displayed without a MongoDB connection, active server-side staff session and authorized operation.
- Only display user-provided content as verified; no invented business records, metrics, or payments.
- Trial deployments must use Vercel preview URL first; do not change luckycablenetwork.com DNS or existing production deployment without separate cutover approval.

## Review Focus

- Unauthorized requests to both pages **and** APIs fail closed, including on misconfigured database/session secrets.
- Deactivated users and changed roles lose access promptly; login is rate limited and cookies are HTTP-only, same-site and secure in production.
- MSR identifiers preserve leading zeroes, blank weekly cells stay distinct from zero, formula cells are not executed, duplicate rows/files are flagged.
- Imported files cannot be fetched from public paths or leaked via logs; Excel export retains original structure/format within proven fidelity limits.
- Financial mutations do not invent tax or delete posted records; customer visibility and approval policies require owner confirmation.

## Milestone 1 — Private admin foundation

### Task 1 — Configuration, connectivity and bootstrap
- [ ] Add `.env.example` documenting `MONGODB_URI`, `MONGODB_DB`, session secret and first-admin bootstrap; add only the dependencies this vertical slice uses.
- [ ] Write a failing unit test for configuration and fail-closed behavior; then implement server-only config/DB connection with health checks and no logged credentials.
- [ ] Provide one-time initial admin creation using a local-only script, environment-supplied credentials and bcrypt. No default password or public setup endpoint.
- [ ] Verify unit tests, TypeScript, production build; test disconnected/connected paths without pretending local Mongo exists.

### Task 2 — Sessions and server RBAC
- [ ] Write failing tests for expired/revoked sessions, disabled users, role boundaries and unauthorized API access.
- [ ] Implement MongoDB-backed opaque session tokens (store only token hashes), Secure/HttpOnly/SameSite cookies, bounded lifetime, logout, login rate limiting and CSRF/origin checks on mutations.
- [ ] Implement documented conservative role-to-resource-action matrix; Super Admin for user/setting mutations and approvals until management confirms granular rights.
- [ ] Guard every `/admin` page and `/api/admin/**` route server-side; `/preview/admin` stays a separate read-only shell.
- [ ] Browser-test login/logout, refusal and role-restricted requests with temporary fixture users on an isolated test DB.

### Task 3 — Admin application shell and audit
- [ ] Reuse the existing visual tokens but separate private navigation links from `/preview/admin`; show actual signed-in identity and permitted modules.
- [ ] Add append-only audit records for authentication, staff changes, imports and state transitions; prevent secrets/customer payloads in audit.
- [ ] Browser-check responsive/focus/error/empty states and direct-route reload. No fabricated KPI metrics.

## Milestone 2 — MSR vertical slice (separate testable deliverable)

### Task 4 — Workbook parser and fixture fidelity
- [ ] Build sanitized OOXML fixture structurally matching `SubscriberReport` A:J; never commit real rows.
- [ ] Write failing tests for header order, protected sheet/formula detection, leading-zero identifiers, missing vs blank vs numeric zero, duplicate candidates and malformed/oversize uploads.
- [ ] Parse without executing formulas or HTML; compare the source workbook read-only and document any actual unsupported ExcelJS round-trip parts including `calcChain.xml`.

### Task 5 — Staging, preview and commit
- [ ] Authenticated upload with size/MIME/signature/structure validation; private blob storage and immutable checksums.
- [ ] Persist staged metadata/entries with precise row and column issues, user-visible duplicate review and explicit commit confirmation; idempotency and period conflict handling.
- [ ] Authorized commit creates an immutable report version with source blob reference and audit event, never overwrites source or approved history.

### Task 6 — Exports, approvals, history
- [ ] Export approved original-layout Excel by copying template and changing only intended data cells; compare styles, widths, sheet protection, formulas, print settings and blank/zero fidelity in a regression test.
- [ ] Add paginated landscape PDF with headings and page numbers after verifying renderer works in Vercel's Node runtime.
- [ ] Implement version history, read-only approved snapshots and tightly controlled approvals/amendments **only after** approval roles and period/version policy are confirmed.
- [ ] Browser-test preview, conflicts, approval, Excel and PDF downloads; never expose private report files via public assets.

## Milestone 3 — Operational modules

### Task 7 — Approved customer fields and service relationships
- [ ] Confirm permitted personal fields and retention before accepting real customers. Model customer ID as text with multiple subscriptions.
- [ ] Server-validated customer CRUD, searchable/filterable paginated tables and audited changes; browser-test access and validation.
- [ ] Cable TV and broadband catalogues/subscriptions link to approved records; no inferred channel/plan entitlements or network provisioning.

### Task 8 — Channels, racks and other services
- [ ] Channel/rack catalogues and dated assignments with text-preserved identifiers, conflict validation, history and search/pagination.
- [ ] Other services/settings only as management-approved named catalogues. Audit mutation access and negative permissions.

### Task 9 — Finance, complaints and analytics
- [ ] Confirm currency/tax/invoice numbering/reversal policy, then build invoices, line items and payments with append-only financial adjustments rather than deletion.
- [ ] Confirm support statuses/priority policy, then implement complaint lifecycle, assignments and private notes.
- [ ] Add reports/dashboard metrics only from valid Mongo records with documented definitions, and search/filter/export permissions.

## Milestone 4 — Preview deployment and controlled cutover

### Task 10 — Release gate
- [ ] Document MongoDB Atlas credentials, network allowlist strategy, private blob storage, backup/restore drill, staff bootstrap and Vercel environment settings without committing secrets.
- [ ] Run unit, integration, Playwright desktop/mobile, production build and security checks against isolated preview services; record unresolved acceptance items plainly.
- [ ] Initialize Git using the remote `main` history (initial README), commit only reviewed files, check ignored workbook/reference media and `git status`, then push to the authorized GitHub repository **without forcing** history.
- [ ] Connect GitHub to Vercel and validate preview URL, MSR storage/PDF runtime, security and role checks. Only then document reversible DNS/custom-domain cutover and rollback; no DNS changes until separately approved.

## Current environment / blockers (2026-11-05)

- No `MONGODB_URI`, live local MongoDB or Docker daemon; cannot demonstrate actual DB-backed workflows until a MongoDB Atlas trial cluster is provisioned and configured.
- No staff roster/initial administrator credentials, approved exact role matrix, customer privacy/retention, MSR approval/version policy or invoice/tax rules; do not guess or activate affected paths.
- No approved private object storage or Vercel account connection; local filesystem is not durable in Vercel functions.
- This working directory is not a Git repository; remote GitHub main has only commit `940bc0a` (initial README). `gh` CLI unavailable. Remote push requires authenticated Git access and must not use force.

## Self-review

Tasks cover all required modules, auth/RBAC/audit, MSR upload/preview/commit/exports/versioning, Mongo persistence and deployment. No acceptance check can be marked complete without both a failing-then-passing test and verified infrastructure; finance and approval gates remain explicitly blocked until authoritative decisions are supplied. The first safe slice is Task 1 + fail-closed permission policy; it does not pretend to finish the entire platform.