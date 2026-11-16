# PrimeRoute Backend Architecture Plan & Specification

## 1. Executive Summary & Goals
PrimeRoute is a vehicle leasing, rental, and fleet management system designed for 31–75+ vehicles with room to scale. This document defines the backend foundation architecture using Node.js, Express.js, MySQL (via Knex.js), and a normalized relational data model.

---

## 2. Architecture & Directory Structure
```
backend/
├── db/
│   ├── migrations/         # Knex database migrations
│   └── seeds/              # Initial system and mock data seeds
├── src/
│   ├── config/             # Environment, database, and constants
│   ├── jobs/               # Background cron jobs (node-cron)
│   ├── middlewares/        # Express security, auth, logging, error middlewares
│   ├── modules/            # Domain-driven feature modules
│   ├── services/           # Reusable services (email, storage, token)
│   ├── utils/              # Helper utilities (logger, response formatters)
│   ├── app.js              # Express app setup and middleware pipeline
│   ├── routes.js           # API v1 route mounting
│   └── server.js           # HTTP server bootstrap
├── tests/                  # Integration & unit tests (Jest + Supertest)
├── uploads/                # Local file storage for documents & photos
├── .env.example            # Environment template
├── .gitignore              # Ignored files (node_modules, .env, uploads/*)
├── knexfile.js             # Knex environment configurations
├── package.json            # Dependencies and npm scripts
└── README.md               # Backend operational instructions
```

---

## 3. Database Schema & Tables Specification

All tables use `InnoDB` engine, `utf8mb4` charset, `BIGINT UNSIGNED AUTO_INCREMENT` primary keys, and `created_at` / `updated_at` timestamps.

### Table Inventory (30 Entities):
1. **users**: System employee accounts with roles, credentials, and MFA status.
2. **refresh_tokens**: Long-lived hashed refresh tokens.
3. **mfa_backup_codes**: Hashed one-time MFA emergency codes.
4. **invitations**: User invitation tokens and role assignments.
5. **password_resets**: Hashed password reset tokens.
6. **audit_logs**: Immutable audit log of all system mutations and financial transactions.
7. **vehicles**: Fleet assets with VIN, plate, status, mileage, and acquisition info.
8. **drivers**: Driver records, license details, account balance, and deposit tracking.
9. **vehicle_assignments**: Historical vehicle-to-driver dispatch assignments.
10. **rentals**: Rental contracts, weekly rates, terms, and schedule.
11. **rental_amendments**: Contract extensions and rate adjustments.
12. **rental_signatures**: E-signatures for rental agreements.
13. **inspections**: Vehicle pickup, return, and routine condition reports.
14. **inspection_photos**: Condition and damage photos linked to inspections.
15. **accidents**: Incident and collision reports.
16. **insurance_policies**: Fleet and vehicle insurance policy details.
17. **insurance_claims**: Claims submitted against insurance policies.
18. **invoices**: Driver lease invoices and billing summaries.
19. **invoice_items**: Line items belonging to invoices.
20. **ledger_entries**: Double-entry style financial transactions (charges, payments, deposits, refunds).
21. **vendors**: Third-party service providers (repair shops, insurers, authorities).
22. **expenses**: Operating expenses attributed to vehicles and categories.
23. **maintenance_records**: Scheduled and unscheduled vehicle repairs.
24. **tolls_tickets**: Citations, tolls, and violations matched to rentals.
25. **documents**: Metadata and storage links for titles, registrations, and licenses.
26. **document_versions**: File version history.
27. **employee_paperwork**: Onboarding paperwork, SSN last 4, direct deposit, and signature.
28. **settings**: Key-value system configurations and company policies.
29. **notification_rules**: Configurable event trigger alert rules.
30. **alert_history**: Log of generated system alerts and resolution statuses.

---

## 4. Roles & Permissions Matrix
1. `owner`: Full unrestricted business and security access.
2. `secondary_admin`: Broad operations management; approvals required for high-risk actions.
3. `finance`: Invoices, ledger, expenses, deposits, and financial analytics.
4. `fleet_maintenance`: Vehicles, service logs, work orders, inspections.
5. `rental_operations`: Drivers, contracts, handovers, returns, citations.
6. `readonly_manager`: Read-only oversight across all approved dashboards.
