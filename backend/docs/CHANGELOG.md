# PrimeRoute System Changelog

**One-line purpose:** Chronological history of engineering phases, schema migrations, architectural milestones, bug fixes, and system enhancements.  
**Last updated:** November 16, 2026  
**Status:** Complete  

---

## [Phase 4] - Documentation & Git Sync Milestone (2026-11-16)

### Added
- **14 Comprehensive Technical Handbooks** in `backend/docs/`:
  - `01_ARCHITECTURE.md`: Architecture blueprint, request lifecycle, and middleware pipeline.
  - `02_DATABASE_SCHEMA.md`: 30-table catalog, columns, foreign keys, and Mermaid ER diagrams.
  - `03_API_MAP.md`: REST API specifications, query conventions, and endpoint inventory.
  - `04_RBAC_PERMISSIONS.md`: Role definitions, permission matrix, and driver PII masking.
  - `05_AUTH_AND_SECURITY.md`: JWT token management, MFA/TOTP flow, rate limits, and audit logs.
  - `06_DATA_FLOW.md`: Step-by-step Mermaid sequence flows for core business operations.
  - `07_FRONTEND_INTEGRATION.md`: Frontend adapter patterns, HTTP client, and dual-server testing.
  - `08_IMPLEMENTATION_MAP.md`: Module-by-module implementation status matrix.
  - `09_ALERTS_AND_NOTIFICATIONS.md`: Expiration rules, daily cron monitor, and notification channels.
  - `10_ENVIRONMENT_SETUP.md`: Windows PowerShell setup, environment variables, and troubleshooting.
  - `11_DEPLOYMENT.md`: PM2 clustering, Nginx reverse proxy, and zero-downtime rollback.
  - `12_BACKUP_AND_RESTORE.md`: Automated mysqldump procedures, off-server sync, and recovery checklists.
  - `13_TESTING_AND_ACCEPTANCE.md`: Client acceptance test matrix and verification procedures.
  - `14_CLIENT_HANDOVER.md`: Deliverable inventory, credentials transfer, and offboarding checklist.
- Unified documentation index and quickstart guide in `backend/README.md`.

### Fixed & Synchronized
- Pulled remote Git updates from `origin/main` (`922c3c1`), merging remote changes cleanly with local configuration.
- Committed frontend API environment variables (`VITE_API_URL=http://localhost:5001/api/v1`) in `.env` and `.env.example`.
- Pushed synchronized commit `c5e672c` to `https://github.com/prernaverma0502-hash/prime-route-frontend.git` with zero modifications to React UI code.

---

## [Phase 3] - API Scaffolding & Health Check Diagnostics (2026-11-16)

### Added
- Express application bootstrap (`backend/src/app.js`) with security pipeline:
  - `helmet()` for hardened HTTP headers.
  - `cors()` with origin whitelisting for `FRONTEND_URL`.
  - `hpp()` protection against HTTP parameter pollution.
  - `express-rate-limit` capping traffic to 1,000 requests / 15 minutes.
  - Centralized error handler returning standard `{ success, error }` envelopes.
- Live database health check endpoint (`GET /api/v1/health`) in `backend/src/routes.js`.
- HTTP server listener with dynamic port conflict recovery (`backend/src/server.js`), auto-detecting and recovering from Windows `EADDRINUSE` port reservations.
- Automated integration test suite (`backend/tests/health.test.js`) utilizing Jest and Supertest.

### Fixed
- Replaced legacy `nodemon` daemon with Node's native watcher (`node --watch src/server.js`) in `npm run dev` to resolve Windows 11 `spawn EPERM pstree.remy` child process failures on Node 24.
- Resolved local port conflict on port 5000 by reconfiguring default server port to `5001`.

---

## [Phase 2] - Relational Database Schema & Migrations (2026-11-16)

### Added
- Configured Knex.js database connection pool (`backend/src/config/db.js` and `backend/knexfile.js`) supporting MySQL 8 and MariaDB.
- Authored 12 structured Knex database migration files (`backend/db/migrations/`) defining all 30 business entities:
  - `001_create_users_and_auth_tables.js`: `users`, `refresh_tokens`, `mfa_backup_codes`, `invitations`, `password_resets`.
  - `002_create_audit_logs_table.js`: `audit_logs` (insert-only immutable audit trail).
  - `003_create_vehicles_and_drivers_tables.js`: `vehicles`, `drivers`, `vehicle_assignments`.
  - `004_create_rentals_tables.js`: `rentals`, `rental_amendments`, `rental_signatures`.
  - `005_create_inspections_and_photos_tables.js`: `inspections`, `inspection_photos`.
  - `006_create_accidents_and_insurance_tables.js`: `accidents`, `insurance_policies`, `insurance_claims`.
  - `007_create_vendors_expenses_and_maintenance_tables.js`: `vendors`, `expenses`, `maintenance_records`.
  - `008_create_invoices_and_ledger_tables.js`: `invoices`, `invoice_items`, `ledger_entries`.
  - `009_create_tolls_tickets_table.js`: `tolls_tickets`.
  - `010_create_documents_tables.js`: `documents`, `document_versions`.
  - `011_create_employee_paperwork_table.js`: `employee_paperwork`.
  - `012_create_settings_and_notifications_tables.js`: `settings`, `notification_rules`, `alert_history`.
- Authored 4 comprehensive seed files (`backend/db/seeds/`):
  - `001_users.js`: Seeded initial accounts for all 6 business roles.
  - `002_settings.js`: Seeded company profile and default leasing rules.
  - `003_notification_rules.js`: Seeded alert rules for inspections, registrations, and oil changes.
  - `004_sample_data.js`: Populated initial sample vehicles, drivers, and rental contracts.
- Executed migrations and seeds successfully against live MySQL database (`primeroute`).
- Generated complete SQL dump artifact (`backend/db/primeroute.sql`) via `mysqldump`.

---

## [Phase 1] - Project Scaffolding & Foundation Architecture (2026-11-16)

### Added
- Initialized PrimeRoute backend repository structure:
  - `src/config/`: `constants.js` (Roles, Modules, Statuses), `env.js` (Zod schema validation).
  - `src/utils/`: `logger.js` (Pino JSON logging).
  - `src/modules/`: 18 domain-driven module directory scaffolds.
  - `uploads/`: Physical directory for document and photograph storage.
- Created `backend/package.json` with production dependencies (`express`, `knex`, `mysql2`, `helmet`, `cors`, `zod`, `pino`, `bcryptjs`, `jsonwebtoken`, `otplib`, `nodemailer`, `node-cron`, `multer`).
- Defined foundational architecture specification in `PrimeRoute_Backend_Plan.md`.
