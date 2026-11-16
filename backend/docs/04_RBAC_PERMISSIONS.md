# PrimeRoute Role-Based Access Control (RBAC) Specification

**One-line purpose:** Authoritative reference for the 6 system roles, complete module-action permission matrix, driver PII data masking policy, and client-ready operator scope summary.  
**Last updated:** November 16, 2026  
**Status:** Complete  

---

## 1. Overview of the 6 System Roles

PrimeRoute enforces a strict, hierarchical Role-Based Access Control (RBAC) model. Each authenticated user is assigned exactly one role:

1. **Owner (`owner`) - Primary Admin / Managing Director:**
   Unrestricted root access across all system modules, company settings, bank integrations, user administration, security overrides, and immutable audit logs.
2. **Secondary Admin (`secondary_admin`) - Operations Director:**
   Comprehensive operational management across vehicles, drivers, rentals, maintenance, and insurance. Sensitive actions (such as altering system settings, bank payouts, user administration, or permanent record archiving) require Owner authorization.
3. **Finance (`finance`) - Financial Controller:**
   Full authority over financial management: invoices, driver ledger accounts, customer billing, payment reconciliation, security deposit escrow, and P&L financial statements.
4. **Fleet & Maintenance (`fleet_maintenance`) - Fleet Ops & Service Lead:**
   Focused on physical fleet integrity: vehicle inventory, odometer updates, scheduled maintenance, repair shop work orders, and vehicle check-in/out condition audits.
5. **Rental Operations (`rental_operations`) - Front Desk & Dispatcher (Operator/Employee):**
   Daily front-desk operations: driver onboarding, rental agreement creation, digital signature collection, vehicle pickup handover, return intake, and ticket/toll matching.
6. **Read-Only Manager (`readonly_manager`) - Compliance & Audit Officer:**
   Read-only oversight across operational reports, fleet status, and audit summaries. Prohibited from mutating any system records.

---

## 2. Permissions Matrix

The matrix below reflects the exact permission configuration defined in `frontend/src/auth/permissions.js` and `backend/src/config/constants.js`.

*Allowed Actions: `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer`.*

| Module | Owner (`owner`) | Secondary Admin (`secondary_admin`) | Finance (`finance`) | Fleet & Maint (`fleet_maintenance`) | Rental Ops (`rental_operations`) | Read-Only Manager (`readonly_manager`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `view`, `export` | `view`, `export` | `view`, `export` | `view` | `view` | `view` |
| **Vehicles** | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `add`, `edit`, `export` *(archive requires Owner approval)* | `view` | `view`, `add`, `edit`, `export` | `view` | `view` |
| **Drivers** | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `add`, `edit`, `export` | `view` | `view` | `view`, `add`, `edit` | `view` |
| **Rentals** | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `add`, `edit`, `approve`, `export` *(archive requires Owner approval)* | `view`, `edit` | `view` | `view`, `add`, `edit`, `export` | `view` |
| **Inspections** | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `add`, `edit`, `approve`, `export` | *None* | `view`, `add`, `edit`, `export` | `view`, `add` | `view` |
| **Accounting** | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `export` *(edit/approve requires Owner approval)* | `view`, `add`, `edit`, `approve`, `export` | *None* | `view` | `view` |
| **Maintenance**| `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `add`, `edit`, `approve`, `export` | *None* | `view`, `add`, `edit`, `approve`, `export` | `view` | `view` |
| **Tolls & Tickets**| `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `add`, `edit`, `export` | `view`, `add`, `edit`, `approve`, `export` | `view` | `view`, `add`, `edit` | `view` |
| **Documents** | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `add`, `edit`, `export` | `view`, `export` | `view`, `add` | `view` | `view` |
| **Insurance** | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `add`, `edit`, `approve`, `export` | `view`, `add`, `edit`, `approve`, `export` | `view`, `add`, `edit`, `export` | `view` | `view` |
| **Reports** | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `export` | `view`, `export` | `view` | `view` | `view` |
| **Vendors** | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `add`, `edit`, `export` | `view`, `add`, `edit`, `approve`, `export` | `view`, `add`, `edit`, `export` | `view` | `view` |
| **Settings** | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view` *(edit requires Owner approval)* | *None* | *None* | *None* | *None* |
| **Users** | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | *None* *(Owner only)* | *None* | *None* | *None* | *None* |
| **Employee Paperwork**| `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | `view`, `add`, `edit`, `approve`, `export`, `archive`, `administer` | *None* | *None* | `view`, `add` *(own submission)* | *None* |

---

## 3. Driver Personally Identifiable Information (PII) Masking Policy

To comply with data privacy standards and internal confidentiality, driver PII is automatically masked depending on the viewing role:

| Role | Unmasked Access (`canMaskDrivers: false`) | Data Masked (`canMaskDrivers: true`) |
| :--- | :---: | :---: |
| **Owner** | Yes | No |
| **Secondary Admin** | Yes | No |
| **Finance** | No | Yes |
| **Fleet & Maintenance** | No | Yes |
| **Rental Operations** | No | Yes |
| **Read-Only Manager** | No | Yes |

### Specific Masking Rules Enforced by the System:
- **Driver License Number:** Only the first 2 and last 2 characters are visible; middle characters are replaced with dots (e.g., `DL••••••49`).
- **Date of Birth:** Only the birth year or day is retained; month and sensitive components are masked (e.g., `••••-••-14`).
- **Street Address:** The building and street name are masked, showing only city and state (e.g., `•••• Dallas, TX 75201`).
- **Social Security Number (SSN):** Only the last 4 digits are ever stored or returned (e.g., `•••-••-8821`).

---

## 4. Client-Ready Summary: What the Rental Operations / Employee Role Can See & Do

*(This section is written in clear, non-technical language suitable for sharing directly with the business owner or staff training)*

> ### Summary of Rental Operations (Front-Desk Staff) Privileges
>
> The **Rental Operations** role is designed for front-desk dispatchers, customer service representatives, and lot attendants who interact directly with drivers every day.
>
> #### What Front-Desk Staff CAN Do:
> 1. **Onboard New Drivers:** Enter driver contact information, phone numbers, and driver license details into the system.
> 2. **Create & Manage Rental Agreements:** Draft new vehicle rental contracts, assign available vehicles to qualified drivers, and set weekly lease terms.
> 3. **Collect Digital Signatures:** Capture driver e-signatures on digital contracts directly through a tablet or desktop screen.
> 4. **Perform Vehicle Check-in & Check-out Inspections:** Conduct walk-around inspections at pickup and return, record odometer and fuel levels, note scratches/damages, and take vehicle condition photos.
> 5. **Log Citations & Tolls:** Record parking tickets and toll violations that arrive in the mail and link them to the responsible vehicle and driver.
> 6. **Submit Personal Onboarding Paperwork:** Fill out their own employee paperwork, tax withholdings, and direct deposit details.
>
> #### What Front-Desk Staff CANNOT Do (Protected for Security):
> 1. **Cannot Change System Settings or Rates:** Cannot modify company-wide settings, minimum deposit rules, or system configuration.
> 2. **Cannot Add or Manage User Logins:** Cannot create, edit, or delete staff logins or change user passwords.
> 3. **Cannot Void or Modify Accounting Records:** Cannot edit the double-entry accounting ledger, issue financial refunds, or write off driver debts without managerial approval.
> 4. **Cannot Permanently Delete Fleet Vehicles:** Cannot retire, archive, or delete vehicles or driver histories.
> 5. **Cannot View Unmasked Sensitive Data:** Driver social security numbers and full license numbers are shielded to protect driver privacy.
