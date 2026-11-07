# Lucky Cable Daman — Shell Design and Scope

**Status:** Historical proposal; user approved shell execution. See `PRODUCT.md`, `DESIGN.md`, and `docs/PROJECT_STATUS.md` for current implementation. Requirements, workbook, and official logo subsequently supplied.  
**Scope:** A useful, responsive public-site and management-portal shell; not a claim that the specification-dependent business platform is complete.

## Intent

Establish a credible, accessible digital front door and a distinct operational workspace for Lucky Cable Daman. The marketing surface should feel considered and memorable; the management surface should favor clarity and efficient navigation. Because the functional requirements and original subscriber workbook were not available in the repository or nearby accessible workspace, neither surface may assert unverified business facts or simulate operational records.

## Scope boundary

### In scope for this first implementation

- A responsive public website with Home, About, Services, Cable TV, Broadband, Packages, and Contact routes.
- One cohesive Lucky Cable identity with two deliberately different surface systems.
- Editorial public-page composition, original CSS/SVG connectivity art, restrained motion, and an accessible, keyboard-operable services carousel.
- A contact/enquiry form with honest client-side validation and an explicit demo/no-delivery notice; do not imply that messages are received or stored by the company.
- An admin workspace shell with persistent navigation to the requested business modules, informative blank states, and clear sign-in/setup boundaries.
- Project documentation recording missing inputs, implementation decisions, remaining work, and test commands.
- Automated unit/browser coverage and real-browser review for what is implemented.

### Explicitly deferred until authoritative inputs and a real backend exist

- Actual requirements-dependent workflows; subscriber/customer records; service availability or coverage assertions; phone numbers, addresses, company history, channel lists, package names/prices, and benefit claims.
- Authentication, server-side authorization, user management, persistence, billing, payments, support case processing, audit history, approval/sign-off, and reporting.
- MSR parsing/import/export/PDF generation, workbook mutation, or any count interpretation. These require the original workbook, the written requirements, and confirmation of the four weekly counts' meaning. Never overwrite the original.
- Production form delivery or any third-party analytics, email, or database integration.

The UI must label unimplemented, non-persisted, or configuration-required functions plainly. It must not expose a frontend-only authentication or authorization flow as secure.

## Experience and design direction

### Shared identity

Create an original identity from a wordmark plus a simple authored connection/constellation mark. Use a dark navy foundation with bright aqua for connection/highlight and warm paper surfaces for breathing room; use warm coral sparingly for secondary actions. Define these as CSS custom properties so verified company branding can supersede proposed colors later. System typography is used initially; do not download, bundle, or claim brand fonts that have not been supplied. Avoid borrowing either reference's copy, assets, logos, or source.

### Public website — “Signal in motion”

An editorial, immersive-feeling experience informed at a high level by the spatial storytelling and layered movement of Grida and Lusion, expressed in original composition and CSS/SVG rather than heavyweight 3D. Give the hero a strong typographic proposition about connection without invented speed, scale, or service claims. Use a custom abstract signal-to-home illustration, layered depth, one carefully coordinated entrance/reveal treatment, and a services rail with mouse/touch/keyboard and arrow/button controls. Follow with clearly labeled editorial service explanations, a packages page that asks visitors to contact the provider for verified current options rather than inventing offers, and a contact route with no fake company details. Use anchors/links for navigation, semantic headings, visible focus, and reduced-motion variants.

### Management portal — “Operations, in order”

A restrained, high-contrast enterprise workspace, distinct from the immersive public surface: compact persistent sidebar, strong content hierarchy, neutral canvas, deliberate tables/forms vocabulary when real workflows exist, and clear status language. The first dashboard should be an honest setup/readiness view, not fake KPI cards or fabricated charts. Each module may have a useful explanatory empty state and point to the relevant blocked prerequisite; no placeholder buttons that claim to mutate data. The sidebar may collapse responsively but remains operable from keyboard and touch.

## Content rules

- No invented company history, support hours, location, contact coordinates, prices, package benefits, channel names, subscriber counts, or service guarantees.
- Editorial copy may describe what the app contains or invite a user to supply verified information, but must not be presented as approved Lucky Cable company facts.
- Mark proposed branding/design values as replaceable implementation choices in `DESIGN.md`.
- Use empty states—not fabricated sample records—in the management portal.

## Interaction and accessibility

- Honor `prefers-reduced-motion`; animate primarily compositor-friendly transforms/opacity and avoid auto-playing long decorative motion without a pause control.
- All controls use native buttons, links, and labels; meaningful icons receive names, decorative art is hidden from assistive technology.
- Form errors appear inline and in an announced status; avoid claiming successful delivery when the system is not connected.
- Provide skip navigation, hierarchical headings, focus-visible styles, sufficient contrast, fluid layouts, and desktop/mobile browser verification.

## Architecture proposal

Start with the smallest maintainable, type-safe frontend foundation that works in this empty repository. Prefer Next.js App Router and TypeScript if package installation and local browser verification are healthy. Separate public routes, admin layout, reusable navigation/controls, visual tokens, and test fixtures. Avoid adding MongoDB, Mongoose, Excel/PDF tooling, chart libraries, authentication libraries, animation libraries, or other backend dependencies before requirements and deployment environment justify them. Use native CSS for the shell's initial motion and visualizations. Keep the verified MSR engine and operations domain out of the shell until the real workbook and requirements are supplied.

## Acceptance criteria for this shell

1. The root route renders a distinctive public home surface; every listed public route is reachable by normal links and refresh works.
2. Public/admin surfaces visibly follow separate documented design systems while sharing brand tokens/mark.
3. The carousel can be navigated with keyboard, buttons, and pointer/touch; reduced-motion preference removes nonessential motion.
4. No fabricated business figures, package data, contact information, or customer records appear.
5. Admin module navigation works and clearly distinguishes empty shell/readiness information from real, secure functionality; no fake authentication is presented.
6. The contact form validates input and explicitly communicates that production delivery is not configured.
7. Responsive public/admin layouts pass real browser review at desktop and mobile viewports; automated checks pass.
8. Documentation states exactly which requirements are deferred and how to resume when source inputs arrive.

## External references and compatibility findings

- Grida and Lusion were reviewed only for broad interaction/composition principles; Symphony preview returned HTTP 404. No third-party branding or assets are to be copied.
- The Vercel Web Interface Guidelines skill is available in the Cline session and was read; apply its guidance on semantic navigation, focus, forms, reduced motion, overflow, and dynamic state.
- Impeccable instructions are available in-session and were read. Its CLI installer explicitly lists many harnesses but not Cline; do not run installer hooks as though a supported Cline integration existed. Follow the craft floor and public/admin distinction manually.
- Taste Skill and Awesome DESIGN.md were inspected; use principles for deliberate visual decisions, not extracted brand identity files.
- Superpowers brainstorming, writing-plans, and TDD instructions were invoked; use explicit staged approval, an implementation checklist, tests-first for behavior, and evidence-based verification.
- Task Observer and Claude Mem are not installed: their workflows rely on agent activation/hooks/background memory services not verified for Cline. Maintain project continuity here with this design document, `IMPLEMENTATION_LOG.md`, and the plan.
- Playwright CLI is already available as a command (`playwright-cli --version` returned `0.1.23`). Prefer it for actual-browser inspection; add automated browser test dependencies locally only after checking registry/network feasibility.
- No supplied skill archive, `LUCKY_CABLE_REQUIREMENTS.md`, or Lucky Cable/MSR workbook has been found in the empty project or the attempted nearby search. A wider recursive Documents search timed out; it did not establish that no copies exist anywhere on the machine.

## Future decision gates

Before implementing business workflows, obtain and review the functional requirements, the original MSR workbook, and verified business content/contact/brand assets. Confirm the meaning of the four weekly counts, backend/data-retention expectations, operational roles and permissions, deployment target, and approved contact-message handling. Preserve source workbook immutably. Validate MSR import using staged preview, text-preserved identifiers, separate blank/zero values, explicit duplicate review, format-preserving export, approval/versioning, and audit evidence.