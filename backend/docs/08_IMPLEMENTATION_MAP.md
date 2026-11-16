# PrimeRoute System Implementation Map

**One-line purpose:** Comprehensive matrix correlating frontend UI views, client API modules, backend REST routes, relational database entities, and current implementation progress.  
**Last updated:** November 16, 2026  
**Status:** Complete  

---

## 1. System Implementation Summary

- **Total System Modules:** 16 Modules
- **Completed Infrastructure & Schema:** 100% (All 30 MySQL tables migrated & seeded)
- **Active Backend Route Status:**
  - **Done (1):** Health Check & Diagnostic (`GET /api/v1/health`)
  - **Partial (2):** Backend Foundation, CORS/Security Pipeline, Frontend Environment Integration
  - **Planned (13):** Core domain controller implementations

---

## 2. End-to-End Implementation Matrix

| Frontend Module | Frontend Page Component | Frontend API Client | Backend Target Route(s) | MySQL Table(s) | Status | Architectural Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **System Health** | *N/A (System Service)* | *Native Fetch* | `GET /api/v1/health` | `knex_migrations` | **Done** | Verifies server uptime and live MySQL connection pool; unit test passing. |
| **Authentication** | `src/pages/Auth/LoginPage.jsx` | `src/api/auth.js` | `POST /auth/login`<br>`POST /auth/mfa/verify`<br>`POST /auth/refresh-token` | `users`<br>`refresh_tokens`<br>`mfa_backup_codes` | **Partial** | Tables migrated and seeded; frontend mock auth currently active; routes planned. |
| **Dashboard** | `src/pages/Dashboard/DashboardPage.jsx` | `src/api/index.js` | `GET /dashboard/kpis`<br>`GET /dashboard/alerts` | `vehicles`<br>`rentals`<br>`alert_history` | **Planned** | Aggregates fleet utilization percentages and active rental revenue. |
| **Vehicles** | `src/pages/Vehicles/VehiclesPage.jsx` | `src/api/vehiclesApi.js` | `GET /vehicles`<br>`POST /vehicles`<br>`PUT /vehicles/:id`<br>`POST /vehicles/:id/archive` | `vehicles`<br>`vehicle_assignments` | **Planned** | Full schema migrated; unique VIN constraint active in MySQL; mock persistence in UI. |
| **Drivers** | `src/pages/Drivers/DriversPage.jsx` | `src/api/driversApi.js` | `GET /drivers`<br>`POST /drivers`<br>`PUT /drivers/:id`<br>`GET /drivers/:id/statement` | `drivers`<br>`ledger_entries` | **Planned** | Schema migrated with balance/deposit columns; PII masking utility verified. |
| **Rentals** | `src/pages/Rentals/RentalsPage.jsx` | `src/api/rentalsApi.js` | `GET /rentals`<br>`POST /rentals`<br>`POST /rentals/:id/sign`<br>`POST /rentals/:id/amend` | `rentals`<br>`rental_amendments`<br>`rental_signatures` | **Planned** | Atomic overlap verification logic designed; digital signature audit ready. |
| **Inspections** | `src/pages/Inspections/InspectionsPage.jsx` | `src/api/inspectionsApi.js` | `GET /inspections`<br>`POST /inspections`<br>`POST /inspections/:id/photos` | `inspections`<br>`inspection_photos` | **Planned** | Multipart file upload handler (`uploads/inspections`) configured; checklist JSON schema ready. |
| **Accounting** | `src/pages/Accounting/AccountingPage.jsx` | `src/api/paymentsApi.js` | `GET /accounting/ledger`<br>`POST /accounting/charges`<br>`POST /accounting/payments`<br>`POST /accounting/deposits` | `ledger_entries`<br>`invoices`<br>`invoice_items` | **Planned** | Double-entry ledger architecture established; deposits segregated from revenue. |
| **Expenses** | `src/pages/Accounting/components/ExpensesTable.jsx` | `src/api/expensesApi.js` | `GET /expenses`<br>`POST /expenses` | `expenses`<br>`vendors` | **Planned** | 16 expense categories supported; vehicle attribution enabled in schema. |
| **Maintenance** | `src/pages/Maintenance/MaintenancePage.jsx` | `src/api/maintenanceApi.js` | `GET /maintenance`<br>`POST /maintenance`<br>`PUT /maintenance/:id` | `maintenance_records`<br>`vehicles` | **Planned** | 5,000-mile preventative oil change rules ready in notification triggers. |
| **Tolls & Tickets**| `src/pages/TollsTickets/TollsTicketsPage.jsx` | `src/api/tollsApi.js` | `GET /tolls-tickets`<br>`POST /tolls-tickets`<br>`POST /tolls-tickets/:id/charge-driver` | `tolls_tickets`<br>`ledger_entries` | **Planned** | Automated rental window attribution matching logic designed; UI mock active. |
| **Insurance** | `src/pages/Insurance/InsurancePage.jsx` | `src/api/insuranceApi.js` | `GET /insurance/policies`<br>`GET /insurance/claims`<br>`POST /insurance/claims` | `insurance_policies`<br>`insurance_claims`<br>`accidents` | **Planned** | Policy expiration and deductible tracking tables active. |
| **Documents** | `src/pages/Documents/UploadDocumentModal.jsx` | `src/api/documentsApi.js` | `GET /documents`<br>`POST /documents/upload`<br>`GET /documents/:id/download` | `documents`<br>`document_versions` | **Planned** | Version-controlled document storage directory created in `backend/uploads`. |
| **Vendors** | `src/pages/Vendors/VendorsPage.jsx` | `src/api/vendorsApi.js` | `GET /vendors`<br>`POST /vendors`<br>`PUT /vendors/:id` | `vendors` | **Planned** | Vendor directory schema migrated; foreign key relations to expenses active. |
| **Employee Paperwork**| `src/pages/EmployeePaperwork/EmployeePaperworkPage.jsx`| `src/api/users.js` | `GET /employee-paperwork`<br>`POST /employee-paperwork`<br>`PATCH /employee-paperwork/:id/approve` | `employee_paperwork`<br>`users` | **Planned** | Feature toggle `VITE_ENABLE_EMPLOYEE_PAPERWORK=true` active in frontend `.env`. |
| **Users & Roles** | `src/pages/Users/UsersAndRolesPage.jsx` | `src/api/usersApi.js` | `GET /users`<br>`POST /users/invite`<br>`PATCH /users/:id/role` | `users`<br>`invitations` | **Planned** | 6 business roles fully mapped in RBAC matrix; Owner-exclusive privileges. |
| **Settings & Alerts**| `src/pages/Settings/SettingsPage.jsx` | `src/api/index.js` | `GET /settings`<br>`PUT /settings/:key`<br>`GET /alerts`<br>`PATCH /alerts/:id/resolve` | `settings`<br>`notification_rules`<br>`alert_history` | **Planned** | Configurable lead days and repeat intervals seeded into MySQL. |
