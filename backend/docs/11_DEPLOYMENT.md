# PrimeRoute Production Deployment Guide

**One-line purpose:** Instructions for hosting, process management with PM2, reverse proxy HTTPS termination, isolated database security, and zero-downtime rollback strategies.  
**Last updated:** November 16, 2026  
**Status:** Partial (Local environment tested; Production server configuration documented as Not tested yet)  

---

## 1. Production Server Requirements

- **Operating System:** Ubuntu 22.04 LTS (or Windows Server 2022) *(Not tested yet on Ubuntu)*
- **Hardware Minimum:** 2 vCPU, 4 GB RAM, 40 GB NVMe Storage
- **Software Dependencies:**
  - Node.js v20.x LTS
  - MySQL Server 8.0+
  - PM2 Process Manager (`npm install -g pm2`)
  - Nginx (or Caddy) Reverse Proxy
  - Certbot (Let's Encrypt SSL/TLS)

---

## 2. Server Provisioning & Build Commands

Execute on the target production server:

```bash
# 1. Clone repository to deployment folder
git clone https://github.com/prernaverma0502-hash/prime-route-frontend.git /var/www/primeroute
cd /var/www/primeroute/backend

# 2. Install production dependencies only
npm ci --omit=dev

# 3. Create persistent directories
mkdir -p uploads/inspections uploads/documents uploads/paperwork

# 4. Run database migrations to apply latest schema
npm run migrate

# 5. Populate seed data if clean initial installation
npm run seed
```

---

## 3. Process Management via PM2

Create an `ecosystem.config.js` file in `backend/`:

```javascript
module.exports = {
  apps: [
    {
      name: 'primeroute-backend',
      script: 'src/server.js',
      instances: 'max',       // Cluster mode across available CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      }
    }
  ]
};
```

### PM2 Commands:
- **Start cluster:** `pm2 start ecosystem.config.js`
- **Check status:** `pm2 status`
- **View aggregated logs:** `pm2 logs primeroute-backend`
- **Zero-downtime reload:** `pm2 reload primeroute-backend`
- **Save startup on boot:** `pm2 save && pm2 startup`

*(Note: Cluster mode with PM2 is documented based on Express architecture standards; Not tested yet in this specific live workspace).*

---

## 4. Reverse Proxy & SSL/TLS Configuration (Nginx)

Nginx sits in front of Express, handling HTTPS certificate termination, static asset compression, and header proxying:

```nginx
server {
    listen 80;
    server_name api.primeroute.io;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.primeroute.io;

    ssl_certificate /etc/letsencrypt/live/api.primeroute.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.primeroute.io/privkey.pem;

    # SSL hardening protocols
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Uploads limit matching backend configuration (10MB)
    client_max_body_size 12M;

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5. Database Security & Isolation

1. **Private Binding:** MySQL must bind exclusively to `127.0.0.1` or a private VPC subnet IP (`bind-address = 127.0.0.1` in `/etc/mysql/mysql.conf.d/mysqld.cnf`). Never expose MySQL port 3306 publicly.
2. **Dedicated User Account:** The application connects using a dedicated non-root user (`primeroute_app`) with permissions restricted strictly to the `primeroute` database.
3. **Encrypted Transport:** Enable SSL/TLS encryption between Express and MySQL when connecting across cloud subnets (`ssl: { rejectUnauthorized: true }`).

---

## 6. Health Monitoring & Verification

Automated monitoring agents or uptime checkers (e.g. UptimeRobot, Datadog) should probe the dedicated health endpoint:

```bash
curl -f https://api.primeroute.io/api/v1/health
```

Expected HTTP status: `200 OK`. Any `503 Service Unavailable` response triggers immediate devops paging.

---

## 7. Zero-Downtime Rollback Procedure

If a deployed release introduces an unexpected regression:

```bash
cd /var/www/primeroute/backend

# 1. Roll back the Git commit
git checkout HEAD~1

# 2. Roll back the latest migration if a database schema change was involved
npm run migrate:rollback

# 3. Reinstall dependencies in case packages changed
npm ci --omit=dev

# 4. Gracefully reload cluster workers
pm2 reload primeroute-backend

# 5. Verify health check
curl -I http://127.0.0.1:5001/api/v1/health
```
*(Rollback script verified locally; Not tested yet on remote production host).*
