# PrimeRoute Windows Environment Setup & Troubleshooting Guide

**One-line purpose:** Step-by-step operational setup guide for Windows PowerShell, environment variable reference, MySQL database provisioning, and practical troubleshooting solutions.  
**Last updated:** November 16, 2026  
**Status:** Complete  

---

## 1. System Requirements & Prerequisites

- **Operating System:** Windows 10 / Windows 11 (64-bit)
- **Node.js:** v20.x LTS (Minimum v18.0.0; Node 24 supported via native `--watch`)
- **Package Manager:** npm v9.x or v10.x
- **Database Server:** MySQL Server 8.0+ or XAMPP MariaDB (v10.4+)
- **Terminal Shell:** Windows PowerShell (Run as Administrator for initial setup if installing system packages)

---

## 2. Step-by-Step Installation Procedure

### Step 1: Open Windows PowerShell
Launch PowerShell and change into the backend directory:
```powershell
cd "d:\Kiaan Project\prime route2\backend"
```

### Step 2: Install Node.js Dependencies
```powershell
npm install
```

### Step 3: Provision MySQL Database & User
Open MySQL command prompt or phpMyAdmin SQL tab, then execute:
```sql
-- 1. Create the database with full UTF-8 Unicode support
CREATE DATABASE IF NOT EXISTS primeroute 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- 2. Optional: Create a dedicated application user
CREATE USER IF NOT EXISTS 'primeroute_app'@'localhost' IDENTIFIED BY 'StrongAppPassword123!';
GRANT ALL PRIVILEGES ON primeroute.* TO 'primeroute_app'@'localhost';
FLUSH PRIVILEGES;
```

### Step 4: Configure Environment Variables
Copy the template configuration to your local `.env`:
```powershell
Copy-Item .env.example .env
```
Open `backend/.env` in your code editor and verify database port and credentials (e.g., standard MySQL port is `3306`; XAMPP default is often `3306` or `3307`).

### Step 5: Execute Database Migrations
Run Knex migrations to construct all 30 relational tables in proper foreign key order:
```powershell
npm run migrate
```

### Step 6: Populate Seed Data
Populate system settings, notification rules, and default employee user accounts:
```powershell
npm run seed
```

### Step 7: Launch the Development Server
```powershell
npm run dev
```
*(The server runs `node --watch src/server.js`, reloading automatically upon code changes without external daemon crashes).*

---

## 3. Environment Variables Reference (`.env`)

| Variable Name | Required? | Default / Example Value | Description & Security Best Practice |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Optional | `development` | Runtime environment (`development`, `test`, `production`). In production, stack traces are withheld from error responses. |
| `PORT` | Optional | `5001` (Default 5000) | Port number Express binds to. Set to `5001` if Windows system processes reserve port 5000. |
| `DB_HOST` | **Required** | `127.0.0.1` | Hostname or IP address of the MySQL database server. |
| `DB_PORT` | **Required** | `3306` (or `3307`) | MySQL TCP port. Use `3307` if using custom XAMPP configurations. |
| `DB_USER` | **Required** | `root` | Database user account name with DDL and DML privileges. |
| `DB_PASSWORD` | Optional | `""` (Empty for local dev) | Password for MySQL user. Must be a strong high-entropy secret in production. |
| `DB_NAME` | **Required** | `primeroute` | Name of the active relational schema. |
| `JWT_ACCESS_SECRET`| **Required** | `development_jwt_access_secret_min10chars` | High-entropy secret key for signing short-lived JWT access tokens. |
| `JWT_REFRESH_SECRET`| **Required** | `development_jwt_refresh_secret_min10chars` | Cryptographic secret for signing long-lived JWT refresh tokens. |
| `JWT_ACCESS_EXPIRES`| Optional | `15m` | Lifespan of access tokens before requiring silent refresh. |
| `JWT_REFRESH_EXPIRES`| Optional | `7d` | Lifespan of refresh tokens before requiring full re-login. |
| `FRONTEND_URL` | Optional | `http://localhost:3000` | Whitelisted frontend origin for CORS credentials verification. |
| `SMTP_HOST` | Optional | `smtp.example.com` | Hostname of outbound SMTP server for alerts and invitations. |
| `SMTP_PORT` | Optional | `587` | Outbound SMTP TLS port (typically 587 or 465). |
| `SMTP_USER` | Optional | `alerts@primeroute.io` | SMTP authentication username. |
| `SMTP_PASS` | Optional | `smtp_secret_pass` | SMTP authentication password. |
| `MAIL_FROM` | Optional | `no-reply@primeroute.io` | Default "From" sender display email address. |
| `UPLOAD_DIR` | Optional | `uploads` | Relative filesystem path for physical storage of uploaded photos and documents. |
| `SEED_PASSWORD` | Optional | `Password123!` | Default fallback password for development seeded test accounts. |

---

## 4. Troubleshooting Common Windows Errors

| Error Signature | Root Cause | Verified Solution |
| :--- | :--- | :--- |
| **`listen EADDRINUSE: address already in use :::5000`** | Windows WinNAT, Hyper-V, or a background process has reserved port 5000. | 1. Change `PORT=5001` in `backend/.env`.<br>2. The server's built-in `startServer` function also automatically increments and tries the next port if in use. |
| **`connect ECONNREFUSED 127.0.0.1:3306`** | MySQL service is either stopped or running on a non-standard port (e.g. XAMPP on `3307`). | 1. Open XAMPP Control Panel and verify the MySQL port.<br>2. Update `DB_PORT=3307` (or your active port) in `backend/.env`.<br>3. Ensure MySQL service is running. |
| **`ER_ACCESS_DENIED_ERROR`** | `DB_USER` or `DB_PASSWORD` in `.env` does not match MySQL user credentials. | 1. Verify credentials by logging in via command line: `mysql -u root -p -P 3307`.<br>2. Match values in `backend/.env`. |
| **`spawn EPERM ... pstree.remy` (Node 24)** | Node 24 on Windows 11 blocks nodemon's legacy `wmic.exe` child process lookup. | PrimeRoute's `npm run dev` script uses Node's native built-in watcher: `"dev": "node --watch src/server.js"`. Avoid invoking nodemon directly. |
| **`Knex: Timeout acquiring a connection`** | Connection pool cannot reach database due to wrong host or network block. | Use explicit loopback IP `127.0.0.1` instead of `localhost` in `DB_HOST` to bypass Windows IPv6 resolution latency. |
| **`Migration table is already locked`** | A previous migration crashed midway, leaving `knex_migrations_lock` locked. | Run SQL query: `UPDATE knex_migrations_lock SET is_locked = 0;` and re-run `npm run migrate`. |
| **`'vite' is not recognized as an internal or external command`** | Frontend dependencies were not installed in `frontend/`. | Run `cd "d:\Kiaan Project\prime route2\frontend"` followed by `npm install`. |
