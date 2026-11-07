# Vercel trial deployment

This release is for a Vercel-hosted trial only. It does not replace or modify `luckycablenetwork.com`. Future replacement steps are isolated in [`SITE_REPLACEMENT.md`](SITE_REPLACEMENT.md).

## 1. Infrastructure and secrets

Before accepting real operational data:

1. Rotate the MongoDB password shared during development.
2. Create a least-privilege MongoDB Atlas application user restricted to the `lucky_cable` database.
3. Enable Atlas backups and test a restore.
4. Generate two different random secrets of at least 32 characters: `SESSION_SECRET` and `CRON_SECRET`.
5. Never commit secrets, workbooks, customer exports, or local `.env` files.

## 2. Import from GitHub

Repository: `https://github.com/navypatel/luckycablenetwork.git`

1. Open Vercel and choose **Add New → Project**.
2. Import `navypatel/luckycablenetwork` from GitHub.
3. Framework preset: **Next.js**.
4. Install command: `npm ci`.
5. Build command: `npm run build`.
6. Output directory: leave at the Next.js default.

## 3. Environment variables

Add these encrypted variables to the Vercel project for Preview and Production environments:

- `MONGODB_URI` — the rotated Atlas application connection string
- `MONGODB_DB=lucky_cable`
- `SESSION_SECRET` — 32+ random characters
- `CRON_SECRET` — a different 32+ character random value
- `NEXT_PUBLIC_SITE_URL` — the actual Vercel deployment’s canonical origin

Do not add `BOOTSTRAP_ADMIN_EMAIL` or `BOOTSTRAP_ADMIN_PASSWORD` to Vercel. Administrator bootstrap is a one-time trusted local command; clear those variables immediately afterward.

## 4. Atlas network access

Vercel functions use dynamic outbound addresses unless a paid fixed-egress feature is configured. For a trial, configure Atlas network access according to the selected Vercel networking plan. If temporary broad access is used, enforce a least-privilege database user, a strong rotated password, TLS, monitoring, and prompt tightening before production.

## 5. Deploy and verify

1. Deploy and use the generated `*.vercel.app` URL.
2. Set `NEXT_PUBLIC_SITE_URL` to that accepted canonical Vercel URL and redeploy so browser mutation-origin checks match.
3. Verify `/`, `/about`, `/services`, `/packages`, `/contact`, and `/admin` on desktop and mobile.
4. Test valid and invalid staff sign-in, role restrictions, logout, record creation, validation, search, pagination, racks, audit history, MSR stage/preview/import, Excel download, and PDF download.
5. Confirm `/api/cron/mongodb-keepalive` returns 404 without authorization. Vercel Cron supplies `Authorization: Bearer <CRON_SECRET>` automatically.
6. Confirm source workbooks, `.env.local`, source screenshots, reference video, logs, and test artifacts return 404.
7. Review Vercel function logs and Atlas logs for errors.

## 6. First administrator

If the target database is empty, run from a trusted local machine configured for that Atlas database:

```powershell
$env:BOOTSTRAP_ADMIN_EMAIL="owner@example.com"
$env:BOOTSTRAP_ADMIN_PASSWORD="use-a-unique-16-plus-character-password"
node --env-file=.env.local --import tsx scripts/bootstrap-admin.ts
Remove-Item Env:BOOTSTRAP_ADMIN_EMAIL
Remove-Item Env:BOOTSTRAP_ADMIN_PASSWORD
```

The script refuses to run when any staff account already exists. Additional accounts are created by a signed-in Super Admin.

## 7. Scheduled MongoDB health ping

`vercel.json` schedules `/api/cron/mongodb-keepalive` daily at 03:17 UTC. The route is secret-protected and performs an Atlas ping. Database access also retries transient network/server-selection failures and reconstructs stale connections.

This does not override Atlas suspension caused by billing, quota, revoked credentials, deleted infrastructure, or provider policy.

