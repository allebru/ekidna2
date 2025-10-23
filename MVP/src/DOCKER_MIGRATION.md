# Docker Migration Guide

## Overview
This document outlines the migration from the current Supabase MVP to a Docker-based production system.

## Current Architecture (Supabase MVP)
```
┌─────────────┐
│   React     │
│  Frontend   │
└──────┬──────┘
       │
       ├─ Supabase Auth (authentication)
       ├─ Supabase Edge Functions (API server)
       └─ Supabase PostgreSQL (database)
```

## Target Architecture (Docker Production)
```
┌─────────────┐
│   React     │
│  Frontend   │
└──────┬──────┘
       │
       v
┌─────────────────────────────┐
│      Docker Container       │
│  ┌─────────────────────┐   │
│  │   Node.js/Express   │   │
│  │     API Server      │   │
│  │   (JWT Auth)        │   │
│  └──────────┬──────────┘   │
│             │               │
│  ┌──────────v──────────┐   │
│  │    PostgreSQL       │   │
│  │     Database        │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

## Migration Steps

### 1. Backend Setup

#### Create Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: ekidna_db
    environment:
      POSTGRES_DB: ekidna_aps
      POSTGRES_USER: ekidna_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  api:
    build: ./backend
    container_name: ekidna_api
    environment:
      DATABASE_URL: postgresql://ekidna_user:${DB_PASSWORD}@postgres:5432/ekidna_aps
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Create Database Schema
```sql
-- database/init.sql
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    subscription_year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
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
CREATE INDEX idx_subscribers_name ON subscribers(name);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE
    ON subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Backend API Structure

#### Directory Structure
```
backend/
├── Dockerfile
├── package.json
├── src/
│   ├── index.ts                 # Express server entry
│   ├── config/
│   │   └── database.ts          # PostgreSQL connection
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   └── errorHandler.ts     # Error handling
│   ├── routes/
│   │   ├── auth.ts              # Login/logout routes
│   │   └── subscribers.ts       # Subscriber CRUD routes
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── subscribersController.ts
│   └── models/
│       ├── User.ts
│       └── Subscriber.ts
```

#### Backend Dockerfile
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

### 3. API Routes Mapping

| Current Supabase Route | Docker API Route | Method | Auth |
|------------------------|------------------|--------|------|
| `/make-server-cd70e814/subscribers` | `/api/subscribers` | GET | Yes |
| `/make-server-cd70e814/subscribers` | `/api/subscribers` | POST | Yes |
| `/make-server-cd70e814/subscribers/:id` | `/api/subscribers/:id` | PUT | Yes |
| `/make-server-cd70e814/subscribers/:id` | `/api/subscribers/:id` | DELETE | Yes |
| Supabase Auth | `/api/auth/login` | POST | No |
| Supabase Auth | `/api/auth/logout` | POST | Yes |
| Supabase Auth | `/api/auth/register` | POST | No |

### 4. Frontend Changes Required

#### Update API Base URL
```typescript
// utils/api/config.ts
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
```

#### Create API Client
```typescript
// utils/api/client.ts
export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Subscribers
  async getSubscribers() {
    return this.request('/subscribers');
  }

  async createSubscriber(data: any) {
    return this.request('/subscribers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSubscriber(id: string, data: any) {
    return this.request(`/subscribers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSubscriber(id: string) {
    return this.request(`/subscribers/${id}`, {
      method: 'DELETE',
    });
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

#### Update Components
Replace Supabase client calls with the new API client in:
- `components/Login.tsx`
- `pages/SubscribersPage.tsx`
- `App.tsx`

### 5. Files to Remove After Migration

```
/supabase/                    # Entire directory
/utils/supabase/              # Entire directory
```

### 6. Files to Create

```
/utils/api/
├── client.ts                 # API client
├── config.ts                 # API configuration
└── types.ts                  # TypeScript interfaces

/backend/                     # New backend directory (outside React app)
├── Dockerfile
├── docker-compose.yml
├── package.json
├── src/
│   └── ... (backend code)
└── database/
    └── init.sql
```

### 7. Environment Variables

#### Current (Supabase)
```env
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

#### After Migration (Docker)
```env
# Backend (.env in backend/)
DATABASE_URL=postgresql://ekidna_user:password@postgres:5432/ekidna_aps
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=3000

# Frontend (.env in React app)
REACT_APP_API_URL=http://localhost:3000/api
```

### 8. Development vs Production

#### Development
```bash
# Start backend
cd backend
docker-compose up -d

# Start frontend
npm start
```

#### Production
```bash
# Build frontend
npm run build

# Deploy built frontend to web server (nginx, etc.)
# Backend runs in Docker on server
```

## Migration Checklist

- [ ] Set up PostgreSQL database schema
- [ ] Create Docker Compose configuration
- [ ] Implement Node.js/Express API server
- [ ] Implement JWT authentication
- [ ] Create subscriber CRUD endpoints
- [ ] Create API client utility in frontend
- [ ] Update Login component
- [ ] Update SubscribersPage component
- [ ] Update App.tsx authentication flow
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test subscriber management features
- [ ] Remove Supabase dependencies
- [ ] Update documentation
- [ ] Deploy to production

## Notes

1. **Data Migration**: Export existing data from Supabase before migration
2. **Authentication**: Consider implementing refresh tokens for better security
3. **CORS**: Configure CORS properly in Express to allow frontend requests
4. **Security**: Use environment variables for sensitive data
5. **Backup**: Implement database backup strategy
6. **Logging**: Add proper logging to backend
7. **Error Handling**: Implement comprehensive error handling
8. **Testing**: Add unit and integration tests

## Benefits of Docker Migration

✅ Full control over backend infrastructure
✅ No vendor lock-in
✅ Easy local development setup
✅ Portable and reproducible environment
✅ Cost-effective for production
✅ Better performance and scalability
✅ Custom authentication implementation
✅ Complete data ownership
