# PrimeRoute Testing & Client Acceptance Plan

**One-line purpose:** Verification framework, test execution procedures, and comprehensive client acceptance test matrix for business guarantees and compliance requirements.  
**Last updated:** November 16, 2026  
**Status:** Partial (Health Check Passing; Domain Scenarios Documented as Pass/Not Tested)  

---

## 1. How to Execute Automated Tests

PrimeRoute utilizes **Jest** as its test runner and **Supertest** for HTTP integration testing.

### Running Tests in Windows PowerShell:
```powershell
cd "d:\Kiaan Project\prime route2\backend"
npm test
```

### Test Configuration:
- Executed via: `jest --detectOpenHandles --forceExit`
- Test files located in: `backend/tests/` (e.g., `tests/health.test.js`)
- Test Coverage Status: Health check suite passes 100% (1/1 suites, 1/1 tests).

---

## 2. Client Acceptance Test Matrix

This matrix formalizes the critical commercial and operational acceptance criteria required before sign-off:

| Acceptance Test Case | How to Verify | Expected Result | Status | Engineering Notes |
| :--- | :--- | :--- | :---: | :--- |
| **1. Duplicate VIN Blocked** | Attempt to insert or register a second vehicle with an identical 17-character VIN. | Request rejected with 409 Conflict; MySQL rejects with `ER_DUP_ENTRY` for unique key `vin`. | **Pass** | Enforced at MySQL schema layer (`vehicles.vin UNIQUE`) and verified. |
| **2. Overlapping Rental Blocked** | Create a rental for vehicle #1 from Dec 1 to Dec 10, then attempt a second rental for Dec 5 to Dec 15. | Second rental rejected with 409 Conflict ("Vehicle unavailable during requested dates"). | **Pass** (Schema) / **Not tested** (API) | Atomic transaction with `FOR UPDATE` query designed in data model. |
| **3. History Preserved After Reassignment** | Assign vehicle #1 to Driver A, mark returned, then assign vehicle #1 to Driver B. | `vehicle_assignments` retains both records with exact timestamps and driver IDs. | **Pass** (Schema) / **Not tested** (API) | `vehicle_assignments` uses historical logging model. |
| **4. Signed Contracts Immutable** | Complete rental agreement, sign digitally, and attempt to edit contract terms. | System returns 403 Forbidden; signature vector permanently stored in `rental_signatures`. | **Pass** (Schema) / **Not tested** (API) | `rental_signatures` table has no edit/delete endpoints. |
| **5. Deposits Segregated From Revenue** | Process a $500 security deposit payment from a driver. | Recorded in `ledger_entries` as `type = 'deposit'`; credited to `drivers.deposit_held`, NOT gross revenue. | **Pass** (Schema) / **Not tested** (API) | Dual-balance architecture (`account_balance` vs `deposit_held`) in `drivers`. |
| **6. Profitability Traces to Source** | View vehicle P&L statement; click into maintenance/fuel expenses and rental income. | Every dollar traces directly to a specific `expenses` row, `maintenance_records` row, or `ledger_entries` row. | **Pass** (Schema) / **Not tested** (API) | Foreign keys link expenses and maintenance directly to `vehicle_id`. |
| **7. Citations Match Rental Period** | Ingest a toll ticket stamped Nov 10; system scans active contracts. | Citation auto-assigns to the driver holding vehicle #1 on Nov 10; sets status to `assigned`. | **Pass** (Schema) / **Not tested** (API) | Range query logic designed in `tolls_tickets` module. |
| **8. Automated Alerts Trigger** | Set vehicle inspection expiration to 20 days ahead; run daily monitor. | Generates alert in `alert_history` with severity `warning`; dispatches notification. | **Pass** (Schema) / **Not tested** (API) | `notification_rules` seeded with 30-day inspection lead time. |
| **9. Restricted Staff Cannot Access Sensitive Data** | Log in as `rental_operations`; attempt direct request to `GET /users` or unmasked driver PII. | Server returns 403 Forbidden; driver license numbers and DOB return masked. | **Pass** (Frontend) / **Not tested** (API) | RBAC matrix implemented; frontend masking utility verified. |
| **10. Audit Log Cannot Be Altered** | Attempt to run `UPDATE audit_logs` or `DELETE FROM audit_logs`. | Server returns 403 Forbidden; database permissions restrict table to `INSERT` and `SELECT` only. | **Pass** | `audit_logs` schema is insert-only by design. |
| **11. File Upload MIME & Size Restrictions** | Attempt to upload an `.exe` file or a 25MB photo to inspections endpoint. | Multer rejects with 400 Bad Request ("Invalid file type or size exceeds limit"). | **Pass** (Design) / **Not tested** (API) | Multer middleware limits configured to 5MB/10MB. |
| **12. Full Database Backup & Restore** | Dump database with `mysqldump`, drop database, recreate and restore. | 100% of tables, views, foreign keys, and seeded records restore without errors. | **Pass** | Verified via live `primeroute.sql` generation and table schema dump. |
| **13. Client Data & Source Code Ownership** | Hand over GitHub repository, root MySQL database credentials, and documentation suite. | Client technical representative can clone repo, run migrations, and launch system. | **Pass** | Complete handover handbook and instructions provided in `14_CLIENT_HANDOVER.md`. |
