# PrimeRoute Fleet Management Systems

Enterprise frontend-only prototype for PrimeRoute fleet leasing, compliance repository, accounting telemetry, and driver lifecycle management. Built with React 18, Vite, and Tailwind CSS.

---

## Document Storage & Security Architecture Note

> **CRITICAL SECURITY REQUIREMENT**:
> Real permission enforcement must happen in the document storage backend, not only in the UI.

Client-side UI gating, lock states, and role-based badge restrictions provide operational ergonomics and visual feedback for users. However, in production architectures, zero-trust authorization and cryptographic access controls must be strictly enforced at the object storage and API service layer:

1. **Pre-signed Expiring URLs**: Document downloads and previews must be gated by time-limited (e.g., 60-second) pre-signed URLs generated server-side after verifying the caller's JWT role claims.
2. **KMS Envelope Encryption**: Confidential records (payroll tax filings, executive compensation, driver background checks) must be stored with Customer-Managed Encryption Keys (CMEK) restricted by Cloud IAM policy.
3. **Backend Authorization Guards**: API endpoints serving metadata or file streams must reject requests from unauthorized roles regardless of client-side state.

---

## Module Overview

- **Dashboard**: Executive KPI overview, fleet status breakdown, revenue vs. expenses, top vehicles, and important action alerts.
- **Vehicles**: Full fleet inventory, VIN validation, acquisition financing, and lifecycle profitability.
- **Drivers**: Driver profiles, CDL compliance expiration, payment records, and printable driver ledger statements.
- **Rentals**: Active contracts, calendar allocation view, and branded rental agreement generator.
- **Inspections & Damage**: Digital pickup and return condition checklists, baseline vs. new damage comparison, condition evidence photos, driver acknowledgment signatures, and insurance claim tracking.
- **Insurance & Compliance**: Fleet master policies, linked accident claims, and 30/14/7-day regulatory compliance tracking across registrations, licenses, contracts, and permits.
- **Accounting & Finance**: Integrated AR/AP ledger, refundable security deposit escrow, payments, and QuickBooks Online sync points.
- **Vendors**: Preferred supplier directory, parts orders, and Recharts cumulative spend tracking.
- **Tolls & Violations**: Municipal citation reconciliation, automated rental period matching, and driver balance chargebacks.
- **Documents Repository**: Controlled document storage, drag-and-drop uploads, mobile camera capture, version history, and restricted document lock states.
- **Reports & Analytics**: P&L statements, summary balance sheets, vehicle profitability, driver statements, utilization gauges, and multi-format exports (PDF, Excel, CSV).

