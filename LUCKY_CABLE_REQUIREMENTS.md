# Lucky Cable Daman — Product Requirements & Claude Code Build Specification

**Document:** `LUCKY_CABLE_REQUIREMENTS.md`  
**Purpose:** Single source of truth for planning and implementing the Lucky Cable Daman web application with Claude Code.  
**Status:** Initial specification; business rules marked **TBD** must be confirmed before implementation.

---

## 1. Instructions to Claude Code

You are the senior product engineer and technical lead for this project. Build a secure, maintainable, modern web application for Lucky Cable Daman.

### Mandatory working rules

1. **Inspect before implementing.** First inspect the repository, package manager, existing code, environment files (never print secrets), and available skill archives. Do not replace an existing project blindly.
2. **Use skills selectively.** The user has shown these ZIP archive names:
   - `ECC-main`
   - `impeccable-main`
   - `claude-mem-main`
   - `superpowers-main`
   - `skills-main`
   - `one-skill-to-rule-them-all-main`

   Only the archive names are known from the screenshot. Their contents and exact skill names are not yet verified. When the user places the ZIPs in the project, inspect their file listings first. Read each archive's README/index and skill instructions selectively. Do not extract or load every skill into the model context without a reason. Prefer relevant skills for the current task, and record the selected skill and why it applies in a short project note.
3. **Do not invent business rules.** In particular, the meaning of the four weekly MSR count columns is unknown. Preserve values exactly and do not infer calculations, totals, subscriber counts, or regulatory meaning.
4. **Protect source data.** Never modify, rename, overwrite, or delete the original uploaded workbook. Work on copies. Preserve an untouched source file.
5. **Work in small verified increments.** Implement one coherent feature at a time. Run targeted tests after each change and report what passed and failed.
6. **Avoid destructive commands.** Do not run destructive shell commands, database resets, migrations that drop data, force pushes, or broad cleanup commands without explaining the impact and obtaining explicit approval.
7. **Do not expose secrets.** Never print `.env` values, API keys, passwords, session tokens, or private customer information in logs or summaries.
8. **Ask only blocking questions.** If a decision can safely be represented as a configurable setting or left explicitly TBD, do that instead of interrupting development. Ask the user before implementing ambiguous business logic or irreversible workflows.
9. **Keep the application usable throughout development.** Prefer working vertical slices over scaffolding every module without functional behavior.
10. **Do not claim completion without verification.** State which routes, workflows, tests, and exports were actually exercised.

---

## 2. Context-window and token-budget discipline

The user is concerned about exhausting a model context / token allowance (mentioned as 125,000). No prompt can guarantee that a provider's usage limits or rate limits will never be reached. The implementation process must nevertheless minimize unnecessary context consumption.

### Required context-efficient workflow

- Start by reading this file and a concise repository overview. Do not re-read this entire specification in every task.
- Use targeted file discovery (`find`, `ls`, `glob`, `grep`, `rg`) before opening files. Read only the relevant files or line ranges.
- Inspect ZIP contents with an archive listing first. Read only the README, skill index, and the selected skill's instructions. Do not dump entire archives into the conversation.
- Do not load all six skill packs at once. Identify the skill relevant to the immediate task and load only that skill plus any essential references.
- Avoid repeatedly pasting full source files, package lockfiles, generated files, build output, or large datasets into the model context.
- For large logs, filter to errors and relevant surrounding lines. Summarize findings rather than reproducing logs.
- Use scripts for repetitive inspection, data profiling, and validation. Return concise summaries, counts, and representative examples rather than every row.
- Keep implementation tasks bounded (for example: “implement MSR upload endpoint and tests”), not broad (“build the whole app”).
- After each milestone, update the project notes below and provide a short summary: changed files, behavior added, tests run, outstanding issues.
- Before context compaction or switching tasks, write/update:
  - `docs/PROJECT_STATUS.md` — current state, working commands, completed milestones, next tasks.
  - `docs/DECISIONS.md` — confirmed architectural and business decisions only.
  - `docs/OPEN_QUESTIONS.md` — unresolved business questions and assumptions explicitly avoided.
- Keep these notes concise. Do not duplicate this full requirements file into multiple files.
- If a subagent/task delegation feature is available, delegate only bounded independent tasks and request concise results. Do not ask multiple agents to inspect the same large repository or skill archives.
- Do not use a large model context for routine formatting or repetitive edits when a smaller/cheaper model or deterministic tool can do the job. Follow the user's configured model and provider limits.
- Stop and summarize when the current context is becoming crowded; continue in a fresh session using the status and decision notes rather than repeatedly loading history.

### Suggested task sequence

1. Repository and skills inventory.
2. Existing workbook inspection and MSR specification confirmation.
3. App shell, design system, authentication and roles.
4. Public website.
5. MSR import/validation/export vertical slice.
6. Channel/rack and subscriber operations.
7. Broadband and cable service operations.
8. Billing and payments.
9. Complaints/support and other services.
10. Hardening, accessibility, tests, deployment and handover.

---

## 3. Product vision and goals

Build a single web platform with two connected experiences:

### A. Public website

Present Lucky Cable Daman professionally and make it easy for prospective and existing customers to understand its services and contact the company.

### B. Private management portal

Centralize operational data and workflows, with the first major business workflow being the existing Excel-based monthly subscriber report (MSR).

### Primary goals

- Establish a polished, responsive digital presence.
- Preserve the existing MSR Excel workflow and output format.
- Reduce repetitive manual report preparation where safely possible.
- Keep historical reports traceable and reproducible.
- Centralize customers, services, channels/racks, billing and support over time.
- Enforce role-based access and maintain an audit trail.

### Non-goals for the first release

- Do not assume integration with government/regulatory systems.
- Do not assume a payment gateway or telecom provisioning integration.
- Do not assume the meaning of MSR weekly counts.
- Do not invent service coverage, plan prices, customer counts, channel allocations, company contact details, or legal claims.
- Do not build microservices unless a demonstrated requirement justifies them.

---

## 4. Confirmed requirements

| Area | Confirmed information |
|---|---|
| Organization | Lucky Cable Daman |
| Public experience | Website showcasing company services |
| Admin experience | Management portal for operations and reporting |
| MSR source process | Data is prepared in Excel |
| MSR output | Preserve the existing Excel format |
| Additional report format | PDF is also wanted |
| MSR frequency | Monthly |
| MSR weekly count meaning | Unknown; do not infer |
| Operations in scope | Cable TV, broadband, channel/rack management, customer management, billing/payments, complaints/support and other services |
| Access model | Management access is required; staff roles should be supported |
| Preferred stack | Next.js, TypeScript, Tailwind CSS, shadcn/ui, Node.js, MongoDB/Mongoose |
| Architecture preference | Modular monolith |

The user supplied a screenshot of a workbook named `124190_SMS_EXL_JUN_2025`, showing a worksheet tab named `SubscriberReport`, and uploaded the workbook `124190_SMS_EXL_JUN_2025.xlsx`. Inspect the actual workbook before finalizing implementation details. If it is unavailable in the current environment, ask the user to place it in the project or provide it again. Do not pretend to have inspected it.

---

## 5. MSR: known workbook structure from screenshot

The visible `SubscriberReport` worksheet has these columns:

| Excel column | Header |
|---|---|
| A | Customer Nbr |
| B | Contract Nbr |
| C | State |
| D | Bouquet/Alacarte/Add on |
| E | Bouquet/Alacarte Channel Name |
| F | Count on 7th day |
| G | Count on 14th day |
| H | Count on 21st day |
| I | Count on 28th day |
| J | Month Year |

The screenshot shows example rows for customer number `124190`, state `Daman & Diu`, subscription type `ALACARTE`, and channel names such as Asianet, Asianet HD, CNBC Awaaz, CNBC Bajaar and Colors. These are sample observations only, not a complete channel catalogue or confirmed business rules.

### MSR rules that must be followed

- Preserve the exact source headings and column order.
- Preserve the worksheet name `SubscriberReport` if confirmed by the actual workbook.
- Preserve customer and contract identifiers as text; do not strip leading zeroes.
- Preserve the month/year text representation as it exists in the source.
- Preserve numeric weekly values exactly.
- Preserve blank weekly cells as blank/null; never silently convert blanks to zero.
- Preserve explicit zero values as zero.
- Do not calculate averages, totals, differences, subscriber counts or trends until their meaning and calculation rules are confirmed.
- Do not deduplicate records automatically. Detect possible duplicates and show them for review.
- Do not silently discard rows or columns.
- Do not assume the workbook has only one worksheet.
- Do not assume that the screenshot contains every column, formula, hidden sheet, print setting or workbook feature.
- Preserve the original uploaded workbook unchanged.

### Required workbook inspection

Before implementing the MSR importer/exporter, inspect and document:

1. All worksheet names, visibility states and dimensions.
2. Exact header values, row numbers and column positions.
3. Blank rows, populated ranges and representative record patterns.
4. Cell types, formulas, number formats and date formats.
5. Merged cells, row heights, column widths, freeze panes, filters and tables.
6. Conditional formatting, data validation and named ranges.
7. Print area, orientation, paper size, margins, scaling, repeating rows/columns, headers and footers.
8. Hidden rows/columns and hidden worksheets.
9. Images, charts, external links, macros or embedded objects, if any.
10. Whether the workbook is `.xlsx` or legacy `.xls` and whether special compatibility handling is needed.

Create a concise workbook profile in `docs/MSR_WORKBOOK_PROFILE.md`, including the inspection date, source filename, worksheet names, exact headers and any unsupported features. Avoid copying customer-level personal data into documentation.

---

## 6. Public website requirements

### Pages

- `/` — Home
- `/about` — About Lucky Cable
- `/services` — Services overview
- `/services/cable-tv` — Cable TV service
- `/services/broadband` — Broadband service
- `/packages` — Plans/packages
- `/contact` — Contact details and enquiries
- Optional `/privacy` and `/terms` pages when company-approved content is supplied.

### Home page sections

- Header with company branding and navigation.
- Hero section with a clear company value proposition.
- Service cards for Cable TV, Broadband and other confirmed services.
- Plans/packages section, only using management-approved content.
- Why choose Lucky Cable section, using verified claims only.
- Contact/enquiry call to action.
- Footer with verified address, contact details and links.

### Public website behavior

- Responsive on mobile, tablet and desktop.
- Accessible navigation and forms.
- SEO metadata and social sharing metadata.
- Enquiry form with server-side validation, spam protection/rate limiting and safe handling.
- Click-to-call and WhatsApp links only after verified phone numbers are supplied.
- Public service/package content should be manageable through the admin portal.
- Do not expose admin or customer data publicly.
- Do not invent testimonials, customer counts, coverage maps, awards, prices or service guarantees.

---

## 7. Admin portal requirements

### Main navigation

- Dashboard
- MSR Management
- Cable TV
- Broadband
- Channel Management
- Rack Management
- Customers
- Billing & Payments
- Complaints & Support
- Other Services
- Analytics & Reports
- Users & Roles
- Company/Website Settings
- Audit Logs

### Dashboard

Show only metrics that can be calculated from verified records. Use clear empty states when no data exists. Do not show invented demo KPIs as real company data.

Possible cards after data is available:
- Reports by status and reporting month.
- Recent imports and validation issues.
- Customer/subscription counts.
- Outstanding invoices and collections.
- Open/resolved complaints.
- Recent administrative activity.

### General UX

- Consistent sidebar, page headers, breadcrumbs and page actions.
- Search, filtering, sorting and pagination for data tables.
- Loading, empty, error and success states.
- Confirmation for destructive or irreversible actions.
- Accessible forms with inline validation.
- Responsive data tables with a usable mobile presentation.
- Date, currency and number formatting should be configurable to the company's needs.

---

## 8. MSR module requirements

### Main workflows

1. Create/select a reporting month and year.
2. Upload the original Excel workbook.
3. Inspect workbook and choose the relevant worksheet if multiple exist.
4. Map columns only if the workbook structure differs from the approved template.
5. Parse into a staging area; do not immediately write imported records into the approved report.
6. Show import summary and row/cell-level validation issues.
7. Let an authorized user review and confirm the import.
8. Save report metadata, structured entries, source file and import audit details.
9. Generate an Excel output using the approved original workbook/template.
10. Generate a PDF rendition.
11. Review, approve and lock the report.
12. Browse and download historical reports.
13. Reopen or amend only through a permission-controlled, audited versioning workflow.

### Import safety

- Validate extension, MIME type, file size and workbook structure.
- Do not trust the file extension alone.
- Protect against malformed or oversized workbooks.
- Do not execute formulas or macros from uploaded files.
- Treat all imported cell content as untrusted input.
- Do not render arbitrary HTML from cell values.
- Do not silently normalize values that could change identifiers or reporting meaning.
- Provide row number, column name and reason for every validation error.
- Support dry-run/preview before commit.
- Use idempotency or import identifiers to avoid accidental duplicate imports.
- If a report for the same period already exists, show a clear conflict and offer a controlled new version or replacement workflow. Never overwrite silently.

### Excel export fidelity

The target is to preserve the existing Excel format, not redesign it.

- Prefer an approved workbook template and modify only the intended data range.
- Preserve sheet names, headers, order, widths, heights, styles, borders, fills, fonts, number formats, merged cells, freeze panes, filters and print settings where the library supports them.
- Keep source workbook untouched.
- Compare generated output with the original template during tests.
- ExcelJS is a candidate for `.xlsx` manipulation. Verify actual workbook compatibility first; do not promise perfect preservation of every Excel feature.
- If advanced workbook features are lost by a library, investigate a safer approach before proceeding.
- Support legacy `.xls` only if the real workbook or business process requires it; do not add unnecessary dependencies.
- Do not convert identifiers to numbers.
- Preserve blanks and zeroes distinctly.

### PDF export

- PDF should represent the same report data and ordering.
- Include company identity only after approved logo/name details are supplied.
- Ensure long channel names and wide tables are readable.
- Use appropriate landscape page layout where necessary.
- Repeat table headers across pages.
- Include reporting month and page numbers.
- Do not add calculated metrics that are not present in the source or approved rules.
- PDF export is a rendition; the original-format Excel remains the canonical editable output.

### MSR data model (provisional)

Use separate report metadata and report-entry records to support large reports and versioning. Finalize field names after workbook inspection.

```ts
type WeeklyCounts = {
  day7: number | null;
  day14: number | null;
  day21: number | null;
  day28: number | null;
};

type SubscriberReportEntry = {
  reportId: ObjectId;
  sourceRowNumber: number;
  customerNumber: string;
  contractNumber: string | null;
  state: string | null;
  subscriptionType: string | null;
  channelName: string | null;
  weeklyCounts: WeeklyCounts;
  rawValues?: Record<string, unknown>;
};

type MonthlyReportStatus =
  | "draft"
  | "imported"
  | "validation_failed"
  | "validated"
  | "pending_approval"
  | "approved"
  | "amended";
```

The final schema must reflect the actual workbook. Do not force optional or absent fields into the workbook.

Suggested report metadata:
- reporting period
- source filename and checksum
- worksheet selected
- template/version identifier
- imported by and imported timestamp
- validation summary
- report status
- approved by and approval timestamp
- report version
- generated file references
- audit history reference

### Weekly count semantics: explicitly unresolved

The meaning of `Count on 7th day`, `Count on 14th day`, `Count on 21st day`, and `Count on 28th day` is not yet known.

Until management confirms:
- Store the values as independent observations.
- Do not call them active subscribers or channel availability.
- Do not sum them or calculate changes.
- Do not assume monotonicity or expected ranges.
- Do not reject a value merely because it differs from a prior week.
- Make the labels configurable only if needed, but retain original labels in exports.

---

## 9. Other operational modules

Implement these in stages after the MSR workflow is verified.

### Customer management

- Customer profile and unique customer identifier.
- Contract identifiers and contact details, subject to approved data fields.
- Service/subscription history.
- Search, filters and pagination.
- Customer status only after lifecycle rules are defined.
- Access controls for personal information.

A customer may have multiple subscriptions. Do not assume one customer equals one service.

### Cable TV

- Cable TV service catalogue.
- Packages and subscription records.
- Link customer subscriptions to approved packages.
- Effective dates and historical changes.
- Do not invent package names, prices or channel entitlements.

### Broadband

- Broadband plan catalogue.
- Customer connections/subscriptions.
- Plan and status history.
- Connection identifiers only as confirmed by the business.
- Do not assume router, IPAM, AAA, billing or network-provisioning integrations exist.

### Channel and rack management

- Channel directory.
- Channel name and approved metadata.
- Rack records.
- Channel-to-rack assignment history.
- Search/filter by channel and rack.
- Preserve existing channel numbering/inventory if supplied.
- Do not infer rack assignments from incomplete screenshots.

### Billing and payments

- Customer invoices and line items.
- Payment records and references.
- Outstanding balance views.
- Reversals/adjustments instead of deleting posted payments.
- Currency and tax behavior must be confirmed.
- Do not integrate a payment gateway without explicit approval.
- Financial changes must be audited.

### Complaints and support

- Complaint/request record.
- Customer reference.
- Category, description, status, priority and assignment.
- Created, updated and resolved timestamps.
- Internal notes with appropriate permissions.
- Status workflow must be confirmed with staff.
- Avoid exposing private complaint details to the public website.

### Other services

Build this as a configurable service catalogue only after management defines which services exist and what data each requires. Avoid a generic, unstructured dumping ground.

---

## 10. Roles, permissions and audit

Use backend-enforced role-based access control (RBAC). Hiding a button in the frontend is not authorization.

Suggested starting roles, subject to management approval:

| Role | Intended access |
|---|---|
| Super Admin | System configuration and all modules |
| Management | Operational overview, reports, approvals |
| Accounts | Billing and payment operations |
| Operations | Cable, broadband, channels and racks |
| Support | Customer support and complaints |
| Report Viewer | Read-only reports |

Permissions should be granular:
- view
- create
- update
- import
- export
- approve
- amend
- archive
- manage users/settings

Audit events should record actor, action, target record, timestamp and relevant before/after values where appropriate. Avoid putting passwords, tokens or unnecessary personal information in logs.

Approved reports should be immutable snapshots. Amendments must create a traceable new version or adjustment; never silently mutate a previously approved report.

---

## 11. Proposed technical architecture

Use a **modular monolith**.

### Preferred stack

| Layer | Preferred choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Database | MongoDB |
| ODM | Mongoose |
| Validation | Zod |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table |
| Excel | ExcelJS for `.xlsx`, after compatibility testing |
| PDF | Puppeteer or a suitable PDF renderer |
| Authentication | Secure session-based authentication / Auth.js after evaluating project needs |
| File storage | S3-compatible private object storage |
| Testing | Vitest or Jest, React Testing Library, Playwright |
| Monitoring | Sentry or equivalent, if approved |
| Hosting | Vercel or an appropriate Node-compatible host; validate PDF runtime needs before choosing |

Use the existing package manager if the repository already has one. Do not change package managers without a reason.

### Suggested folder organization

Adapt to the existing repository rather than forcing this exact structure:

```text
src/
  app/
    (public)/
    (auth)/
    (admin)/
    api/
  components/
    ui/
    layout/
    forms/
    data-table/
  modules/
    auth/
    users/
    msr/
    customers/
    cable-tv/
    broadband/
    channels/
    racks/
    billing/
    complaints/
    services/
  lib/
    db/
    auth/
    storage/
    permissions/
    logging/
  models/
  validators/
  types/
  config/
tests/
docs/
```

### Architectural boundaries

- UI components should not contain database access.
- Route handlers/actions should validate input and enforce permissions.
- Business logic should live in module services/use-cases.
- Database models should be isolated from presentation types.
- File parsing and report generation should be separate services.
- Long-running imports/exports should be designed so they can move to background jobs if scale requires it.
- Keep module dependencies explicit and avoid circular imports.

---

## 12. API outline

Choose route naming consistently and use the repository's established conventions.

Potential API surface:

```text
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/me

GET    /api/msr
POST   /api/msr
GET    /api/msr/:id
POST   /api/msr/:id/import
POST   /api/msr/:id/validate
POST   /api/msr/:id/confirm-import
POST   /api/msr/:id/approve
POST   /api/msr/:id/amend
GET    /api/msr/:id/export/excel
GET    /api/msr/:id/export/pdf

GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PATCH  /api/customers/:id

GET    /api/channels
POST   /api/channels
GET    /api/racks
POST   /api/racks

GET    /api/services
POST   /api/services
GET    /api/packages
POST   /api/packages

GET    /api/invoices
POST   /api/invoices
GET    /api/payments
POST   /api/payments

GET    /api/complaints
POST   /api/complaints
PATCH  /api/complaints/:id

GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/audit-logs
```

These are design candidates, not a requirement to expose every endpoint immediately. Prefer server actions or route handlers consistently based on the project's architecture. Every operation must enforce authentication, authorization, validation and audit requirements.

---

## 13. Security, privacy and reliability

Minimum expectations:

- Secure password hashing (Argon2id or bcrypt with appropriate parameters).
- Secure, HTTP-only, same-site cookies for sessions.
- CSRF protections where applicable.
- Server-side authorization on every protected operation.
- Rate limiting on login, public enquiry forms and sensitive endpoints.
- Zod or equivalent validation at trust boundaries.
- Safe file upload validation and size limits.
- Private storage for customer reports and uploaded workbooks.
- Signed, short-lived download links where supported.
- No public bucket for confidential reports.
- Environment variables for secrets; never commit `.env`.
- Database least-privilege credentials.
- Backups and a tested restore procedure.
- Error handling that does not expose stack traces or secrets to users.
- Audit logging for approvals, imports, financial changes and permission changes.
- Retention and privacy policies to be confirmed by the company.

Do not claim compliance with any legal or regulatory standard unless it has been independently verified and approved.

---

## 14. Design direction: modern, professional and usable

The user wants a modern-looking web application. Aim for a polished, credible telecom/service-provider brand rather than a generic dashboard template.

### Visual direction

- Strong visual identity using a restrained navy/blue base with a clear accent color.
- Clean typography and generous spacing.
- Consistent design tokens for color, radius, spacing, shadows and typography.
- Professional public landing page with a clear hero, service cards and strong calls to action.
- Admin portal optimized for daily operational work, with a compact sidebar and readable data tables.
- Use charts only when the underlying data and metric definitions are valid.
- Use subtle transitions; avoid excessive animation, glassmorphism, gradients or decorative clutter.
- Ensure accessible contrast, focus states, keyboard navigation and reduced-motion support.
- Mobile responsive layouts; complex spreadsheets may use a horizontally scrollable table with clear mobile affordances.
- Use real company assets only when supplied. Until then, use neutral placeholders clearly marked as placeholders.

### Design implementation rules

- Inspect the installed `impeccable` skill pack and relevant design skills before major UI work, if available.
- Use shadcn/ui primitives as a foundation, not as an excuse for an uncustomized default look.
- Build reusable components and page patterns.
- Avoid inconsistent one-off colors, radii and spacing.
- Include empty, loading, error, success and permission-denied states.
- Test the interface at mobile, tablet and desktop breakpoints.
- Do not generate fake operational data that could be mistaken for actual company records.

---

## 15. Testing and acceptance criteria

### MSR acceptance criteria

- [ ] Actual workbook has been inspected and workbook profile documented.
- [ ] All worksheet names and relevant workbook features are recorded.
- [ ] Import supports the actual source workbook.
- [ ] Customer and contract identifiers remain text and retain leading zeroes.
- [ ] Blank counts remain blank; zero remains zero.
- [ ] Weekly count values are not transformed or interpreted.
- [ ] Possible duplicates are flagged, not silently removed.
- [ ] Invalid rows/cells have precise validation messages.
- [ ] User can preview import before committing.
- [ ] Re-importing the same file cannot silently duplicate or overwrite data.
- [ ] Original workbook remains unchanged.
- [ ] Excel export preserves approved layout and formatting to the extent verified.
- [ ] PDF output is readable and paginated.
- [ ] Approved reports are immutable; amendments are versioned and audited.
- [ ] Historical reports can be searched and downloaded by authorized users.

### General application acceptance criteria

- [ ] Public pages are responsive and accessible.
- [ ] Admin routes require authentication.
- [ ] Backend permissions are enforced for all protected operations.
- [ ] User and role management works.
- [ ] Customer, channel/rack and service records support search/filter/pagination.
- [ ] Financial actions are auditable and do not silently delete posted records.
- [ ] Complaint workflow is permission-controlled.
- [ ] No secrets are committed.
- [ ] Tests cover critical business logic and access control.
- [ ] Production build succeeds.
- [ ] Backup and restore process is documented.

### Required tests

- Unit tests for parsers, validators, permission checks and report transformations.
- Integration tests for database-backed module services.
- Fixture-based tests using a sanitized copy of the real workbook.
- Regression test comparing output workbook structure and key formatting with the approved template.
- Tests for blank versus zero weekly counts.
- Tests for leading-zero identifiers.
- Tests for duplicate imports and report version conflicts.
- End-to-end tests for login, role restrictions, MSR import, approval and exports.
- Security tests for unauthorized access and unsafe file uploads.

Never use real customer data in committed fixtures. Create a sanitized fixture that preserves structure and representative edge cases.

---

## 16. Delivery plan

Implement in small vertical slices. The following is a suggested sequence, not a fixed estimate.

### Milestone 0 — Discovery

- Inspect repository and existing app.
- Inventory the six named skill archives if they are supplied.
- Inspect the real MSR workbook.
- Write `docs/MSR_WORKBOOK_PROFILE.md`.
- Record unresolved business questions.
- Confirm deployment and company branding requirements.

**Exit condition:** workbook structure and initial architecture are documented; no invented MSR calculations.

### Milestone 1 — Foundation

- Next.js/TypeScript app setup or adapt existing project.
- Design tokens and shared UI.
- Database connection and health check.
- Authentication and RBAC foundation.
- Admin layout and public layout.
- CI checks and test setup.

### Milestone 2 — Public website

- Home, about, services, packages and contact pages.
- Responsive navigation and footer.
- Admin-managed public content.
- Enquiry form and server-side validation.

### Milestone 3 — MSR vertical slice

- Workbook parser and profile.
- Upload/staging workflow.
- Validation and preview.
- Database persistence.
- Template-based Excel output.
- PDF output.
- Versioning, approvals and audit history.

### Milestone 4 — Core operations

- Customers.
- Channel/rack management.
- Cable TV and broadband services.
- Packages and subscriptions.

### Milestone 5 — Finance and support

- Invoices and payments.
- Adjustments/reversals.
- Complaints and support.
- Other services after requirements are confirmed.

### Milestone 6 — Production readiness

- Full permission review.
- Accessibility and responsive testing.
- Performance and security review.
- Backup/restore validation.
- Production deployment and staff handover.

---

## 17. Open questions — do not guess

Track these in `docs/OPEN_QUESTIONS.md` and ask management when needed:

1. What exactly do the weekly count columns represent?
2. Is there one workbook per month, or multiple workbooks per month/customer/report type?
3. Does the workbook contain additional worksheets beyond `SubscriberReport`?
4. Is the MSR for internal management, external submission, or both?
5. Are there any mandatory formulas or calculations?
6. What is the official report approval process?
7. Which staff roles and exact permissions are required?
8. What are the confirmed company logo, colors, address, phone, WhatsApp and email?
9. What are the actual cable TV, broadband and other service plans?
10. What currency, tax and invoice rules apply?
11. What customer fields may be stored, and who may view them?
12. Are existing customer/channel/rack records available for migration?
13. What hosting/domain and backup arrangements does the company prefer?

Do not block safe foundation work on questions that can remain TBD. Do block implementation of a business rule when guessing could corrupt official or financial data.

---

## 18. First task for Claude Code

Start with discovery only. Do not begin building the entire app immediately.

1. Inspect the current repository and report its framework, package manager, scripts and current state.
2. Check whether the six skill ZIP archives are present. If present, list their contents and identify their indexes/READMEs. Do not bulk-load all skill files.
3. Locate the supplied `124190_SMS_EXL_JUN_2025.xlsx` workbook. If it is not in the project, ask the user to copy it into a clearly named `reference/` directory. Do not fabricate an inspection.
4. Inspect the workbook read-only and create `docs/MSR_WORKBOOK_PROFILE.md`.
5. Create concise `docs/PROJECT_STATUS.md`, `docs/DECISIONS.md` and `docs/OPEN_QUESTIONS.md`.
6. Recommend the smallest useful first implementation milestone.
7. Present findings and proposed changes before destructive or broad repository changes.

After discovery is approved, implement one vertical slice at a time, beginning with the application foundation and then the MSR import/validation/export workflow.

---

## 19. Claude Code starter prompt

Paste this into Claude Code after placing this requirements file, the workbook, and (when available) the skill ZIP archives in the project:

> Read `LUCKY_CABLE_REQUIREMENTS.md` first and follow it as the project specification. Begin with the discovery-only task in section 18. Inspect the existing repository, the available skill ZIP archives and the actual MSR workbook without modifying source files. Load only the skill instructions relevant to discovery and workbook inspection; do not dump entire archives or large files into context. Be token-efficient: use targeted searches, concise summaries, and maintain `docs/PROJECT_STATUS.md`, `docs/DECISIONS.md` and `docs/OPEN_QUESTIONS.md`. Do not implement or infer the meaning of the weekly MSR counts. Do not overwrite the source workbook. Report findings, risks, and the proposed first milestone before making broad changes.

