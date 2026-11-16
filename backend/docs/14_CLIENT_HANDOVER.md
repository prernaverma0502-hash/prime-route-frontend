# PrimeRoute Client Handover & Ownership Handbook

**One-line purpose:** Comprehensive handover deliverable inventory, administrative credentials transfer, recurring vendor costs breakdown, and developer offboarding checklist.  
**Last updated:** November 16, 2026  
**Status:** Complete  

---

## 1. Handover Deliverables Inventory

Upon project handover, the client receives 100% intellectual property ownership and full administrative control:

1. **Source Code Repositories:**
   - Frontend Application: React 18 + Vite + Tailwind CSS (`frontend/`) hosted on GitHub (`https://github.com/prernaverma0502-hash/prime-route-frontend.git`).
   - Backend API Service: Node.js + Express + Knex.js (`backend/`).
2. **Relational Database Artifacts:**
   - 12 Migration files defining all 30 normalized MySQL tables (`backend/db/migrations/`).
   - Complete production SQL schema dump (`backend/db/primeroute.sql`).
   - Initial system and sample seed data scripts (`backend/db/seeds/`).
3. **Full Documentation Suite:**
   - 14 Structured operational and architectural handbooks in `backend/docs/`.
4. **Primary System Owner Account:**
   - Root Owner account (`marcus.brody@primeroute.io` or client-designated primary administrative email).

---

## 2. Administrative Accounts & Credentials Transfer

| System Component | Access Level | Transfer Procedure | Current Custodian | New Client Owner |
| :--- | :--- | :--- | :--- | :--- |
| **GitHub Repository** | Admin / Owner | Transfer repository ownership or grant Organization Admin privileges. | Development Team | Client Tech Lead |
| **MySQL Database** | Root / DBA | Handover master database root credentials and create dedicated client admin user. | Development Team | Client System Admin |
| **Cloud Hosting (VM / PM2)** | Root / SSH | Rotate SSH keys; remove temporary developer public keys. | Development Team | Client DevOps |
| **Domain Registrar & DNS** | Account Admin | Point A and CNAME records to production server IP address. | Client | Client |
| **SMTP Mailer** | Account Admin | Configure production SMTP credentials in `.env` (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`). | Development Team | Client IT |

---

## 3. Data Export & Self-Service Capabilities

PrimeRoute is architected to guarantee that the client is never locked into proprietary formats:

- **Full Relational Export (SQL):**  
  At any time, the client can extract a full, unencrypted SQL dump using `mysqldump`:
  ```bash
  mysqldump -h 127.0.0.1 -u primeroute_app -p primeroute > primeroute_full_export.sql
  ```
- **Tabular Data Export (CSV):**  
  Every major data table (Vehicles, Drivers, Rentals, Accounting Ledger, Expenses, Maintenance Records, Tolls) includes a one-click CSV export function in the frontend (`src/utils/exportCsv.js`), allowing instant import into Microsoft Excel or Google Sheets.
- **Document & PDF Archival:**  
  All uploaded driver licenses, condition photographs, and lease agreements are stored as standard files (`.pdf`, `.jpg`, `.png`) in `backend/uploads/` and can be copied or archived using standard filesystem commands.

---

## 4. Ongoing Recurring Operational Costs (Estimates)

The following operational services are required to maintain continuous production operations:

| Service Category | Recommended Provider | Purpose | Estimated Monthly Cost | Status |
| :--- | :--- | :--- | :---: | :--- |
| **Cloud Hosting (VPS / Cloud VM)** | DigitalOcean, AWS EC2, or Linode | Hosts Express backend and Nginx reverse proxy. | $24 – $48 / month | Confirmed estimate |
| **Managed MySQL Database** | DigitalOcean Managed DB or AWS RDS | High-availability database with automated daily snapshots. | $35 – $70 / month | Confirmed estimate |
| **Transactional Email (SMTP)** | SendGrid, Mailgun, or Amazon SES | Dispatches user invitations, alerts, and password resets. | $0 – $15 / month | Amazon SES: ~$1 / 10k emails |
| **SMS Notification Gateway** | Twilio or AWS SNS | SMS notifications for urgent expiration alerts. | To be confirmed | ~$0.0079 / SMS (Planned) |
| **Domain Registration & SSL** | Cloudflare / Namecheap / Let's Encrypt | Domain name renewal and SSL/TLS certificates. | ~$15 / year (SSL is Free) | Confirmed estimate |
| **Digital E-Signature Gateway** | Native HTML5 Canvas (Built-in) | Captures customer contract signatures directly in-browser. | **$0 / month** (Included free) | Built-in capability |

---

## 5. Support, Warranty & Maintenance Placeholder

- **Warranty Period:** Standard 30-day post-handover bug-fix warranty covering discrepancies against the design specifications.
- **SLA & Maintenance:** Ongoing feature enhancements, custom integrations, or monthly maintenance agreements are executed under separate maintenance agreements to be confirmed with the client.

---

## 6. Developer Offboarding Security Checklist

To be completed upon final acceptance sign-off:
- [ ] Transfer primary GitHub repository ownership to the client's official GitHub organization.
- [ ] Change master database root password; confirm application `.env` reflects the new production credentials.
- [ ] Invalidate development JWT secrets and generate new high-entropy secrets for production.
- [ ] Revoke developer SSH keys from production host (`~/.ssh/authorized_keys`).
- [ ] Terminate developer API keys on external services (SMTP, Cloud Storage).
- [ ] Client Owner successfully signs in and verifies full administrative control.
