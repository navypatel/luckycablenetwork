# MSR workbook profile

Inspected read-only on 2026-11-04 with Python standard-library ZIP/XML inspection. No application endpoint exposes the source; no customer values are included here.

- Source: `124190_SMS_EXL_JUN_2025.xlsx` (20,177 bytes), retained in its original location.
- SHA-256: `4515e7ae61dcd4f95c9fcb63c31be0e95778da8ac3bd9d4ad1873421f5e811ee`
- Format: OOXML `.xlsx`, one worksheet: `SubscriberReport`.
- Used range: `A1:J215`. 215 XML rows including the header; this is **not** a subscriber count.
- Exact A–J headers: Customer Nbr; Contract Nbr; State; Bouquet/Alacarte/Add on; Bouquet/Alacarte Channel Name; Count on 7th day; Count on 14th day; Count on 21st day; Count on 28th day; Month Year.
- Four formula cells exist: F93, G93, H93, I93. They were not evaluated, rewritten, or interpreted. Preserve formula representation and cached values separately during future parsing.
- `xl/calcChain.xml` exists. This is a compatibility consideration for ExcelJS round-trip testing.
- `sheetProtection sheet="1"` is enabled. No attempt was made to remove protection.
- No merged-cell ranges; no frozen-pane or auto-filter element was observed.
- View state includes a non-A1 scroll position and active selection. Preserve it if required by the template fidelity contract.
- Default row height 12.75; 93 rows have explicitly specified height 15.
- A–J widths: 12.5703125, 11.7109375, 12, 22, 35.7109375, 15.140625, 16.140625, 15.85546875, 16.140625, 10.7109375. Styles also extend through XFD; do not treat formatted columns as imported fields.
- Styles: 4 fonts, 4 fills, 2 borders, 10 cell formats; no custom number-format collection observed.
- Page margins: left/right 0.7, top/bottom 0.75, header/footer 0.3.
- No drawing, media, macro, external-link or pivot-table ZIP parts observed.
- XML cell type totals: 1,560 shared-string cells, 590 cells with default numeric type. Counts do not establish whether cells are semantically blank or zero.

## Still required before MSR completion

Inventory empty shared strings versus missing values, identifier storage/display formats, period representation, duplicate candidates, and formula cached-value handling using a private parser. Create a sanitized structural fixture, then test ExcelJS round-trip fidelity including protection, row/column styles, cached formulas and calculation-chain handling. Do not promise formatting preservation until tested. Confirm weekly-count semantics and approval/versioning rules. No upload, import, export, or PDF workflow is implemented in the current shell.