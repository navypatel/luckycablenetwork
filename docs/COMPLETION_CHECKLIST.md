# Completion checklist

## Current shell-design gate

- [x] Repository and available tooling inspected; no existing project files found.
- [x] Missing functional requirements and original MSR workbook called out without inventing their contents.
- [x] Public/admin visual direction, assumptions, out-of-scope behavior and acceptance criteria documented in `docs/PROJECT_DESIGN.md`.
- [x] Staged implementation plan and explicit blocked subsystem documented.
- [x] User instructed continuation of the approved shell scope.

## Implementation milestones

- [x] Frontend foundation built; initial typecheck, browser tests and production build verified. Latest rerun tracked in PROJECT_STATUS.md.
- [x] Responsive public routes, carousel, and honest local enquiry draft form.
- [x] Responsive admin navigation/module shell with honest empty/setup states.
- [x] 30 browser tests pass; desktop/mobile/reduced-motion reviewed in a real browser. Standalone unit suite not yet added.
- [x] Actual implementation and remaining limitations documented.

## Deferred until source business materials are available

- [x] Read and reconcile the actual `LUCKY_CABLE_REQUIREMENTS.md`.
- [x] Initial read-only workbook structural inspection; deeper parser/fidelity checks still pending.
- [ ] Confirm meaning of weekly count fields; retain blank separately from numeric zero and preserve identifiers as text.
- [x] Obtain official company logo (`lc.jpg`); business content/contact details still pending.
- [ ] Management approval remains required for the provisional permission matrix, data retention/privacy, audit retention, invoice/tax rules, complaint lifecycle, MSR approval/amendment policy, and enquiry delivery.
- [x] Implement server-enforced provisional RBAC, opaque sessions, MongoDB persistence, audited operational records, connection retry and protected keepalive.
- [ ] MSR staging/preview/validation/duplicate review/explicit import, original-byte Excel download and PDF rendition are implemented. Formal approval/locking/amendment versioning remains blocked on management policy.