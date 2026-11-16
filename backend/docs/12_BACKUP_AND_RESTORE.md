# PrimeRoute Backup & Disaster Recovery Guide

**One-line purpose:** Comprehensive operational procedures for automated MySQL dumps, persistent upload synchronization, off-server cold storage, and disaster recovery validation.  
**Last updated:** November 16, 2026  
**Status:** Complete  

---

## 1. Backup Strategy Overview

To safeguard business continuity, financial transactions, driver records, and contract e-signatures, PrimeRoute implements a two-tier backup policy:
1. **Relational Database Tier:** Automated daily logical dumps of the MySQL `primeroute` database via `mysqldump`.
2. **Physical Storage Tier:** Nightly synchronization of the `backend/uploads/` directory containing vehicle inspection photos, driver licenses, and signed paperwork.

---

## 2. Automated Daily Database Backup Script

### Windows PowerShell Implementation (`backup-database.ps1`)
```powershell
# Parameters
$backupDir = "D:\PrimeRoute_Backups\database"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$dumpFile = "$backupDir\primeroute_backup_$timestamp.sql"
$zipFile = "$backupDir\primeroute_backup_$timestamp.zip"

# Ensure target folder exists
if (!(Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force }

# Execute mysqldump (Point to local mysqldump.exe)
& "C:\xampp\mysql\bin\mysqldump.exe" -h 127.0.0.1 -P 3307 -u root primeroute --single-transaction --quick --routines --triggers > $dumpFile

# Compress SQL dump
Compress-Archive -Path $dumpFile -DestinationPath $zipFile
Remove-Item $dumpFile

Write-Host "Backup completed: $zipFile"
```

### Linux / Production Bash Implementation (`backup-database.sh`)
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/primeroute"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="primeroute_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

# Perform compressed single-transaction dump without table locking
mysqldump -h 127.0.0.1 -u primeroute_app -p'StrongPassword123!' \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  primeroute | gzip > "${BACKUP_DIR}/${FILENAME}"

# Sync to off-server Cloud Storage (AWS S3 / Google Cloud Storage)
aws s3 cp "${BACKUP_DIR}/${FILENAME}" s3://primeroute-backups/database/
```

---

## 3. Uploads Folder Backup

The `backend/uploads/` directory must be backed up concurrently:

```powershell
# Windows PowerShell
$sourceUploads = "d:\Kiaan Project\prime route2\backend\uploads"
$targetBackup = "D:\PrimeRoute_Backups\uploads"
robocopy $sourceUploads $targetBackup /MIR /R:2 /W:5
```

```bash
# Linux Bash (rsync to remote storage or AWS S3)
rsync -avz /var/www/primeroute/backend/uploads/ /mnt/backup_volume/uploads/
aws s3 sync /var/www/primeroute/backend/uploads/ s3://primeroute-backups/uploads/
```

---

## 4. Retention & Archival Recommendation

The recommended enterprise retention policy balances storage cost against compliance requirements:

| Tier | Frequency | Retention Window | Destination |
| :--- | :--- | :--- | :--- |
| **Hourly Transaction Logs** | Every 60 minutes | 48 Hours | Local NVMe SSD |
| **Daily Full Snapshots** | Once daily (01:00 AM) | 7 Days | On-server backup directory |
| **Weekly Archives** | Every Sunday | 4 Weeks | Off-server Cloud Bucket (S3 Standard) |
| **Monthly Milestones** | 1st day of month | 12 Months | Cloud Coldline / Glacier Storage |
| **Annual Tax / Audit Archive** | End of Fiscal Year | 7 Years (IRS / Legal) | Immutable WORM Cloud Vault |

---

## 5. Step-by-Step Restoration Procedure

In the event of database corruption or hardware failure, follow this exact restoration process:

### Step 1: Create or Purge Target Database
```sql
DROP DATABASE IF EXISTS primeroute;
CREATE DATABASE primeroute CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Restore the MySQL Dump
#### Windows PowerShell:
```powershell
# Using the live SQL dump or unzipped archive
Get-Content "D:\PrimeRoute_Backups\database\primeroute_backup_latest.sql" | & "C:\xampp\mysql\bin\mysql.exe" -h 127.0.0.1 -P 3307 -u root primeroute
```

#### Linux Bash:
```bash
gunzip < /var/backups/primeroute/primeroute_latest.sql.gz | mysql -u root -p primeroute
```

### Step 3: Restore Uploads Directory
Restore physical files from off-server archive back to `backend/uploads/`:
```bash
aws s3 sync s3://primeroute-backups/uploads/ /var/www/primeroute/backend/uploads/
```

### Step 4: Run Post-Restore Health Verification
Execute:
```powershell
npm run test
```
Verify that `GET /api/v1/health` responds with `{"success": true, "data": {"status": "ok", "db": "connected"}}`.

---

## 6. Disaster Recovery Test Checklist

Run this checklist semi-annually on a staging environment to confirm backup integrity:
- [ ] Backup file downloads completely from off-site storage without bit corruption.
- [ ] Database restores into an empty MySQL instance with 0 SQL errors.
- [ ] All 30 tables are present (`SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'primeroute'` returns 30+).
- [ ] Sample driver balances and vehicle VINs match pre-backup values.
- [ ] Sample photo URLs in `inspection_photos` correspond to existing files in `uploads/`.
- [ ] Application starts successfully and authenticates an existing user.
