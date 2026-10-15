# Customer Outbound Shipping Requirements Lookup Tool (MVP, DEMO DATA)
All data is synthetic: **DEMO DATA — NOT VALIDATED FOR ACTUAL SHIPMENTS**. Not official Panasonic instructions.

## Run
`npm install` · `npm run dev` · `npm test` · `npm run build` (static output in `dist/`, hash routing, relative paths — host on any approved internal web server).

## Structure
`src/types.ts` data model (CustomerRequirement, ReferenceImage, statuses) · `src/config/lists.json` admin-editable sales orgs / DCs / BUs · `src/data` synthetic seed + generated local SVG demo images · `src/services/requirementsRepository.ts` repository interface (swap for API) · `exportService.ts` CSV · `src/utils` search, conflict detection, scope validation, date formatting.

## Key rules
Cross-DC search (DC filter = applicability only); conflicts (same bill-to/ship-to/part, differing method/routing/pallet) are shown side by side and flagged; unknown source dates show "Unknown — awaiting source validation"; source-maintained date and import date are separate; VDF/B2C rejected by `isInScope`; images flagged `isIllustrative` show "ILLUSTRATIVE EXAMPLE — NOT AN APPROVED CUSTOMER STANDARD".

## Replacing demo data with HWY905
1. Export HWY905 to CSV; map columns to `CustomerRequirement`, preserving source IDs and source maintenance date (null if unreliable).
2. Set `isDemo:false`, `sourceSystem:'HWY905'`, `customerType` per record; run `isValidRecord`/`isInScope` and report rejects.
3. Implement `RequirementsRepository` against an API/DB; dedupe on bill-to+ship-to+part+DC; schedule refreshes; mark stale records `Needs Review`.
4. Replace image generator with an image-storage adapter (approved images only, `isIllustrative:false`).

## Deployment / security
Host only in an approved internal environment behind SSO (integration point: wrap `App` with auth provider; mock user shown today). Planned roles: Viewer, DC Editor, Admin; all edits need audit logging. No secrets in code. Do not deploy real customer data publicly.

## Not built (MVP scope)
Tailwind/Lucide (plain CSS used), image upload/admin UI, maintenance history/audit log, real auth, SAP/Blue Yonder integration.

## Open business questions
Authoritative DC/sales-org lists; how to treat multi-DC records; conflict resolution owner; staleness threshold; image approval workflow; hosting target; HWY905 field mapping.
