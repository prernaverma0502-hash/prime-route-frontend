# PrimeRoute Frontend-to-Backend Integration Guide

**One-line purpose:** Step-by-step technical guide for connecting the React Vite frontend to the Express backend API without breaking existing UI components or data models.  
**Last updated:** November 16, 2026  
**Status:** Complete  

---

## 1. Environment Configuration & Connection URL

The React frontend communicates with the backend via the `VITE_API_URL` environment variable located in `frontend/.env`:

```env
# PrimeRoute Frontend Configuration
VITE_ENABLE_EMPLOYEE_PAPERWORK=true
VITE_API_URL=http://localhost:5001/api/v1
```

In production, this variable is updated to point to the secure reverse-proxy domain:
```env
VITE_API_URL=https://app.primeroute.io/api/v1
```

---

## 2. Unified HTTP Client Architecture (`src/api/http.js`)

To transition cleanly from simulated local storage to the real live backend, the frontend utilizes a centralized HTTP client (`frontend/src/api/http.js`) with automatic JWT attachment and silent session refresh:

```javascript
/**
 * PrimeRoute Centralized HTTP Client
 * Handles base URL configuration, Bearer token injection, automatic token refresh, and error normalization.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

let accessToken = localStorage.getItem('primeroute_access_token');
let refreshToken = localStorage.getItem('primeroute_refresh_token');

export function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
  if (access) localStorage.setItem('primeroute_access_token', access);
  else localStorage.removeItem('primeroute_access_token');
  if (refresh) localStorage.setItem('primeroute_refresh_token', refresh);
  else localStorage.removeItem('primeroute_refresh_token');
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, { ...options, headers });

  // Handle Token Expiration (401 Unauthorized)
  if (response.status === 401 && refreshToken) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      response = await fetch(url, { ...options, headers });
    }
  }

  const json = await response.json();

  if (!response.ok || !json.success) {
    const error = new Error(json.error?.message || 'API Request Failed');
    error.code = json.error?.code || 'UNKNOWN_ERROR';
    error.status = response.status;
    throw error;
  }

  return json.data;
}

async function attemptTokenRefresh() {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setTokens(data.data.accessToken, data.data.refreshToken);
      return true;
    }
  } catch (err) {
    setTokens(null, null);
  }
  return false;
}
```

---

## 3. Frontend API File to Backend Route Mapping

| Frontend File (`frontend/src/api/`) | Current Implementation | Target Backend Routes (`backend/src/routes.js`) |
| :--- | :--- | :--- |
| `auth.js` | Simulated mock users | `POST /auth/login`, `POST /auth/mfa/verify`, `POST /auth/logout` |
| `vehiclesApi.js` | In-memory `mockData.js` | `GET /vehicles`, `POST /vehicles`, `PUT /vehicles/:id` |
| `driversApi.js` | In-memory `mockData.js` | `GET /drivers`, `POST /drivers`, `PUT /drivers/:id` |
| `rentalsApi.js` | In-memory `mockData.js` | `GET /rentals`, `POST /rentals`, `POST /rentals/:id/amend` |
| `inspectionsApi.js` | In-memory `mockData.js` | `GET /inspections`, `POST /inspections`, `POST /inspections/:id/photos` |
| `paymentsApi.js` | In-memory `mockData.js` | `GET /accounting/ledger`, `POST /accounting/payments` |
| `expensesApi.js` | In-memory `mockData.js` | `GET /expenses`, `POST /expenses` |
| `maintenanceApi.js` | In-memory `mockData.js` | `GET /maintenance`, `POST /maintenance` |
| `tollsApi.js` | In-memory `mockData.js` | `GET /tolls-tickets`, `POST /tolls-tickets/:id/charge-driver` |
| `insuranceApi.js` | In-memory `mockData.js` | `GET /insurance/policies`, `GET /insurance/claims` |
| `documentsApi.js` | In-memory `mockData.js` | `GET /documents`, `POST /documents/upload` |
| `usersApi.js` | In-memory `mockData.js` | `GET /users`, `POST /users/invite` |
| `vendorsApi.js` | In-memory `mockData.js` | `GET /vendors`, `POST /vendors` |
| `auditApi.js` | In-memory `mockData.js` | `GET /audit-logs` |

---

## 4. Data Adapter Pattern: Maintaining UI Stability

The frontend UI components expect camelCase object properties (e.g., `licensePlate`, `currentOdometer`, `weeklyRate`), whereas MySQL returns snake_case columns (`license_plate`, `current_odometer`, `weekly_rate`).

To guarantee that **zero UI component files are broken or require modification**, each API client wraps responses through an adapter transformer:

```javascript
// Example: frontend/src/api/vehiclesApi.js Adapter

export function transformVehicleFromDb(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    vin: row.vin,
    licensePlate: row.license_plate,
    make: row.make,
    model: row.model,
    year: row.year,
    status: row.status,
    currentOdometer: row.current_odometer,
    lastServiceOdometer: row.last_service_odometer,
    nextServiceOdometer: row.next_service_odometer,
    weeklyRate: parseFloat(row.weekly_rate),
    securityDeposit: parseFloat(row.security_deposit),
    registrationExpiration: row.registration_expiration,
    inspectionExpiration: row.inspection_expiration,
    notes: row.notes,
  };
}
```

---

## 5. Local Concurrent Testing Setup

To test both frontend and backend concurrently in Windows PowerShell:

### Terminal 1: Start Backend Server
```powershell
cd "d:\Kiaan Project\prime route2\backend"
npm run dev
```
- Listens on `http://localhost:5001`.
- Emits structured log: `PrimeRoute backend server listening on port 5001`.
- Verifies MySQL connection: `[DATABASE CONNECTED] Successfully connected to MySQL at 127.0.0.1:3307`.

### Terminal 2: Start Frontend Dev Server
```powershell
cd "d:\Kiaan Project\prime route2\frontend"
npm run dev
```
- Listens on `http://localhost:5173` (or port configured by Vite).
- Opens in web browser.

### CORS & Network Verification:
The backend `cors()` middleware specifically validates `FRONTEND_URL=http://localhost:3000` (or `http://localhost:5173`). Cross-origin requests with session cookies and Authorization headers succeed seamlessly without browser preflight blocking.
