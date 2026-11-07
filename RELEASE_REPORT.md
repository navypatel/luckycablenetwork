# Vercel trial release report

Date: 2026-11-07

## Verified working

- Public website routes, responsive layouts, supplied imagery, provider gallery, forms, keyboard interactions, and reduced-motion behavior.
- Private staff sign-in, opaque MongoDB sessions, bcrypt password hashes, login throttling, logout, and server-side provisional RBAC.
- MongoDB-backed customers, service catalogues/subscriptions, channels, racks/current slots, invoices/payments, complaints, staff users, settings, audit history, and dashboard counts.
- Rack C–O operational inventory is persisted privately in Atlas; it is not embedded in the Git repository or presented as public channel availability.
- MSR source staging, worksheet selection, structural and cell validation, duplicate/period conflict protection, preview, explicit import, original-byte Excel download, and PDF rendition.
- MongoDB transient retry/reconnect and a secret-protected daily Vercel Cron health ping.
- Secrets, source workbook, original screenshots/video, logs, test output, and local environment files are excluded from Git/public assets.

## Fresh verification

- TypeScript: passed.
- Unit tests: 12 passed.
- Isolated MongoDB integration tests: 3 passed.
- Playwright desktop/mobile browser tests: 50 passed.
- Next.js production build: passed.
- Production dependency audit: 0 vulnerabilities.
- Original workbook SHA-256 remains `4515e7ae61dcd4f95c9fcb63c31be0e95778da8ac3bd9d4ad1873421f5e811ee`.
- Independent review: no Critical findings; actionable Important security/Vercel findings were corrected before release.
- Live Vercel smoke test: public routes and staff sign-in/dashboard passed on desktop and mobile with no browser console errors or warnings.
- Live Atlas workflows: authorized keepalive returned 200; unauthorized keepalive and excluded source/reference files returned 404; the imported 214-row June 2025 MSR report and 13 rack records loaded successfully.

## Trial limitations / management decisions still required

1. The role matrix is the specification’s provisional starting matrix and needs written management approval before real production use.
2. Customer retention/privacy, audit retention, invoice/tax/numbering/reversal policy, and complaint lifecycle require approval.
3. Weekly MSR count meanings remain unknown. Values are stored independently and never totaled or relabeled.
4. Formal MSR approval, locking, reopening, and amendment-version policy is not active until management defines it.
5. The public enquiry form prepares a local/email draft; it does not deliver or store enquiries server-side.
6. Vercel trial uploads are limited to 3.5 MB because of serverless request limits. The supplied workbook is well below this limit.
7. Atlas credentials shared during development must be rotated and replaced with a least-privilege application user before accepting real operational data.
8. The existing `luckycablenetwork.com` site and DNS are not changed. Future replacement steps are in `SITE_REPLACEMENT.md`.
9. The trial administrator password previously shared during setup must be changed before the trial URL is shared outside the current team.
10. The Vercel project dashboard currently reports Node.js 26.x even though `package.json` pins supported deployments to Node.js 22.x. The production build and runtime checks pass, but the dashboard setting should be changed to 22.x when that option is available in Project Settings.

## Deployment status

- GitHub: pushed successfully to `navypatel/luckycablenetwork` branch `main`, commit `55dad8e`.
- Vercel project: `navy-s-projects/luckycablenetwork`.
- Trial URL: `https://luckycablenetwork.vercel.app`.
- Production deployment status: Ready. All five required production environment variables are present and the canonical site URL matches the trial URL.
- The existing `luckycablenetwork.com` site and DNS remain unchanged.
