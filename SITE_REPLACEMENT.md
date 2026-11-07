# Future replacement of luckycablenetwork.com

This file is intentionally separate from the current Vercel trial deployment. Do not change the existing website or DNS until Lucky Cable explicitly approves a production cutover.

## Before replacement

1. Accept the Vercel trial after testing the public website and every authorized admin role.
2. Rotate the MongoDB password that was shared during development and use a least-privilege Atlas application user.
3. Approve customer retention/privacy, invoice/tax, complaint lifecycle, staff permissions, and MSR approval/amendment policies.
4. Enable Atlas backups and complete a restore drill.
5. Export the current domain’s DNS records and record its present hosting target so rollback is possible.
6. Keep the existing production site online throughout preparation.

## Controlled cutover

1. Add `luckycablenetwork.com` and `www.luckycablenetwork.com` to the accepted Vercel project.
2. Vercel will display the exact DNS records required for that project. Apply those exact values at the domain’s DNS provider; do not guess or copy generic values.
3. Set Production `NEXT_PUBLIC_SITE_URL=https://luckycablenetwork.com` in Vercel and redeploy.
4. Choose one canonical host (apex or `www`) and configure the other to redirect to it.
5. Verify HTTPS, all public routes, assets, mobile layouts, staff sign-in, secure cookies, origin validation, MongoDB access, MSR downloads, and cron execution.
6. Monitor Vercel logs and Atlas usage immediately after cutover.

## Rollback

If a critical check fails, restore the captured DNS records or previous hosting target. Keep the Vercel deployment available under its preview URL for diagnosis. Do not delete the old hosting environment until the new site has operated successfully for an agreed observation period.
