# Deployment Guide - Hostinger VPS

This guide covers deploying the Ekidna backend to a Hostinger VPS.

## Prerequisites

- Hostinger VPS with Ubuntu 20.04+ or similar
- SSH access to your VPS
- Domain name (optional, but recommended)
- SSL certificate (Let's Encrypt recommended)

## Server Requirements

- **CPU:** 1+ cores
- **RAM:** 2GB minimum, 4GB recommended
- **Storage:** 10GB minimum
- **OS:** Ubuntu 20.04+ or Debian 11+

## Step 1: Initial Server Setup

### 1.1 Connect to VPS

```bash
ssh root@your-server-ip
```

### 1.2 Update System

```bash
apt update && apt upgrade -y
```

### 1.3 Create Non-Root User

```bash
adduser ekidna
usermod -aG sudo ekidna
su - ekidna
```

### 1.4 Setup Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 2: Install Dependencies

### 2.1 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 2.2 Install Git

```bash
sudo apt install git -y
```

### 2.3 Install Node.js (optional, for local testing)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```

## Step 3: Deploy Application

### 3.1 Clone Repository

```bash
cd /home/ekidna
git clone https://github.com/your-repo/ekidna2.git
cd ekidna2
```

### 3.2 Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

Update the following variables:

```env
# Database - Use strong passwords!
DB_NAME=ekidna_db
DB_USER=ekidna_user
DB_PASSWORD=your-very-strong-password-here

# Backend
NODE_ENV=production
PORT=3001

# JWT - Generate a strong secret!
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@ekidna.org

# Frontend URL (your actual domain)
FRONTEND_URL=https://ekidna.org
```

To generate a secure JWT secret:

```bash
openssl rand -base64 32
```

### 3.3 Update docker-compose for Production

Edit `docker-compose.yml` to remove Adminer (optional) and adjust settings:

```bash
nano docker-compose.yml
```

Remove or comment out the Adminer service:

```yaml
# Comment out or remove this section
#  adminer:
#    image: adminer:latest
#    ...
```

### 3.4 Start Services

```bash
# Build and start containers
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f
```

## Step 4: Setup Nginx Reverse Proxy

### 4.1 Install Nginx

```bash
sudo apt install nginx -y
```

### 4.2 Configure Nginx for Backend

Create configuration file:

```bash
sudo nano /etc/nginx/sites-available/ekidna-api
```

Add configuration:

```nginx
server {
    listen 80;
    server_name api.ekidna.org;  # Change to your domain

    # API Backend
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001/api/health;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/ekidna-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4.3 Configure Nginx for Frontend

If you're serving the website and MVP from the same VPS:

```bash
sudo nano /etc/nginx/sites-available/ekidna-frontend
```

```nginx
# Main Website
server {
    listen 80;
    server_name ekidna.org www.ekidna.org;
    root /home/ekidna/ekidna2/website/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# MVP Dashboard
server {
    listen 80;
    server_name mvp.ekidna.org;
    root /home/ekidna/ekidna2/MVP/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/ekidna-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 5: Setup SSL with Let's Encrypt

### 5.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 5.2 Obtain SSL Certificates

```bash
# For API
sudo certbot --nginx -d api.ekidna.org

# For website
sudo certbot --nginx -d ekidna.org -d www.ekidna.org

# For MVP
sudo certbot --nginx -d mvp.ekidna.org
```

### 5.3 Verify Auto-Renewal

```bash
sudo certbot renew --dry-run
```

## Step 6: Build and Deploy Frontend

### 6.1 Build Website

```bash
cd /home/ekidna/ekidna2/website
npm install
npm run build
```

### 6.2 Build MVP

```bash
cd /home/ekidna/ekidna2/MVP
npm install
npm run build
```

### 6.3 Update Frontend API URL

Before building, update the API URL in both frontends.

**For MVP** (`MVP/src/utils/api.js` or similar):

```javascript
const API_BASE_URL = 'https://api.ekidna.org/api';
```

**For Website** (`website/src/config.js` or similar):

```javascript
const API_BASE_URL = 'https://api.ekidna.org/api';
```

## Step 7: Setup Auto-Start on Reboot

Docker containers are already configured with `restart: unless-stopped` in docker-compose.yml, so they'll auto-start.

To ensure Docker starts on boot:

```bash
sudo systemctl enable docker
```

## Step 8: Database Backup Setup

### 8.1 Create Backup Script

```bash
mkdir -p /home/ekidna/backups
nano /home/ekidna/backup-db.sh
```

Add:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ekidna/backups"
DB_CONTAINER="ekidna_db"
DB_NAME="ekidna_db"
DB_USER="ekidna_user"

# Create backup
docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_DIR/ekidna_backup_$DATE.sql.gz"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "ekidna_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: ekidna_backup_$DATE.sql.gz"
```

Make executable:

```bash
chmod +x /home/ekidna/backup-db.sh
```

### 8.2 Setup Cron Job

```bash
crontab -e
```

Add (daily backup at 2 AM):

```bash
0 2 * * * /home/ekidna/backup-db.sh >> /home/ekidna/backups/backup.log 2>&1
```

## Step 9: Monitoring and Logs

### View Application Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Database only
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100
```

### Monitor Resources

```bash
# Docker stats
docker stats

# System resources
htop
```

### Setup Log Rotation

Create `/etc/logrotate.d/ekidna`:

```bash
sudo nano /etc/logrotate.d/ekidna
```

Add:

```
/home/ekidna/ekidna2/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 ekidna ekidna
    sharedscripts
}
```

## Step 10: Security Hardening

### 10.1 Disable Root SSH Login

```bash
sudo nano /etc/ssh/sshd_config
```

Set:

```
PermitRootLogin no
PasswordAuthentication no
```

Restart SSH:

```bash
sudo systemctl restart sshd
```

### 10.2 Install Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 10.3 Setup UFW Rules

```bash
# Allow only necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 11: Change Default Admin Password

1. Login to MVP at https://mvp.ekidna.org
2. Use credentials:
   - Email: admin@ekidna.org
   - Password: admin123
3. Go to settings and change password immediately!

## Updating the Application

### Update Backend

```bash
cd /home/ekidna/ekidna2

# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# View logs to ensure it started correctly
docker-compose logs -f backend
```

### Update Frontend

```bash
cd /home/ekidna/ekidna2

# Pull latest changes
git pull

# Rebuild website
cd website
npm install
npm run build

# Rebuild MVP
cd ../MVP
npm install
npm run build
```

## Troubleshooting

### Backend not responding

```bash
# Check if container is running
docker-compose ps

# Check logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Database connection errors

```bash
# Check database logs
docker-compose logs db

# Verify database is running
docker-compose ps db

# Connect to database manually
docker exec -it ekidna_db psql -U ekidna_user -d ekidna_db
```

### Email not sending

- Check email credentials in `.env`
- Verify Gmail App Password is correct
- Check firewall allows outbound SMTP (port 587)

### Cannot access API

- Verify Nginx is running: `sudo systemctl status nginx`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Verify DNS records point to your VPS IP
- Check SSL certificate: `sudo certbot certificates`

## Performance Optimization

### Enable Nginx Caching

Add to Nginx config:

```nginx
location /api {
    # Cache GET requests for 5 minutes
    proxy_cache_valid 200 5m;
    proxy_cache_bypass $http_cache_control;
    ...
}
```

### Database Optimization

```bash
docker exec -it ekidna_db psql -U ekidna_user -d ekidna_db
```

Run:

```sql
-- Analyze tables
ANALYZE;

-- Create additional indexes if needed
CREATE INDEX IF NOT EXISTS idx_subscribers_email_status ON subscribers(email, status);
```

## Monitoring Tools

### Setup Uptime Monitoring

Consider using:
- UptimeRobot (free, external monitoring)
- Prometheus + Grafana (advanced, self-hosted)

### Simple Health Check Script

```bash
nano /home/ekidna/health-check.sh
```

```bash
#!/bin/bash
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): API is healthy"
else
    echo "$(date): API is down! Response code: $RESPONSE"
    # Restart if down
    cd /home/ekidna/ekidna2 && docker-compose restart backend
fi
```

Add to crontab (every 5 minutes):

```bash
*/5 * * * * /home/ekidna/health-check.sh >> /home/ekidna/health-check.log 2>&1
```

## Support

For issues or questions:
- Check backend logs: `docker-compose logs backend`
- Check database logs: `docker-compose logs db`
- Review Nginx logs: `sudo tail -f /var/log/nginx/error.log`

## License

MIT License - Ekidna APS
