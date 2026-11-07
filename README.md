# Lucky Cable Daman

A Next.js public website and MongoDB-backed private management platform for Lucky Cable Network, Daman.

## Features

- Premium responsive public website with supplied company/provider assets, accessible motion, packages, directors, partners, and verified contact details.
- Private staff sign-in with opaque MongoDB sessions, password hashing, login throttling, same-site cookies, and server-enforced role permissions.
- MongoDB-backed customers, cable TV/broadband/other-service catalogues and subscriptions, channels, racks/assignments, invoices/payments, complaints, users, settings, audit history, and verified dashboard counts.
- MSR `.xlsx` staging, structural validation, row preview, duplicate/conflict protection, explicit import, immutable source download, PDF rendition, and audit events.
- Weekly MSR observations are preserved independently. Blank and zero remain distinct; formulas are not executed; no unapproved totals are calculated.

## Local setup

Requirements: Node.js 20.9+ (tested with Node 22), npm, and a MongoDB Atlas/local MongoDB database.

```powershell
npm ci
Copy-Item .env.example .env.local
# Fill .env.local with private values, then:
npm run admin:bootstrap
npm run dev
```

Routes:

- Website: `http://127.0.0.1:3000`
- Private management: `http://127.0.0.1:3000/admin`
- Data-free design preview: `http://127.0.0.1:3000/preview/admin`

Never commit `.env.local`, workbooks, customer data, source screenshots, or reference videos. Bootstrap variables are for one-time local execution only and must be cleared immediately afterward.

## Environment

See `.env.example`. Required:

- `MONGODB_URI`
- `MONGODB_DB`
- `SESSION_SECRET` (32+ random characters)
- `NEXT_PUBLIC_SITE_URL` (the canonical origin used for mutation-origin validation)
- `CRON_SECRET` (a distinct 32+ character secret protecting the scheduled MongoDB keepalive)

`vercel.json` schedules a protected daily Atlas ping after deployment. Database connections also retry transient wake-up/network failures up to three times and rebuild stale cached connections. This cannot override an Atlas suspension caused by billing, quota, revoked credentials, deletion, or provider policy.

## Verification

```powershell
npm run typecheck
npm run test:unit
npm run test:integration
npm test
npm run build
npm audit --omit=dev
```

Integration tests use an isolated in-memory MongoDB. Browser tests cover desktop Chromium and Pixel 7 emulation. The original MSR workbook is never modified by tests.

## Trial deployment and domain replacement

Read [`DEPLOYMENT.md`](DEPLOYMENT.md) for the current Vercel-only trial. A future, separately approved domain cutover is documented in [`SITE_REPLACEMENT.md`](SITE_REPLACEMENT.md); the trial does not change `luckycablenetwork.com`.

## Important policy gates

The software deliberately does not invent MSR weekly-count semantics, tax calculations, report approval/amendment policy, payment deletion, channel entitlements, or provisioning integrations. Written Lucky Cable approval is still required for the detailed retention/privacy, invoice/tax, support-status, and report-approval policies before production operations.
