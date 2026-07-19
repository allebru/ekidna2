# Ekidna2 Backend - Project Summary

## What Has Been Built

A complete, production-ready backend system for the Ekidna APS subscription management platform.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Ekidna2 System                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │   Website    │         │     MVP      │                │
│  │  (Public)    │         │  (Staff)     │                │
│  │              │         │              │                │
│  │ - Chi Siamo  │         │ - Dashboard  │                │
│  │ - Eventi     │         │ - Login      │                │
│  │ - Galleria   │         │ - Manage     │                │
│  │ - Contatti   │         │   Users      │                │
│  │ - Iscriviti  │         │ - Stats      │                │
│  └──────┬───────┘         └──────┬───────┘                │
│         │                        │                         │
│         └────────┬───────────────┘                         │
│                  │                                          │
│                  ▼                                          │
│         ┌────────────────┐                                 │
│         │  Backend API   │                                 │
│         │  (Express.js)  │                                 │
│         │                │                                 │
│         │ - Auth (JWT)   │                                 │
│         │ - CRUD APIs    │                                 │
│         │ - Email Service│                                 │
│         │ - Validation   │                                 │
│         └────────┬───────┘                                 │
│                  │                                          │
│                  ▼                                          │
│         ┌────────────────┐                                 │
│         │  PostgreSQL    │                                 │
│         │   Database     │                                 │
│         │                │                                 │
│         │ - subscribers  │                                 │
│         │ - staff_users  │                                 │
│         │ - activity_logs│                                 │
│         └────────────────┘                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
ekidna2/
├── backend/                      # NEW: Self-hosted backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # PostgreSQL connection pool
│   │   │   ├── email.js         # Nodemailer + email templates
│   │   │   └── jwt.js           # JWT token management
│   │   ├── controllers/
│   │   │   ├── authController.js          # Login, password change
│   │   │   └── subscriberController.js    # CRUD operations
│   │   ├── models/
│   │   │   ├── Subscriber.js    # Subscriber database model
│   │   │   ├── StaffUser.js     # Staff user model
│   │   │   └── ActivityLog.js   # Activity logging model
│   │   ├── routes/
│   │   │   ├── auth.js          # Auth routes
│   │   │   ├── subscribers.js   # Subscriber routes
│   │   │   └── index.js         # Route aggregator
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT authentication
│   │   │   ├── validation.js    # Input validation
│   │   │   └── errorHandler.js  # Error handling
│   │   ├── services/
│   │   │   └── emailService.js  # Email sending service
│   │   ├── utils/
│   │   │   └── hashPassword.js  # Password hashing utility
│   │   └── server.js            # Express app entry point
│   ├── migrations/
│   │   └── init.sql             # Database schema
│   ├── Dockerfile               # Docker container config
│   ├── package.json
│   ├── .dockerignore
│   ├── .gitignore
│   └── README.md
│
├── MVP/                         # Staff management dashboard
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js          # NEW: API client for Docker backend
│   │   └── ...                 # (existing React components)
│   ├── .env.example            # NEW: Environment template
│   └── package.json
│
├── website/                     # Public website
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js          # NEW: API client for subscriptions
│   │   └── ...                 # (existing React components)
│   ├── .env.example            # NEW: Environment template
│   └── package.json
│
├── docker-compose.yml           # NEW: Docker orchestration
├── .env.example                 # NEW: Main environment template
├── .gitignore                   # NEW: Git ignore rules
├── README.md                    # NEW: Main documentation
├── DEPLOYMENT.md                # NEW: VPS deployment guide
├── MIGRATION_GUIDE.md           # NEW: Supabase → Docker migration
├── PROJECT_SUMMARY.md           # This file
└── quick-start.sh              # NEW: Quick setup script
```

## Backend Components

### 1. Database (PostgreSQL)

**Tables:**
- `staff_users` - Staff authentication and management
- `subscribers` - Subscription data
- `activity_logs` - Audit trail for all actions

**Features:**
- UUID primary keys
- Soft delete support (status-based)
- Automatic timestamps (created_at, updated_at)
- Indexes for performance
- Foreign key relationships

### 2. API Endpoints

#### Public Endpoints
- `POST /api/subscribers` - Create new subscription (from website)

#### Authentication Endpoints
- `POST /api/auth/login` - Staff login (returns JWT)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/change-password` - Change password

#### Protected Endpoints (require JWT)
- `GET /api/subscribers` - List all subscribers (paginated)
- `GET /api/subscribers/:id` - Get subscriber details
- `PUT /api/subscribers/:id` - Update subscriber
- `DELETE /api/subscribers/:id` - Soft delete subscriber
- `POST /api/subscribers/:id/restore` - Restore deleted subscriber
- `GET /api/subscribers/stats` - Get statistics
- `GET /api/subscribers/year/:year` - Get subscribers by year

### 3. Email Service

**Features:**
- Nodemailer integration
- Gmail support (with App Password)
- Custom SMTP support
- Two email templates:
  1. **Subscription Confirmation** - Sent to new subscribers
  2. **Staff Notification** - Sent to staff when new subscription arrives

**Templates:**
- Italian language
- Responsive HTML design
- Plain text fallback
- Ekidna branding (yellow #FDB813)

### 4. Authentication & Security

**Authentication:**
- JWT tokens (Bearer authentication)
- Token expiration (configurable, default 7 days)
- Password hashing with bcrypt (10 rounds)

**Security Features:**
- Helmet.js for security headers
- CORS configuration
- Input validation (express-validator)
- SQL injection prevention (parameterized queries)
- XSS protection
- Rate limiting ready
- Environment variable protection

### 5. Middleware

**Authentication Middleware:**
- `authenticateToken` - Verify JWT and attach user to request
- `requireAdmin` - Check admin role

**Validation Middleware:**
- Subscriber data validation
- Login data validation
- UUID validation
- Query parameter validation

**Error Handling:**
- Global error handler
- PostgreSQL error mapping
- 404 handler
- Development vs production error details

## Docker Configuration

### Services

1. **PostgreSQL Database (db)**
   - Image: postgres:16-alpine
   - Port: 5432
   - Volume: postgres_data (persistent)
   - Health check enabled
   - Auto-restart: unless-stopped

2. **Backend API (backend)**
   - Custom Dockerfile (Node.js 20-alpine)
   - Port: 3001
   - Depends on: database
   - Environment: from .env file
   - Health check enabled
   - Auto-restart: unless-stopped

3. **Adminer (adminer)** - Optional, for development
   - Database management UI
   - Port: 8080
   - Lightweight PostgreSQL admin tool

### Networking

- Custom bridge network: `ekidna_network`
- Internal service communication
- Exposed ports: 3001 (API), 5432 (DB), 8080 (Adminer)

## Environment Configuration

### Required Variables

```env
# Database
DB_NAME=ekidna_db
DB_USER=ekidna_user
DB_PASSWORD=<strong-password>

# Backend
NODE_ENV=production
PORT=3001

# JWT
JWT_SECRET=<32+ character random string>
JWT_EXPIRES_IN=7d

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<gmail-address>
EMAIL_PASSWORD=<gmail-app-password>
EMAIL_FROM=noreply@ekidna.org

# Frontend
FRONTEND_URL=https://ekidna.org
```

## Default Admin Account

**Email:** admin@ekidna.org
**Password:** admin123

⚠️ **SECURITY:** Change this password immediately after first deployment!

## API Features

### Pagination
All list endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50, max: 100)

### Filtering
Subscribers endpoint supports:
- `status` - Filter by status (active, deleted, pending)
- `subscription_year` - Filter by year
- `search` - Search by name or email

### Sorting
Default: Most recent first (created_at DESC)

### Response Format

Success response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

Error response:
```json
{
  "error": "Error message here",
  "details": "..." // (development only)
}
```

## Deployment Options

### 1. Local Development
```bash
docker-compose up -d
cd MVP && npm run dev
cd website && npm run dev
```

### 2. VPS Production (Hostinger)
- Docker Compose for backend
- Nginx reverse proxy
- Let's Encrypt SSL
- Systemd for auto-start
- See: DEPLOYMENT.md

### 3. Cloud Platforms
Works on:
- AWS EC2 + RDS
- DigitalOcean Droplets
- Google Cloud Compute
- Azure VM
- Linode
- Any VPS with Docker support

## Performance Considerations

### Database
- Indexed columns for fast queries
- Connection pooling (max 20 connections)
- Prepared statements (SQL injection safe)

### API
- Compression enabled (gzip)
- CORS caching
- Health check endpoint
- Graceful shutdown handling

### Scalability
Ready for:
- Load balancer (multiple backend instances)
- Database replication (read replicas)
- Redis caching (add if needed)
- CDN for static assets

## Monitoring & Logging

### Logs
- Console logging (stdout/stderr)
- Docker logs: `docker-compose logs -f`
- Activity logs in database

### Health Checks
- API: `/api/health`
- Database: PostgreSQL health check
- Docker health checks configured

### Backup Strategy
- Automated daily backups (cron job)
- 7-day retention
- pg_dump format (compressed)
- Easy restore process

## Migration from Supabase

Complete migration guide available: `MIGRATION_GUIDE.md`

**Key Benefits:**
- Full control over data
- No monthly costs
- Better privacy
- Lower latency
- Easy customization

**Migration Steps:**
1. Export data from Supabase
2. Update frontend API clients
3. Test locally
4. Deploy to VPS
5. Migrate data
6. Switch DNS
7. Monitor

## Testing

### Manual Testing
```bash
# Health check
curl http://localhost:3001/api/health

# Create subscriber
curl -X POST http://localhost:3001/api/subscribers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subscription_year":2025}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ekidna.org","password":"admin123"}'
```

### Automated Testing
Ready for:
- Jest unit tests
- Supertest API tests
- Playwright E2E tests

## Documentation

1. **README.md** - Main project overview
2. **backend/README.md** - Backend API documentation
3. **DEPLOYMENT.md** - VPS deployment guide
4. **MIGRATION_GUIDE.md** - Supabase migration
5. **PROJECT_SUMMARY.md** - This document

## Future Enhancements

Potential additions:
- [ ] Password reset functionality
- [ ] Multi-factor authentication (2FA)
- [ ] PDF export of subscriber lists
- [ ] CSV import/export
- [ ] Email templates customization UI
- [ ] Analytics dashboard
- [ ] Mobile app API support
- [ ] Webhook integrations
- [ ] Payment gateway integration
- [ ] Multi-language support

## Technology Choices

### Why PostgreSQL?
- Robust and reliable
- ACID compliance
- Full SQL support
- Great Docker support
- Free and open source

### Why Express.js?
- Mature and stable
- Large ecosystem
- Easy to understand
- Great middleware support
- Performance proven

### Why JWT?
- Stateless authentication
- Mobile-friendly
- No session storage needed
- Industry standard
- Easy to scale

### Why Docker?
- Consistent environments
- Easy deployment
- Service isolation
- Portable
- Production-ready

### Why Nodemailer?
- Flexible email sending
- Multiple transport support
- HTML templates
- Attachments support
- Well documented

## License

MIT License - Ekidna APS

## Support

For questions or issues:
1. Check documentation files
2. Review Docker logs
3. Test API endpoints
4. Check database connection
5. Verify environment variables

## Credits

Built for Ekidna APS - Italian non-profit organization
Backend architecture designed for reliability, security, and ease of deployment.

---

**Status:** ✅ Complete and ready for deployment
**Last Updated:** 2025-10-23
**Version:** 1.0.0
