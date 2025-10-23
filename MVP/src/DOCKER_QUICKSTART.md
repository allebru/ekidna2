# Docker Quick Start Guide

This is a condensed guide to get the Docker version running. For detailed instructions, see [DOCKER_MIGRATION.md](DOCKER_MIGRATION.md).

## Prerequisites

- Docker and Docker Compose installed
- Node.js 16+ for frontend build
- Basic knowledge of Docker

## Quick Setup (5 Steps)

### 1. Create Backend Directory Structure

```bash
mkdir -p backend/src/{config,middleware,routes,controllers,models}
mkdir -p backend/database
```

### 2. Copy Example Files

```bash
# Copy environment template
cp .env.example backend/.env

# Edit with your values
nano backend/.env
```

### 3. Create docker-compose.yml

```yaml
# backend/docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: ekidna_db
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  api:
    build: .
    container_name: ekidna_api
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: ${NODE_ENV}
      PORT: ${PORT}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_data:
```

### 4. Create Database Schema

```sql
-- backend/database/init.sql
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    subscription_year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscribers_status ON subscribers(status);
CREATE INDEX idx_subscribers_year ON subscribers(subscription_year);
```

### 5. Start Services

```bash
# Navigate to backend
cd backend

# Start Docker containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## API Implementation (Node.js/Express)

### Basic Server Structure

```javascript
// backend/src/index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Routes
app.get('/api/subscribers', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM subscribers WHERE status = $1 ORDER BY name',
      ['active']
    );
    res.json({ subscribers: result.rows });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/subscribers', async (req, res) => {
  const { name, email, phone, address, subscription_year } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO subscribers (name, email, phone, address, subscription_year) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, address, subscription_year]
    );
    res.json({ subscriber: result.rows[0] });
  } catch (error) {
    console.error('Error creating subscriber:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/subscribers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, subscription_year } = req.body;
  try {
    const result = await pool.query(
      'UPDATE subscribers SET name = $1, email = $2, phone = $3, address = $4, subscription_year = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [name, email, phone, address, subscription_year, id]
    );
    res.json({ subscriber: result.rows[0] });
  } catch (error) {
    console.error('Error updating subscriber:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/subscribers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE subscribers SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      ['deleted', id]
    );
    res.json({ subscriber: result.rows[0] });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### Package.json

```json
{
  "name": "ekidna-aps-backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
```

## Frontend Changes

### Update API Calls

Replace Supabase imports with API fetch calls:

```typescript
// Before (Supabase)
const supabase = getSupabaseClient();
const { data } = await supabase.from('subscribers').select();

// After (Docker API)
const response = await fetch('http://localhost:3000/api/subscribers', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});
const data = await response.json();
```

## Testing

```bash
# Test database connection
docker-compose exec postgres psql -U ekidna_user -d ekidna_aps

# Test API
curl http://localhost:3000/api/subscribers

# View logs
docker-compose logs -f api
```

## Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f [service-name]

# Execute commands in container
docker-compose exec api sh
docker-compose exec postgres psql -U ekidna_user

# Rebuild after code changes
docker-compose up -d --build
```

## Troubleshooting

### Container won't start
```bash
docker-compose logs api
```

### Database connection error
```bash
# Check if database is ready
docker-compose exec postgres pg_isready

# Check environment variables
docker-compose exec api env
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process or change port in docker-compose.yml
```

## Next Steps

1. ✅ Get basic API running
2. ⬜ Implement JWT authentication
3. ⬜ Add input validation
4. ⬜ Implement error handling
5. ⬜ Add tests
6. ⬜ Update frontend to use new API
7. ⬜ Deploy to production

## Resources

- [Full Migration Guide](DOCKER_MIGRATION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Need Help?** Check the full [DOCKER_MIGRATION.md](DOCKER_MIGRATION.md) guide for detailed explanations.
