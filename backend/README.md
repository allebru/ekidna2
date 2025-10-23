# Ekidna Backend API

Backend server for Ekidna APS subscription management system.

## Features

- **RESTful API** with Express.js
- **PostgreSQL Database** with Docker
- **JWT Authentication** for staff users
- **Email Notifications** (Nodemailer)
- **Soft Delete** support for subscribers
- **Activity Logging** for audit trail
- **CORS** enabled for frontend integration
- **Validation** with express-validator
- **Security** with Helmet.js

## Tech Stack

- **Node.js** 20.x
- **Express.js** 4.x
- **PostgreSQL** 16
- **Docker & Docker Compose**
- **Nodemailer** for emails
- **JWT** for authentication
- **bcryptjs** for password hashing

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (DB, email, JWT)
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, validation, error handling
│   ├── services/        # Business logic (email service)
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── migrations/          # Database schema
├── Dockerfile           # Docker configuration
└── package.json         # Dependencies
```

## Quick Start (Local Development)

### Prerequisites

- Node.js 20+ installed
- Docker and Docker Compose installed
- Gmail account (or SMTP server) for email functionality

### 1. Clone and Setup

```bash
cd ekidna2/backend
npm install
```

### 2. Configure Environment

Create `.env` file in the project root (see `.env.example`):

```bash
# Copy from root directory
cp ../.env.example ../.env
```

Edit `.env` with your settings:

```env
# Database
DB_NAME=ekidna_db
DB_USER=ekidna_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@ekidna.org

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Start with Docker

From the project root:

```bash
cd ..
docker-compose up -d
```

This will start:
- **PostgreSQL** database on port 5432
- **Backend API** on port 3001
- **Adminer** (DB admin UI) on port 8080

### 4. Verify Installation

Check if services are running:

```bash
docker-compose ps
```

Test the API:

```bash
curl http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T...",
  "uptime": 1.234
}
```

## API Endpoints

### Public Endpoints

#### `POST /api/subscribers`
Create a new subscriber (from website form).

**Request:**
```json
{
  "name": "Marco Rossi",
  "email": "marco.rossi@example.com",
  "phone": "+39 333 1234567",
  "address": "Via Roma 1, Milano, 20121",
  "subscription_year": 2025
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "subscriber": {
    "id": "uuid",
    "name": "Marco Rossi",
    "email": "marco.rossi@example.com",
    "subscription_year": 2025
  }
}
```

### Authentication Endpoints

#### `POST /api/auth/login`
Login for staff users.

**Request:**
```json
{
  "email": "admin@ekidna.org",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "admin@ekidna.org",
    "name": "Administrator",
    "role": "admin"
  }
}
```

#### `GET /api/auth/me`
Get current user info (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

### Subscriber Management (Protected)

All endpoints require authentication header:
```
Authorization: Bearer <token>
```

#### `GET /api/subscribers`
Get all subscribers with pagination.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `status` - Filter by status: active, deleted, pending
- `subscription_year` - Filter by year
- `search` - Search by name or email

#### `GET /api/subscribers/:id`
Get subscriber by ID.

#### `PUT /api/subscribers/:id`
Update subscriber.

#### `DELETE /api/subscribers/:id`
Soft delete subscriber.

#### `POST /api/subscribers/:id/restore`
Restore deleted subscriber.

#### `GET /api/subscribers/stats`
Get subscriber statistics.

#### `GET /api/subscribers/year/:year`
Get subscribers by year.

## Default Admin User

**Email:** admin@ekidna.org
**Password:** admin123

⚠️ **IMPORTANT:** Change this password immediately after first login!

## Email Configuration

### Using Gmail

1. Enable 2-factor authentication in your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
```

### Email Templates

The system sends two types of emails:

1. **Subscription Confirmation** - Sent to subscribers after registration
2. **Staff Notification** - Sent to staff when new subscription is created

Templates are in Italian and can be customized in `src/config/email.js`.

## Database Management

### Using Adminer (Web UI)

1. Open http://localhost:8080
2. Login with:
   - System: PostgreSQL
   - Server: db
   - Username: ekidna_user (from .env)
   - Password: your password
   - Database: ekidna_db

### Using psql (Command Line)

```bash
docker exec -it ekidna_db psql -U ekidna_user -d ekidna_db
```

### Backup Database

```bash
docker exec ekidna_db pg_dump -U ekidna_user ekidna_db > backup.sql
```

### Restore Database

```bash
docker exec -i ekidna_db psql -U ekidna_user -d ekidna_db < backup.sql
```

## Development

### Run without Docker

```bash
# Start PostgreSQL separately (or use Docker for DB only)
docker-compose up -d db

# Install dependencies
npm install

# Run in development mode
npm run dev
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

## Troubleshooting

### Cannot connect to database

```bash
# Check if PostgreSQL is running
docker-compose ps

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Email not sending

- Verify EMAIL_USER and EMAIL_PASSWORD in `.env`
- Check if Gmail App Password is correct
- Check backend logs: `docker-compose logs backend`
- Email service is optional - API will work without it

### Port already in use

If ports 3001, 5432, or 8080 are already in use, edit `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3002:3001"  # Change to 3002
```

## Production Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for Hostinger VPS deployment instructions.

## Security Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Update JWT_SECRET to a strong random string
- [ ] Update DB_PASSWORD to a strong password
- [ ] Set NODE_ENV=production
- [ ] Configure firewall rules
- [ ] Enable HTTPS/SSL
- [ ] Set up regular database backups
- [ ] Review CORS settings

## License

MIT License - Ekidna APS
