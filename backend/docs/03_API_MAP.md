# PrimeRoute REST API Map & Specification

**One-line purpose:** Complete reference of all implemented and planned API routes, HTTP methods, authorization scopes, request payloads, response formats, and query conventions.  
**Last updated:** November 16, 2026  
**Status:** Partial (Health Check Implemented; Domain Routes Planned)  

---

## 1. Global API Standards

- **Base URL:** `http://localhost:5001/api/v1` (Production: `https://api.primeroute.io/api/v1`)
- **Content-Type:** `application/json` (except multipart file uploads)
- **Authentication Header:**
  ```http
  Authorization: Bearer <access_token>
  ```
- **Error Response Envelope:**
  ```json
  {
    "success": false,
    "error": {
      "message": "Human-readable description of error",
      "code": "ERROR_CODE_CONSTANT"
    }
  }
  ```

---

## 2. Standard Query Parameter Conventions

All list/index endpoints support uniform pagination, sorting, and filtering:

| Parameter | Type | Default | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `page` | integer | `1` | Current page number (1-indexed) | `?page=2` |
| `limit` | integer | `25` | Results per page (max 100) | `?limit=50` |
| `sortBy` | string | `created_at` | Target column name for sorting | `?sortBy=last_name` |
| `sortOrder`| string | `desc` | Direction (`asc` or `desc`) | `?sortOrder=asc` |
| `search` | string | - | Full-text keyword filter across name, VIN, email | `?search=Camry` |
| `status` | string | - | Record status filter | `?status=available` |
| `startDate`| string | - | ISO date filter (inclusive) | `?startDate=2026-01-01` |
| `endDate` | string | - | ISO date filter (inclusive) | `?endDate=2026-12-31` |

### Paginated Response Structure
```json
{
  "success": true,
  "data": {
    "items": [ /* records */ ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 142,
      "totalPages": 6
    }
  }
}
```

---

## 3. Implemented Routes

### Health & Diagnostic Module
#### `GET /api/v1/health`
- **Status:** **Implemented** (Passing Integration Tests)
- **Description:** Verifies service uptime and real-time connectivity to the MySQL database.
- **Allowed Roles:** Public (No authentication required)
- **Request Body:** None
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "status": "ok",
      "db": "connected"
    }
  }
  ```
- **Error Response (503 Service Unavailable):**
  ```json
  {
    "success": false,
    "error": {
      "message": "Database connection failed: connect ECONNREFUSED 127.0.0.1:3306",
      "code": "DB_UNAVAILABLE"
    }
  }
  ```

---

## 4. Planned Domain API Routes

*(All routes below are fully architected in the backend plan and migration catalog; status is **Planned** pending route-handler implementation)*

### 4.1 Authentication & Profile (`/auth`)

| Method | Endpoint | Allowed Roles | Request Body Summary | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | `{ email, password }` | 200 OK |
| `POST` | `/auth/mfa/verify` | Public | `{ email, mfaCode, isBackupCode }` | 200 OK |
| `POST` | `/auth/mfa/setup` | Authenticated | `{}` | 200 OK |
| `POST` | `/auth/refresh-token`| Public | `{ refreshToken }` | 200 OK |
| `POST` | `/auth/logout` | Authenticated | `{ refreshToken }` | 200 OK |
| `POST` | `/auth/forgot-password`| Public | `{ email }` | 200 OK |
| `POST` | `/auth/reset-password` | Public | `{ token, newPassword }` | 200 OK |
| `POST` | `/auth/invitations/accept` | Public | `{ token, password, fullName }` | 201 Created |

### 4.2 Fleet Management (`/vehicles`)

| Method | Endpoint | Allowed Roles | Request Body Summary | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/vehicles` | All Roles | None (Query parameters supported) | 200 OK |
| `GET` | `/vehicles/:id` | All Roles | None | 200 OK |
| `POST` | `/vehicles` | `owner`, `secondary_admin`, `fleet_maintenance` | `{ vin, licensePlate, make, model, year, weeklyRate, securityDeposit }` | 201 Created |
| `PUT` | `/vehicles/:id` | `owner`, `secondary_admin`, `fleet_maintenance` | `{ licensePlate, status, weeklyRate, currentOdometer, notes }` | 200 OK |
| `PATCH`| `/vehicles/:id/status` | `owner`, `secondary_admin`, `fleet_maintenance` | `{ status, reason }` | 200 OK |
| `POST` | `/vehicles/:id/archive` | `owner` (Sec Admin requires approval) | `{ archiveReason }` | 200 OK |

### 4.3 Driver Directory (`/drivers`)

| Method | Endpoint | Allowed Roles | Request Body Summary | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/drivers` | All Roles (PII masked for non-admin) | Query parameters | 200 OK |
| `GET` | `/drivers/:id` | All Roles (PII masked for non-admin) | None | 200 OK |
| `POST` | `/drivers` | `owner`, `secondary_admin`, `rental_operations` | `{ firstName, lastName, email, phone, licenseNumber, licenseState, licenseExpiration, dob, address }` | 201 Created |
| `PUT` | `/drivers/:id` | `owner`, `secondary_admin`, `rental_operations` | `{ phone, address, licenseExpiration, notes }` | 200 OK |
| `GET` | `/drivers/:id/statement` | `owner`, `secondary_admin`, `finance` | `?startDate=&endDate=` | 200 OK |

### 4.4 Rental Contracts & Leasing (`/rentals`)

| Method | Endpoint | Allowed Roles | Request Body Summary | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/rentals` | All Roles | Query parameters | 200 OK |
| `GET` | `/rentals/:id` | All Roles | None | 200 OK |
| `POST` | `/rentals` | `owner`, `secondary_admin`, `rental_operations` | `{ vehicleId, driverId, startDate, endDate, weeklyRate, depositAmount, mileageAllowed }` | 201 Created |
| `POST` | `/rentals/:id/sign` | `owner`, `secondary_admin`, `rental_operations` | `{ signerType, signerName, signatureData }` | 200 OK |
| `POST` | `/rentals/:id/amend` | `owner`, `secondary_admin`, `rental_operations` | `{ newEndDate, newRate, reason }` | 200 OK |
| `POST` | `/rentals/:id/terminate`| `owner`, `secondary_admin`, `rental_operations` | `{ terminationDate, reason }` | 200 OK |

### 4.5 Vehicle Inspections (`/inspections`)

| Method | Endpoint | Allowed Roles | Request Body Summary | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/inspections` | All Roles except `finance` | Query parameters | 200 OK |
| `GET` | `/inspections/:id` | All Roles except `finance` | None | 200 OK |
| `POST` | `/inspections` | `owner`, `secondary_admin`, `fleet_maintenance`, `rental_operations` | `{ vehicleId, rentalId, inspectionType, odometer, fuelLevel, conditionChecklist, existingDamages }` | 201 Created |
| `POST` | `/inspections/:id/photos` | `owner`, `secondary_admin`, `fleet_maintenance`, `rental_operations` | Multipart form data (`photo`, `photoType`, `caption`) | 201 Created |

### 4.6 Accounting, Invoices & Ledger (`/accounting`)

| Method | Endpoint | Allowed Roles | Request Body Summary | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/accounting/ledger` | `owner`, `secondary_admin`, `finance` | Query parameters | 200 OK |
| `POST` | `/accounting/charges`| `owner`, `secondary_admin`, `finance` | `{ driverId, rentalId, amount, category, notes }` | 201 Created |
| `POST` | `/accounting/payments`| `owner`, `secondary_admin`, `finance` | `{ driverId, amount, paymentMethod, reference }` | 201 Created |
| `POST` | `/accounting/deposits`| `owner`, `secondary_admin`, `finance` | `{ driverId, rentalId, amount, paymentMethod }` | 201 Created |
| `POST` | `/accounting/refunds` | `owner`, `secondary_admin`, `finance` | `{ driverId, amount, reason, paymentMethod }` | 201 Created |
| `POST` | `/accounting/adjustments`| `owner`, `finance` (Sec Admin requires approval) | `{ driverId, amount, type, reason }` | 201 Created |
| `GET` | `/accounting/invoices`| `owner`, `secondary_admin`, `finance` | Query parameters | 200 OK |

### 4.7 Maintenance & Service Orders (`/maintenance`)

| Method | Endpoint | Allowed Roles | Request Body Summary | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/maintenance` | `owner`, `secondary_admin`, `fleet_maintenance` | Query parameters | 200 OK |
| `POST` | `/maintenance` | `owner`, `secondary_admin`, `fleet_maintenance` | `{ vehicleId, vendorId, serviceType, odometer, laborCost, partsCost, serviceDate }` | 201 Created |
| `PUT` | `/maintenance/:id` | `owner`, `secondary_admin`, `fleet_maintenance` | `{ status, totalCost, notes }` | 200 OK |

### 4.8 Tolls & Citations (`/tolls-tickets`)

| Method | Endpoint | Allowed Roles | Request Body Summary | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/tolls-tickets` | All Roles | Query parameters | 200 OK |
| `POST` | `/tolls-tickets` | `owner`, `secondary_admin`, `finance`, `rental_operations` | `{ citationNumber, vehicleId, violationDatetime, issuingAuthority, fineAmount, feeAmount }` | 201 Created |
| `POST` | `/tolls-tickets/:id/charge-driver`| `owner`, `secondary_admin`, `finance` | `{ driverId, adminFee }` | 200 OK |
| `PATCH`| `/tolls-tickets/:id/status` | `owner`, `secondary_admin`, `finance` | `{ status, notes }` | 200 OK |

### 4.9 System Settings & User Administration (`/settings`, `/users`)

| Method | Endpoint | Allowed Roles | Request Body Summary | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/users` | `owner` only | Query parameters | 200 OK |
| `POST` | `/users/invite` | `owner` only | `{ email, role }` | 201 Created |
| `PATCH`| `/users/:id/role` | `owner` only | `{ role }` | 200 OK |
| `GET` | `/settings` | `owner`, `secondary_admin` (view only) | None | 200 OK |
| `PUT` | `/settings/:key` | `owner` only | `{ value }` | 200 OK |
| `GET` | `/audit-logs` | `owner` only | Query parameters | 200 OK |
