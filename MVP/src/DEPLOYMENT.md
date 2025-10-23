# Deployment Guide

## Current MVP (Supabase)

The current MVP is deployed using Figma Make's Supabase integration. This is suitable for prototyping and testing.

### MVP Deployment
- Frontend: Deployed automatically via Figma Make
- Backend: Supabase managed services
- Database: Supabase PostgreSQL

### Limitations
- Vendor lock-in to Supabase
- Limited customization
- Ongoing costs scale with usage
- Less control over infrastructure

---

## Future Production (Docker)

For the final production deployment, you'll use Docker for complete control.

### Prerequisites
- Server with Docker and Docker Compose installed
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- Minimum 2GB RAM, 20GB storage

### Deployment Architecture

```
┌─────────────────────────────────────┐
│         Load Balancer/Nginx         │
│         (SSL Termination)           │
└────────────┬────────────────────────┘
             │
             ├─► Frontend (Static Files)
             │
             └─► Backend API (Docker)
                    │
                    └─► PostgreSQL (Docker)
```

### Step 1: Server Setup

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Clone and Configure

```bash
# Clone repository
git clone <your-repo>
cd ekidna-aps

# Create environment file
cp .env.example .env

# Edit environment variables
nano .env
```

### Step 3: Environment Variables

```env
# Backend
DATABASE_URL=postgresql://ekidna_user:SECURE_PASSWORD_HERE@postgres:5432/ekidna_aps
JWT_SECRET=GENERATE_RANDOM_SECRET_HERE
NODE_ENV=production
PORT=3000

# Database
POSTGRES_DB=ekidna_aps
POSTGRES_USER=ekidna_user
POSTGRES_PASSWORD=SECURE_PASSWORD_HERE

# Frontend
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### Step 4: Build and Deploy

```bash
# Build frontend
npm run build

# Start backend services
cd backend
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### Step 5: Nginx Configuration

```nginx
# /etc/nginx/sites-available/ekidna-aps
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    root /var/www/ekidna-aps/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
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
}
```

### Step 6: SSL Certificate

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

### Step 7: Database Migration

If you have existing data in Supabase:

```bash
# Export from Supabase
# (Use Supabase dashboard or CLI)

# Import to Docker PostgreSQL
docker-compose exec postgres psql -U ekidna_user -d ekidna_aps -f /path/to/dump.sql
```

---

## Production Checklist

### Security
- [ ] Change all default passwords
- [ ] Generate strong JWT secret
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall (allow only 80, 443, 22)
- [ ] Set up fail2ban for SSH protection
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Enable CORS properly

### Performance
- [ ] Enable gzip compression in nginx
- [ ] Configure caching headers
- [ ] Optimize database indexes
- [ ] Set up connection pooling
- [ ] Monitor resource usage

### Reliability
- [ ] Set up automated backups
- [ ] Configure log rotation
- [ ] Set up health checks
- [ ] Configure auto-restart on failure
- [ ] Monitor disk space

### Monitoring
- [ ] Set up application logging
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure database monitoring
- [ ] Set up alerts for critical issues

---

## Backup Strategy

### Database Backups

```bash
# Create backup script
#!/bin/bash
# /opt/backups/backup-ekidna.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/ekidna"
mkdir -p $BACKUP_DIR

docker-compose exec -T postgres pg_dump -U ekidna_user ekidna_aps > "$BACKUP_DIR/backup_$DATE.sql"

# Compress
gzip "$BACKUP_DIR/backup_$DATE.sql"

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

### Automated Backups

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /opt/backups/backup-ekidna.sh

# Weekly full backup (keep offsite)
0 3 * * 0 /opt/backups/backup-ekidna.sh && rsync -avz /opt/backups/ekidna/ remote-server:/backups/ekidna/
```

### Restore from Backup

```bash
# Stop the application
docker-compose down

# Restore database
gunzip backup_20250121_020000.sql.gz
docker-compose exec -T postgres psql -U ekidna_user -d ekidna_aps < backup_20250121_020000.sql

# Restart
docker-compose up -d
```

---

## Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild frontend
npm run build

# Restart backend
cd backend
docker-compose down
docker-compose up -d --build
```

### Monitor Logs

```bash
# Backend logs
docker-compose logs -f api

# Database logs
docker-compose logs -f postgres

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Database Maintenance

```bash
# Connect to database
docker-compose exec postgres psql -U ekidna_user -d ekidna_aps

# Vacuum and analyze
VACUUM ANALYZE;

# Check database size
SELECT pg_size_pretty(pg_database_size('ekidna_aps'));

# Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname NOT IN ('pg_catalog', 'information_schema') 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Scaling

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database configuration
- Enable database caching (Redis)

### Horizontal Scaling
- Load balance multiple backend instances
- Separate database server
- Use read replicas for PostgreSQL
- Implement CDN for static assets

---

## Troubleshooting

### Application Won't Start
```bash
# Check Docker status
docker-compose ps

# View logs
docker-compose logs

# Restart services
docker-compose restart
```

### Database Connection Issues
```bash
# Check database is running
docker-compose exec postgres pg_isready

# Check connection from backend
docker-compose exec api nc -zv postgres 5432

# Verify credentials
docker-compose exec postgres psql -U ekidna_user -d ekidna_aps
```

### High Memory Usage
```bash
# Check resource usage
docker stats

# Limit container resources in docker-compose.yml
services:
  postgres:
    deploy:
      resources:
        limits:
          memory: 1G
```

---

## Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Check network connectivity
4. Review firewall rules
5. Contact system administrator

---

**Note**: This deployment guide is for the Docker-based production version. See [DOCKER_MIGRATION.md](DOCKER_MIGRATION.md) for migration details.
