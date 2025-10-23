# Ekidna2 - Subscription Management System

Complete web application for **Ekidna APS**, an Italian non-profit organization, to manage member subscriptions.

## Overview

This project consists of:

1. **Public Website** - Information website where users can subscribe
2. **MVP Dashboard** - Staff management portal for viewing and managing subscriptions
3. **Backend API** - RESTful API with PostgreSQL database and email notifications

## Features

### Public Website
- Information pages (Chi Siamo, Eventi, Galleria, etc.)
- Subscription form
- Responsive design
- Italian language

### MVP Dashboard
- Staff authentication (JWT)
- View all subscribers with pagination
- Search and filter capabilities
- Create, update, and soft-delete subscribers
- Statistics dashboard
- Activity logs
- Dark theme UI (yellow #FDB813 on black)

### Backend API
- RESTful API with Express.js
- PostgreSQL database
- JWT authentication
- Email confirmation for new subscribers
- Staff notifications
- Soft delete support
- Activity logging
- Docker containerization

## Project Structure

```
ekidna2/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── config/      # Database, email, JWT config
│   │   ├── controllers/ # Route handlers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, validation, errors
│   │   ├── services/    # Email service
│   │   └── server.js    # Entry point
│   ├── migrations/      # Database schema
│   └── Dockerfile
│
├── website/             # Public website (React)
│   ├── src/
│   │   ├── components/  # React components
│   │   └── styles/      # CSS/Tailwind
│   └── package.json
│
├── MVP/                 # Staff dashboard (React)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utilities
│   └── package.json
│
├── docker-compose.yml   # Docker orchestration
├── .env.example         # Environment template
├── DEPLOYMENT.md        # VPS deployment guide
└── README.md            # This file
```

## Tech Stack

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.3.5
- **Language:** TypeScript
- **UI Library:** Shadcn/UI + Radix UI
- **Styling:** Tailwind CSS
- **Router:** React Router (website)

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js 4
- **Database:** PostgreSQL 16
- **ORM:** pg (native driver)
- **Auth:** JWT + bcryptjs
- **Email:** Nodemailer
- **Validation:** express-validator

### Infrastructure
- **Containers:** Docker & Docker Compose
- **Database UI:** Adminer (development)
- **Reverse Proxy:** Nginx (production)
- **SSL:** Let's Encrypt

## Quick Start

### Prerequisites

- **Node.js** 20+ installed
- **Docker** and **Docker Compose** installed
- **Git** installed

### 1. Clone Repository

```bash
git clone https://github.com/your-repo/ekidna2.git
cd ekidna2
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database
DB_NAME=ekidna_db
DB_USER=ekidna_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-secret-key

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@ekidna.org

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 3. Start Backend

```bash
# Start PostgreSQL + Backend + Adminer
docker-compose up -d

# Check if running
docker-compose ps

# View logs
docker-compose logs -f
```

Backend will be available at: http://localhost:3001/api

### 4. Start Website

```bash
cd website
npm install
npm run dev
```

Website will be available at: http://localhost:5173

### 5. Start MVP Dashboard

```bash
cd MVP
npm install
npm run dev
```

MVP will be available at: http://localhost:5174

## Default Admin Credentials

**Email:** admin@ekidna.org
**Password:** admin123

⚠️ **Change this password immediately after first login!**

## API Documentation

### Public Endpoints

#### Subscribe (from website)
```bash
POST http://localhost:3001/api/subscribers
Content-Type: application/json

{
  "name": "Marco Rossi",
  "email": "marco.rossi@example.com",
  "phone": "+39 333 1234567",
  "address": "Via Roma 1, Milano, 20121",
  "subscription_year": 2025
}
```

### Authentication

#### Login
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "admin@ekidna.org",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@ekidna.org",
    "name": "Administrator",
    "role": "admin"
  }
}
```

### Protected Endpoints

Use the token in Authorization header:
```
Authorization: Bearer <your-token>
```

#### Get Subscribers
```bash
GET http://localhost:3001/api/subscribers?page=1&limit=50
```

#### Get Statistics
```bash
GET http://localhost:3001/api/subscribers/stats
```

#### Update Subscriber
```bash
PUT http://localhost:3001/api/subscribers/:id
Content-Type: application/json

{
  "name": "Marco Rossi Updated",
  "subscription_year": 2025
}
```

#### Delete Subscriber (Soft)
```bash
DELETE http://localhost:3001/api/subscribers/:id
```

Full API documentation: http://localhost:3001/api

## Email Setup

### Using Gmail

1. Enable 2-Factor Authentication in your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Add credentials to `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
```

### Email Templates

The system sends:
1. **Confirmation email** to subscribers (Italian)
2. **Notification email** to staff when new subscription is created

Templates can be customized in `backend/src/config/email.js`.

## Database Management

### Using Adminer (Web UI)

1. Open http://localhost:8080
2. Login with:
   - System: PostgreSQL
   - Server: db
   - Username: ekidna_user
   - Password: (from .env)
   - Database: ekidna_db

### Using Command Line

```bash
# Connect to database
docker exec -it ekidna_db psql -U ekidna_user -d ekidna_db

# Backup database
docker exec ekidna_db pg_dump -U ekidna_user ekidna_db > backup.sql

# Restore database
docker exec -i ekidna_db psql -U ekidna_user -d ekidna_db < backup.sql
```

## Building for Production

### Build Backend

Backend runs in Docker, no separate build needed.

```bash
docker-compose up -d --build
```

### Build Website

```bash
cd website
npm install
npm run build
# Output: website/dist/
```

### Build MVP

```bash
cd MVP
npm install
npm run build
# Output: MVP/dist/
```

## Deployment

This project is designed to be deployed on **Hostinger VPS** (or any VPS provider).

### Quick Deployment Steps

1. **Setup VPS** - Install Docker, Nginx, and SSL
2. **Clone repository** to VPS
3. **Configure environment** - Update `.env` with production values
4. **Start services** - `docker-compose up -d`
5. **Setup Nginx** - Configure reverse proxy
6. **Setup SSL** - Use Let's Encrypt with Certbot
7. **Build frontends** - Build and serve with Nginx

📖 **Full deployment guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## Development

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Run with auto-reload
npm run dev

# Generate password hash
node src/utils/hashPassword.js
```

### View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Database only
docker-compose logs -f db
```

### Database Migrations

The database schema is automatically initialized from `backend/migrations/init.sql` when the database container starts for the first time.

To reset the database:

```bash
# Stop and remove containers
docker-compose down

# Remove database volume
docker volume rm ekidna2_postgres_data

# Start fresh
docker-compose up -d
```

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Database not ready: Wait a few seconds
# - Port 3001 in use: Change port in docker-compose.yml
# - .env missing: Copy from .env.example
```

### Cannot connect to database

```bash
# Check if database is running
docker-compose ps

# Check database logs
docker-compose logs db

# Verify connection
docker exec -it ekidna_db psql -U ekidna_user -d ekidna_db
```

### Email not sending

- Verify EMAIL_USER and EMAIL_PASSWORD in `.env`
- Check if using Gmail App Password (not regular password)
- Email service is optional - API works without it
- Check backend logs: `docker-compose logs backend`

### Frontend can't connect to API

- Verify backend is running: `curl http://localhost:3001/api/health`
- Check CORS settings in `backend/src/server.js`
- Update API URL in frontend configuration

## Project Architecture

### Data Flow

```
User submits form on Website
         ↓
Backend API receives request
         ↓
Saves to PostgreSQL database
         ↓
Sends confirmation email to user
         ↓
Sends notification email to staff
         ↓
Staff views in MVP Dashboard
```

### Authentication Flow

```
Staff logs in via MVP
         ↓
Backend verifies credentials
         ↓
Returns JWT token
         ↓
MVP stores token
         ↓
All API requests include token
         ↓
Backend validates token
         ↓
Returns protected data
```

## Security

### Best Practices Implemented

- JWT authentication for staff
- Password hashing with bcrypt
- Input validation with express-validator
- SQL injection prevention (parameterized queries)
- CORS configuration
- Helmet.js for security headers
- Environment variables for secrets
- Soft delete (data retention)
- Activity logging

### Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Update JWT_SECRET to strong random string
- [ ] Use strong database password
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Setup database backups
- [ ] Review CORS settings
- [ ] Disable Adminer in production

## Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3001/api/health

# Create subscriber
curl -X POST http://localhost:3001/api/subscribers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subscription_year": 2025
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ekidna.org",
    "password": "admin123"
  }'
```

## Support & Documentation

- **Backend README:** [backend/README.md](./backend/README.md)
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API Documentation:** http://localhost:3001/api
- **Database Schema:** [backend/migrations/init.sql](./backend/migrations/init.sql)

## License

MIT License - Ekidna APS

## Contributors

- Backend Architecture & Implementation
- Frontend Integration
- Docker Configuration
- Deployment Setup

---

**Made with ❤️ for Ekidna APS**
