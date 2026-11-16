# PrimeRoute Backend API Specification & Operational Guide

**One-line purpose:** Central developer quickstart, setup guide, prerequisites, operational instructions, and documentation index for the PrimeRoute backend REST API service.  
**Last updated:** November 16, 2026  
**Status:** Complete  

---

## 1. What PrimeRoute Backend Is

PrimeRoute is an enterprise fleet and vehicle rental management backend API. It powers commercial vehicle leasing, driver account balances, scheduled fleet maintenance (including automated 5,000-mile preventative oil change alerts), rental contract lifecycles with digital signatures, municipal toll and citation attribution, condition inspection reports with photos, and double-entry accounting ledger entries.

The system is designed for fleets of 31 to 75+ vehicles with horizontal architectural scaling capability.

---

## 2. Technology Stack

- **Runtime Environment:** Node.js (v20 LTS recommended, v18+ minimum)
- **Web Framework:** Express.js (v4.21)
- **Database Engine:** MySQL 8.0+ (or MariaDB 10.4+) via InnoDB
- **Query Builder & Migrations:** Knex.js (v3.1)
- **Data Validation:** Zod (v3.24)
- **Security & Headers:** Helmet, CORS, HPP, Express-Rate-Limit, BCryptJS
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & TOTP MFA (`otplib`)
- **Structured Logging:** Pino & Pino-HTTP
- **Automated Testing:** Jest (v29) & Supertest (v7)

---

## 3. Prerequisites

Before installing the backend, verify your system has the following tools installed:

1. **Node.js:** v20.x or higher (`node -v`)
2. **npm:** v9.x or higher (`npm -v`)
3. **MySQL Server:** v8.0 or higher (`mysql --version`) running locally or accessible via network.

---

## 4. Installation & Setup (Windows PowerShell)

Follow these exact steps in **Windows PowerShell**:

### Step 1: Open PowerShell and Navigate to the Backend Directory
```powershell
cd "d:\Kiaan Project\prime route2\backend"
```

### Step 2: Install Node.js Dependencies
```powershell
npm install
```

### Step 3: Create the MySQL Database
Log into MySQL using the command line or phpMyAdmin and execute:
```sql
CREATE DATABASE IF NOT EXISTS primeroute 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;
```

### Step 4: Configure Environment Variables
Copy the `.env.example` template to `.env`:
```powershell
Copy-Item .env.example .env
```
Open `backend/.env` and update your database connection parameters:
```env
PORT=5001
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=primeroute
```
*(Note: If using XAMPP MySQL, the default port is often `3307` or `3306` with an empty password).*

### Step 5: Run Database Migrations
Execute Knex migrations to create all 30 normalized tables:
```powershell
npm run migrate
```
*(To rollback the latest migration if ever needed: `npm run migrate:rollback`)*

### Step 6: Seed Initial System Data
Populate default roles, settings, notification rules, and sample records:
```powershell
npm run seed
```

### Step 7: Start the Development Server
```powershell
npm run dev
```
The server will start listening on `http://localhost:5001` (or next free port) using Node's native file watcher (`node --watch src/server.js`).

---

## 5. Verification & Testing

### How to Check the Health Endpoint
In a web browser or via PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/v1/health" -Method Get
```
Expected response:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "db": "connected"
  }
}
```

### Running Automated Test Suite
To run the automated Jest test suite:
```powershell
npm test
```
Verifies HTTP endpoints and database connection handling.

---

## 6. Seeded User Accounts (Development)

The seed scripts create one active user for each of the 6 system roles. The default password is `Password123!` (or the value set in `SEED_PASSWORD` in `.env`):

| Role ID | Role Title | Seed Email | Permissions Overview |
| :--- | :--- | :--- | :--- |
| `owner` | Owner / Primary Admin | `marcus.brody@primeroute.io` | Unrestricted root privileges across all modules. |
| `secondary_admin` | Operations Director | `elena.vance@primeroute.io` | Operations lead; sensitive actions require Owner approval. |
| `finance` | Financial Controller | `michael.chang@primeroute.io` | Invoices, payments, double-entry ledger, deposits. |
| `fleet_maintenance` | Fleet Ops & Service Lead | `tom.gallagher@primeroute.io` | Vehicle inventory, maintenance logs, 5,000-mile alerts. |
| `rental_operations` | Front Desk & Dispatcher | `sarah.connor@primeroute.io` | Driver onboarding, rental agreements, check-in/out inspections. |
| `readonly_manager` | Compliance & Audit Officer | `rachel.green@primeroute.io` | View-only reporting access across all operational records. |

---

## 7. Master Documentation Index (`backend/docs/`)

All architectural, operational, and database documentation files are organized in the `backend/docs/` directory:

| Document File | Purpose | Status |
| :--- | :--- | :---: |
| [01_ARCHITECTURE.md](docs/01_ARCHITECTURE.md) | Technology choices, folder layout, request pipeline, and service design. | Complete |
| [02_DATABASE_SCHEMA.md](docs/02_DATABASE_SCHEMA.md) | 30-table relational catalog, columns, foreign keys, indexes, and Mermaid ER diagrams. | Complete |
| [03_API_MAP.md](docs/03_API_MAP.md) | REST API endpoints, HTTP methods, RBAC scopes, request payloads, and query conventions. | Partial (Health Done / Domain Planned) |
| [04_RBAC_PERMISSIONS.md](docs/04_RBAC_PERMISSIONS.md) | The 6 roles, 15-module permission matrix, driver PII masking rules, and operator scope. | Complete |
| [05_AUTH_AND_SECURITY.md](docs/05_AUTH_AND_SECURITY.md) | JWT token lifecycle, TOTP MFA, account lockout, audit logs, and security headers. | Complete |
| [06_DATA_FLOW.md](docs/06_DATA_FLOW.md) | Step-by-step Mermaid sequence diagrams for core business operations and data flows. | Complete |
| [07_FRONTEND_INTEGRATION.md](docs/07_FRONTEND_INTEGRATION.md) | Connecting the React frontend to the API without modifying existing UI components. | Complete |
| [08_IMPLEMENTATION_MAP.md](docs/08_IMPLEMENTATION_MAP.md) | Cross-reference table linking frontend views, API clients, backend routes, and database tables. | Complete |
| [09_ALERTS_AND_NOTIFICATIONS.md](docs/09_ALERTS_AND_NOTIFICATIONS.md) | Expiration alert rules, daily cron monitor, notification channels, and resolution lifecycle. | Partial (Rules Seeded / Cron Planned) |
| [10_ENVIRONMENT_SETUP.md](docs/10_ENVIRONMENT_SETUP.md) | Windows PowerShell setup guide, `.env` reference table, and troubleshooting solutions. | Complete |
| [11_DEPLOYMENT.md](docs/11_DEPLOYMENT.md) | Production server setup, PM2 process management, Nginx reverse proxy, and rollback procedure. | Partial (Not tested yet in cloud) |
| [12_BACKUP_AND_RESTORE.md](docs/12_BACKUP_AND_RESTORE.md) | Automated daily mysqldump backups, off-site storage, retention policy, and restoration guide. | Complete |
| [13_TESTING_AND_ACCEPTANCE.md](docs/13_TESTING_AND_ACCEPTANCE.md) | Jest test execution and comprehensive 13-point client acceptance testing matrix. | Partial (Health Pass / Scenarios Documented) |
| [14_CLIENT_HANDOVER.md](docs/14_CLIENT_HANDOVER.md) | Handover deliverables, credentials transfer checklist, operational costs, and offboarding. | Complete |
| [CHANGELOG.md](docs/CHANGELOG.md) | Chronological development phase history, migration logs, and bug fix registry. | Complete |
