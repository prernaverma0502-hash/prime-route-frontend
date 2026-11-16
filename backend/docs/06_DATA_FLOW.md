# PrimeRoute Core Data & Operational Workflows

**One-line purpose:** Step-by-step lifecycle flows with Mermaid sequence and flow diagrams detailing endpoints, database tables, and business logic execution.  
**Last updated:** November 16, 2026  
**Status:** Complete  

---

## 1. Administrative User Invitation Flow

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Owner (Primary Admin)
    participant API as Backend API
    participant DB as MySQL Database
    participant Mailer as Nodemailer Service
    actor User as Invited Employee

    Owner->>API: POST /users/invite { email, role }
    API->>DB: Check if email exists in users or invitations
    API->>API: Generate random token & hash
    API->>DB: INSERT INTO invitations (email, token_hash, role, expires_at)
    API->>Mailer: Send invitation email with claim link
    API-->>Owner: 201 Created { message: "Invitation sent successfully" }

    User->>API: POST /auth/invitations/accept { token, password, fullName }
    API->>DB: SELECT * FROM invitations WHERE token_hash = ? AND accepted_at IS NULL
    API->>API: Verify token expiry (< 48 hours)
    API->>API: Hash user password with bcrypt
    API->>DB: INSERT INTO users (email, password_hash, full_name, role)
    API->>DB: UPDATE invitations SET accepted_at = NOW() WHERE id = ?
    API->>DB: INSERT INTO audit_logs (action: 'INVITATION_ACCEPTED')
    API-->>User: 201 Created { message: "Account created. Please log in." }
```

---

## 2. Vehicle & Driver Onboarding Flow

```mermaid
sequenceDiagram
    autonumber
    actor Staff as Fleet / Operations Staff
    participant API as Backend API
    participant DB as MySQL Database

    rect rgb(240, 248, 255)
    Note over Staff, DB: Vehicle Onboarding
    Staff->>API: POST /vehicles { vin, licensePlate, make, model, year, weeklyRate, securityDeposit }
    API->>DB: Check uniqueness: SELECT id FROM vehicles WHERE vin = ? OR license_plate = ?
    alt VIN or Plate already exists
        API-->>Staff: 409 Conflict ("Vehicle with this VIN/Plate already registered")
    else Valid New Vehicle
        API->>DB: INSERT INTO vehicles (vin, license_plate, make, model, year, status: 'available')
        API->>DB: INSERT INTO audit_logs (action: 'CREATE_VEHICLE')
        API-->>Staff: 201 Created { vehicleId: 101, status: 'available' }
    end
    end

    rect rgb(255, 250, 240)
    Note over Staff, DB: Driver Onboarding
    Staff->>API: POST /drivers { firstName, lastName, email, phone, licenseNumber, dob, address }
    API->>DB: Check uniqueness: SELECT id FROM drivers WHERE email = ? OR license_number = ?
    API->>DB: INSERT INTO drivers (driver_code, first_name, last_name, email, license_number, account_balance: 0.00, deposit_held: 0.00)
    API->>DB: INSERT INTO audit_logs (action: 'CREATE_DRIVER')
    API-->>Staff: 201 Created { driverId: 501, driverCode: 'DRV-501' }
    end
```

---

## 3. Rental Creation, Overlap Protection & Digital Signature Flow

```mermaid
sequenceDiagram
    autonumber
    actor Op as Rental Operations Staff
    participant API as Backend API
    participant DB as MySQL Database
    actor Driver as Customer (Driver)

    Op->>API: POST /rentals { vehicleId: 101, driverId: 501, startDate, endDate, weeklyRate, depositAmount }
    
    API->>DB: BEGIN TRANSACTION
    API->>DB: SELECT * FROM vehicles WHERE id = 101 FOR UPDATE
    API->>DB: SELECT id FROM rentals WHERE vehicle_id = 101 AND status IN ('active','awaiting_signature') AND start_date <= ? AND (end_date IS NULL OR end_date >= ?)
    
    alt Overlapping Rental Exists
        API->>DB: ROLLBACK
        API-->>Op: 409 Conflict ("Vehicle is already reserved or rented for this date range")
    else Dates Available
        API->>DB: INSERT INTO rentals (contract_number, vehicle_id, driver_id, start_date, end_date, weekly_rate, deposit_amount, status: 'awaiting_signature')
        API->>DB: UPDATE vehicles SET status = 'reserved' WHERE id = 101
        API->>DB: COMMIT
        API-->>Op: 201 Created { rentalId: 801, contractNumber: 'RNT-2026-0801' }
    end

    Driver->>API: POST /rentals/801/sign { signerType: 'driver', signerName, signatureData, ipAddress }
    API->>DB: INSERT INTO rental_signatures (rental_id, signer_type, signer_name, signature_data, ip_address, signed_at)
    API->>DB: UPDATE rentals SET status = 'active' WHERE id = 801
    API->>DB: UPDATE vehicles SET status = 'rented' WHERE id = 101
    API->>DB: INSERT INTO vehicle_assignments (vehicle_id, driver_id, assigned_at, status: 'active')
    API-->>Driver: 200 OK { message: "Contract signed and activated" }
```

---

## 4. Vehicle Pickup & Return Inspection Flow

```mermaid
sequenceDiagram
    autonumber
    actor Op as Rental Operations Staff
    participant API as Backend API
    participant DB as MySQL Database

    rect rgb(240, 255, 240)
    Note over Op, DB: Vehicle Pickup Handover
    Op->>API: POST /inspections { vehicleId: 101, rentalId: 801, inspectionType: 'pickup', odometer: 24500, fuelLevel: 1.00, checklist }
    API->>DB: INSERT INTO inspections (vehicle_id, rental_id, inspection_type, odometer, fuel_level, condition_checklist, status: 'passed')
    Op->>API: POST /inspections/901/photos (multipart walk-around photos)
    API->>DB: INSERT INTO inspection_photos (inspection_id, photo_url, photo_type)
    API->>DB: UPDATE vehicles SET current_odometer = 24500 WHERE id = 101
    API-->>Op: 201 Created { inspectionId: 901, status: 'passed' }
    end

    rect rgb(255, 245, 245)
    Note over Op, DB: Vehicle Return Intake
    Op->>API: POST /inspections { vehicleId: 101, rentalId: 801, inspectionType: 'return', odometer: 25700, fuelLevel: 0.75, checklist, existingDamages }
    API->>DB: INSERT INTO inspections (vehicle_id, rental_id, inspection_type: 'return', odometer: 25700, fuel_level: 0.75, status: 'flagged_damage')
    API->>DB: UPDATE vehicles SET current_odometer = 25700, status = 'available' WHERE id = 101
    API->>DB: UPDATE vehicle_assignments SET returned_at = NOW(), status = 'completed' WHERE vehicle_id = 101 AND status = 'active'
    API->>DB: UPDATE rentals SET status = 'completed' WHERE id = 801
    API-->>Op: 201 Created { inspectionId: 902, excessMileage: 200, damageFlagged: true }
    end
```

---

## 5. Billing, Ledger & Escrow Deposit Flow

```mermaid
sequenceDiagram
    autonumber
    actor Fin as Finance Staff
    participant API as Backend API
    participant DB as MySQL Database

    rect rgb(245, 245, 255)
    Note over Fin, DB: Security Deposit Intake (Escrow Liability)
    Fin->>API: POST /accounting/deposits { driverId: 501, rentalId: 801, amount: 500.00, paymentMethod: 'ach' }
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO ledger_entries (driver_id, rental_id, type: 'deposit', amount: 500.00, category: 'deposit_hold', balance_after)
    API->>DB: UPDATE drivers SET deposit_held = deposit_held + 500.00 WHERE id = 501
    API->>DB: COMMIT
    API-->>Fin: 201 Created { transactionRef: 'TXN-DEP-001', depositHeld: 500.00 }
    end

    rect rgb(255, 255, 240)
    Note over Fin, DB: Weekly Rental Billing Charge
    Fin->>API: POST /accounting/charges { driverId: 501, rentalId: 801, amount: 350.00, category: 'rental_fee' }
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO ledger_entries (driver_id, rental_id, type: 'charge', amount: 350.00, category: 'rental_fee', balance_after)
    API->>DB: UPDATE drivers SET account_balance = account_balance - 350.00 WHERE id = 501
    API->>DB: COMMIT
    API-->>Fin: 201 Created { transactionRef: 'TXN-CHG-001', newBalance: -350.00 }
    end

    rect rgb(240, 255, 255)
    Note over Fin, DB: Driver Rental Payment Receipt
    Fin->>API: POST /accounting/payments { driverId: 501, amount: 350.00, paymentMethod: 'credit_card' }
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO ledger_entries (driver_id, type: 'payment', amount: 350.00, category: 'driver_payment', balance_after)
    API->>DB: UPDATE drivers SET account_balance = account_balance + 350.00 WHERE id = 501
    API->>DB: COMMIT
    API-->>Fin: 201 Created { transactionRef: 'TXN-PAY-001', newBalance: 0.00 }
    end
```

---

## 6. Toll & Ticket Matching and Driver Charging Flow

```mermaid
sequenceDiagram
    autonumber
    actor Op as Operations Staff
    participant API as Backend API
    participant DB as MySQL Database

    Op->>API: POST /tolls-tickets { citationNumber: 'TX-TOLL-9912', vehicleId: 101, violationDatetime: '2026-11-10 14:22:00', fineAmount: 25.00, feeAmount: 15.00 }
    
    API->>DB: SELECT id, driver_id FROM rentals WHERE vehicle_id = 101 AND start_date <= '2026-11-10' AND (end_date IS NULL OR end_date >= '2026-11-10') AND status IN ('active','completed')
    
    alt Active Rental Matched for Vehicle
        API->>DB: INSERT INTO tolls_tickets (citation_number, vehicle_id, rental_id: 801, driver_id: 501, fine_amount: 25.00, fee_amount: 15.00, total_amount: 40.00, status: 'assigned')
        API-->>Op: 201 Created { ticketId: 301, matchedDriverId: 501, status: 'assigned' }
    else No Matching Rental (Fleet Expense)
        API->>DB: INSERT INTO tolls_tickets (citation_number, vehicle_id, total_amount: 40.00, status: 'unassigned')
        API-->>Op: 201 Created { ticketId: 301, status: 'unassigned' }
    end

    Note over Op, DB: Charge Matched Driver
    Op->>API: POST /tolls-tickets/301/charge-driver { driverId: 501, adminFee: 15.00 }
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO ledger_entries (driver_id: 501, rental_id: 801, type: 'charge', amount: 40.00, category: 'toll_violation')
    API->>DB: UPDATE drivers SET account_balance = account_balance - 40.00 WHERE id = 501
    API->>DB: UPDATE tolls_tickets SET status = 'charged', charged_ledger_entry_id = LAST_INSERT_ID() WHERE id = 301
    API->>DB: COMMIT
    API-->>Op: 200 OK { message: "Citation successfully charged to driver ledger" }
```

---

## 7. Incident, Accident & Insurance Claim Flow

```mermaid
sequenceDiagram
    autonumber
    actor Op as Operations Staff
    participant API as Backend API
    participant DB as MySQL Database

    Op->>API: POST /accidents { vehicleId: 101, driverId: 501, rentalId: 801, accidentDate: '2026-11-12', policeReportNumber: 'PR-8812', estimatedDamage: 3200.00 }
    API->>DB: INSERT INTO accidents (vehicle_id, driver_id, rental_id, accident_date, police_report_number, estimated_damage, status: 'reported')
    API->>DB: UPDATE vehicles SET status = 'maintenance' WHERE id = 101
    API-->>Op: 201 Created { accidentId: 601, status: 'reported' }

    Op->>API: POST /insurance/claims { accidentId: 601, policyId: 12, claimNumber: 'CLM-2026-904', claimAmount: 3200.00 }
    API->>DB: INSERT INTO insurance_claims (policy_id, accident_id, claim_number, claim_amount, status: 'submitted', filed_date: NOW())
    API->>DB: UPDATE accidents SET status = 'insurance_filed' WHERE id = 601
    API-->>Op: 201 Created { claimId: 701, status: 'submitted' }
```

---

## 8. Preventative Maintenance & The 5,000-Mile Oil Change Rule

```mermaid
flowchart TD
    Start([Inspection / Daily Odometer Update]) --> ReadOdo[Record Vehicle current_odometer]
    ReadOdo --> QueryDB[(Query vehicles table)]
    QueryDB --> CalcDelta{current_odometer >= next_service_odometer?}
    
    CalcDelta -- No --> Safe[Vehicle within safe service interval]
    CalcDelta -- Yes --> AlertTrigger[Trigger 5,000-Mile Service Alert]
    
    AlertTrigger --> RecordAlert[INSERT INTO alert_history: 'Oil Change Overdue']
    RecordAlert --> UpdateVeh[Update vehicles status: flag maintenance required]
    
    UpdateVeh --> WorkshopOrder[Staff issues Maintenance Order]
    WorkshopOrder --> WorkDone[Mechanic completes oil & filter change]
    
    WorkDone --> CloseRecord[POST /maintenance record: totalCost, serviceOdometer]
    CloseRecord --> Recalc[Update next_service_odometer = current_odometer + 5000]
    Recalc --> ResolveAlert[Mark alert_history is_resolved = 1]
    ResolveAlert --> ReturnFleet[Restore vehicle status to 'available']
```
