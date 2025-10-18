# Runic CMS - Deployment Guide

Complete guide for deploying Runic CMS to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Docker Deployment](#docker-deployment)
3. [Vercel + Supabase](#vercel--supabase)
4. [VPS/Cloud Server](#vpscloud-server)
5. [Kubernetes](#kubernetes)
6. [Environment Variables](#environment-variables)
7. [Security Hardening](#security-hardening)
8. [Monitoring & Backups](#monitoring--backups)

---

## Pre-Deployment Checklist

Before deploying to production:

### Security
- [ ] Change all default passwords
- [ ] Generate strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Review API rate limits
- [ ] Set up firewall rules

### Configuration
- [ ] Set NODE_ENV=production
- [ ] Configure production database
- [ ] Set up email service (future)
- [ ] Configure CDN for media files
- [ ] Set up error logging

### Testing
- [ ] Test all pages load correctly
- [ ] Test admin functionality
- [ ] Test on multiple devices
- [ ] Run security scan
- [ ] Load testing

### Backup
- [ ] Database backup strategy
- [ ] Media files backup
- [ ] Configuration backup
- [ ] Disaster recovery plan

---

## Docker Deployment

### Option 1: Docker Compose (Simplest)

**Best for**: Small to medium sites, VPS, dedicated server

```bash
# 1. Clone repository
git clone https://github.com/yourusername/runic-cms.git
cd runic-cms/docker-aio

# 2. Create production environment file
cat > .env << EOF
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

# 3. Build and start
docker-compose up -d

# 4. Check logs
docker-compose logs -f
```

**With custom domain:**

```yaml
# docker-compose.yml - add labels for Traefik
services:
  runic-cms:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.runic.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.runic.entrypoints=websecure"
      - "traefik.http.routers.runic.tls.certresolver=letsencrypt"
```

### Option 2: Docker Swarm

**Best for**: High availability, load balancing

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml runic

# Scale services
docker service scale runic_runic-cms=3

# Update service
docker service update --image runic-cms:latest runic_runic-cms
```

### Reverse Proxy with Nginx

```nginx
# /etc/nginx/sites-available/runic-cms
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Media files
    location /uploads {
        alias /var/runic-cms/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Vercel + Supabase

**Best for**: Serverless, auto-scaling, global distribution

### Step 1: Setup Supabase

```bash
# 1. Create Supabase project at supabase.com
# 2. Go to SQL Editor
# 3. Run schema from backend-guide/supabase-schema.sql
# 4. Note your project URL and anon key
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Follow prompts and configure:
# - Project name: runic-cms
# - Framework: Next.js
# - Build command: npm run build
# - Output directory: .next
```

### Step 3: Configure Environment Variables

In Vercel dashboard, add:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Custom Domain

```bash
# Add domain in Vercel dashboard
vercel domains add yourdomain.com

# Update DNS records as instructed
```

### Production Optimizations

**Vercel Configuration** (`vercel.json`):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        }
      ]
    }
  ]
}
```

---

## VPS/Cloud Server

**Best for**: Full control, custom requirements

### Prerequisites

- Ubuntu 22.04 LTS (or similar)
- 2GB+ RAM
- 20GB+ disk space
- Root/sudo access

### Installation

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 4. Install Nginx
sudo apt install -y nginx

# 5. Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# 6. Create database
sudo -u postgres psql
CREATE DATABASE runic_cms;
CREATE USER runic WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE runic_cms TO runic;
\q

# 7. Clone and setup project
cd /var/www
git clone https://github.com/yourusername/runic-cms.git
cd runic-cms

# 8. Install dependencies
npm run install:all

# 9. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit files with your configuration

# 10. Initialize database
psql -U runic -d runic_cms -f backend/src/db/schema.sql

# 11. Build applications
npm run build

# 12. Install PM2 for process management
sudo npm install -g pm2

# 13. Start services
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'runic-backend',
      cwd: './backend',
      script: 'dist/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'runic-frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
```

### SSL Configuration

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal:
sudo certbot renew --dry-run
```

---

## Kubernetes

**Best for**: Enterprise, microservices, high scale

### Deployment Files

**backend-deployment.yaml:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: runic-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: runic-backend
  template:
    metadata:
      labels:
        app: runic-backend
    spec:
      containers:
      - name: backend
        image: your-registry/runic-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: runic-secrets
              key: db-host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: runic-secrets
              key: db-password
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: runic-secrets
              key: jwt-secret
```

**frontend-deployment.yaml:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: runic-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: runic-frontend
  template:
    metadata:
      labels:
        app: runic-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/runic-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXT_PUBLIC_API_URL
          value: "https://api.yourdomain.com"
```

**ingress.yaml:**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: runic-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - yourdomain.com
    secretName: runic-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: runic-backend
            port:
              number: 3001
      - path: /
        pathType: Prefix
        backend:
          service:
            name: runic-frontend
            port:
              number: 3000
```

---

## Environment Variables

### Backend Production Variables

```env
# Server
NODE_ENV=production
PORT=3001
BASE_URL=https://yourdomain.com

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=runic_cms
DB_USER=runic
DB_PASSWORD=<strong-password>

# Security
JWT_SECRET=<strong-random-secret>

# CORS
FRONTEND_URL=https://yourdomain.com

# File Upload
UPLOAD_DIR=/var/runic-cms/uploads
MAX_FILE_SIZE=10485760

# Email (future)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=<password>
```

### Frontend Production Variables

```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NODE_ENV=production
```

---

## Security Hardening

### 1. Database Security

```sql
-- Remove default postgres user privileges
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO runic;

-- Enable SSL connections only
ALTER SYSTEM SET ssl = on;

-- Set strong password policy
ALTER ROLE runic WITH PASSWORD 'strong_password' VALID UNTIL 'infinity';
```

### 2. Application Security

```javascript
// backend/src/index.ts additions

// Rate limiting
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use('/api/', limiter)

// Additional security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))
```

### 3. Server Security

```bash
# Firewall
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable

# Fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## Monitoring & Backups

### Database Backups

```bash
# Create backup script
cat > /usr/local/bin/backup-runic.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/runic-cms"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -U runic runic_cms | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Media backup
tar -czf $BACKUP_DIR/media_$DATE.tar.gz /var/runic-cms/uploads

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-runic.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-runic.sh
```

### Monitoring with PM2

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true

# Monitor
pm2 monit
```

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake
- Better Uptime

---

## Troubleshooting

### Service won't start

```bash
# Check logs
pm2 logs
docker-compose logs

# Check ports
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :3001

# Check environment
pm2 env 0
```

### Database connection issues

```bash
# Test connection
psql -U runic -h localhost -d runic_cms

# Check PostgreSQL status
sudo systemctl status postgresql

# Check logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### High memory usage

```bash
# Check processes
pm2 list
docker stats

# Restart services
pm2 restart all
docker-compose restart
```

---

## Support

- **Documentation**: See README.md and other guides
- **Issues**: https://github.com/yourusername/runic-cms/issues
- **Community**: Discord / Forum links

---

**Happy Deploying! 🚀**
