# Migration Guide: Supabase → Docker Backend

This guide helps you migrate from the current Supabase backend to the new self-hosted Docker backend.

## Overview

**Current Setup (Supabase):**
- Frontend → Supabase Cloud
- Database: Supabase PostgreSQL (cloud)
- Auth: Supabase Auth
- Functions: Supabase Edge Functions

**New Setup (Docker):**
- Frontend → Docker Backend API → PostgreSQL
- Database: PostgreSQL in Docker (self-hosted)
- Auth: JWT tokens
- API: Express.js REST API

## Benefits of Migration

✅ **Full control** - Own your data and infrastructure
✅ **Cost savings** - No monthly Supabase fees
✅ **Customization** - Full backend code access
✅ **Privacy** - Data stays on your VPS
✅ **Performance** - Lower latency (same server)
✅ **Portability** - Easy to move between providers

## Migration Steps

### Phase 1: Setup New Backend (Complete)

The new Docker backend is already set up in the `backend/` directory.

### Phase 2: Frontend Migration

You need to update the frontend code to use the new API instead of Supabase.

#### For MVP Dashboard

1. **Replace Supabase client with new API client:**

Current code (using Supabase):
```javascript
import { supabase } from './utils/supabase/client';

// Get subscribers
const { data, error } = await supabase
  .from('subscribers')
  .select('*')
  .eq('status', 'active');
```

New code (using Docker API):
```javascript
import { subscribersAPI } from './config/api';

// Get subscribers
try {
  const response = await subscribersAPI.getAll({ status: 'active' });
  const data = response.data;
} catch (error) {
  console.error('Error:', error.message);
}
```

2. **Update authentication:**

Current (Supabase):
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

New (Docker API):
```javascript
import { authAPI } from './config/api';

try {
  const data = await authAPI.login(email, password);
  // Token is automatically stored
} catch (error) {
  console.error('Login failed:', error.message);
}
```

3. **Update environment variables:**

Create `MVP/.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

#### For Website

1. **Update subscription form:**

Current (if using Supabase):
```javascript
const { data, error } = await supabase
  .from('subscribers')
  .insert([subscriberData]);
```

New (Docker API):
```javascript
import { submitSubscription } from './config/api';

try {
  const data = await submitSubscription(subscriberData);
  // Show success message
} catch (error) {
  // Show error message
  console.error('Submission failed:', error.message);
}
```

2. **Update environment variables:**

Create `website/.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Phase 3: Data Migration (If needed)

If you have existing data in Supabase that needs to be migrated:

#### Export from Supabase

1. Go to Supabase Dashboard → Database → Tables
2. Export subscribers table as CSV
3. Export staff_users table as CSV

#### Import to Docker PostgreSQL

**Option 1: Using CSV (recommended for small datasets)**

```bash
# Copy CSV files to container
docker cp subscribers.csv ekidna_db:/tmp/

# Connect to database
docker exec -it ekidna_db psql -U ekidna_user -d ekidna_db

# Import data
\copy subscribers(name,email,phone,address,subscription_year,status,created_at) FROM '/tmp/subscribers.csv' CSV HEADER;
```

**Option 2: Using SQL dump**

1. Export from Supabase:
```sql
-- In Supabase SQL editor
COPY (SELECT * FROM subscribers) TO '/tmp/subscribers.sql';
```

2. Import to Docker:
```bash
docker exec -i ekidna_db psql -U ekidna_user -d ekidna_db < subscribers.sql
```

**Option 3: Using migration script**

Create a Node.js script to migrate data via APIs:

```javascript
// migrate-data.js
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_KEY');
const API_URL = 'http://localhost:3001/api';

async function migrateSubscribers() {
  // Get data from Supabase
  const { data, error } = await supabase
    .from('subscribers')
    .select('*');

  if (error) throw error;

  // Insert into Docker backend
  for (const subscriber of data) {
    await fetch(`${API_URL}/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriber)
    });
  }

  console.log(`Migrated ${data.length} subscribers`);
}

migrateSubscribers();
```

### Phase 4: Update Code References

Search and replace across the codebase:

#### In MVP:

1. Find files using Supabase:
```bash
cd MVP
grep -r "supabase" src/
```

2. Replace imports:
```bash
# Old
import { supabase } from './utils/supabase/client'

# New
import { authAPI, subscribersAPI } from './config/api'
```

3. Update components:

**Login.tsx** - Replace Supabase auth with `authAPI.login()`
**SubscribersTable.tsx** - Replace Supabase queries with `subscribersAPI.getAll()`
**AddSubscriberDialog.tsx** - Replace with `subscribersAPI.create()`
**EditSubscriberDialog.tsx** - Replace with `subscribersAPI.update()`
**DeleteConfirmDialog.tsx** - Replace with `subscribersAPI.delete()`

#### In Website:

1. Find Supabase usage:
```bash
cd website
grep -r "supabase" src/
```

2. Update Iscriviti.tsx (subscription form):
```javascript
// Old
import { supabase } from './utils/supabase/client'

// New
import { submitSubscription } from './config/api'
```

### Phase 5: Testing

1. **Start the backend:**
```bash
docker-compose up -d
```

2. **Test backend API:**
```bash
# Health check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ekidna.org","password":"admin123"}'
```

3. **Update frontend .env files:**

```bash
# MVP
echo "VITE_API_BASE_URL=http://localhost:3001/api" > MVP/.env

# Website
echo "VITE_API_BASE_URL=http://localhost:3001/api" > website/.env
```

4. **Start frontend:**
```bash
# MVP
cd MVP
npm run dev

# Website
cd website
npm run dev
```

5. **Test functionality:**
   - [ ] Login to MVP
   - [ ] View subscribers list
   - [ ] Add new subscriber
   - [ ] Edit subscriber
   - [ ] Delete subscriber
   - [ ] Submit form on website
   - [ ] Verify email sent (if configured)

### Phase 6: Deployment

Follow the [DEPLOYMENT.md](./DEPLOYMENT.md) guide to deploy to Hostinger VPS.

## Code Changes Summary

### MVP Changes

Files to update:

1. **src/App.tsx** - Replace Supabase auth check with JWT auth
2. **src/components/Login.tsx** - Use `authAPI.login()`
3. **src/pages/SubscribersPage.tsx** - Use `subscribersAPI.getAll()`
4. **src/components/subscribers/AddSubscriberDialog.tsx** - Use `subscribersAPI.create()`
5. **src/components/subscribers/EditSubscriberDialog.tsx** - Use `subscribersAPI.update()`
6. **src/components/subscribers/DeleteConfirmDialog.tsx** - Use `subscribersAPI.delete()`
7. **src/components/subscribers/SubscriberStats.tsx** - Use `subscribersAPI.getStats()`

### Website Changes

Files to update:

1. **src/components/Iscriviti.tsx** - Use `submitSubscription()` from API config

## API Mapping

Supabase → Docker Backend:

| Supabase Operation | Docker API Endpoint |
|-------------------|-------------------|
| `supabase.auth.signInWithPassword()` | `POST /api/auth/login` |
| `supabase.auth.signOut()` | `authAPI.logout()` (client-side) |
| `supabase.from('subscribers').select()` | `GET /api/subscribers` |
| `supabase.from('subscribers').insert()` | `POST /api/subscribers` |
| `supabase.from('subscribers').update()` | `PUT /api/subscribers/:id` |
| `supabase.from('subscribers').delete()` | `DELETE /api/subscribers/:id` |

## Rollback Plan

If you need to rollback to Supabase:

1. Keep the old Supabase code in a separate branch
2. The new backend doesn't affect Supabase - both can coexist
3. To rollback, simply switch the API URL back to Supabase
4. No data loss - Supabase data remains intact

## Parallel Running (Recommended)

You can run both backends in parallel during transition:

1. Keep Supabase active
2. Start Docker backend on different port
3. Test Docker backend thoroughly
4. Switch frontend to Docker backend when ready
5. Keep Supabase as backup for 1-2 weeks
6. Cancel Supabase subscription after successful migration

## Troubleshooting

### Frontend can't connect to backend

- Check if backend is running: `docker-compose ps`
- Verify API URL in `.env` files
- Check browser console for CORS errors
- Ensure ports are correct (3001 for backend)

### Authentication errors

- Clear browser localStorage: `localStorage.clear()`
- Check JWT_SECRET matches between backend and frontend
- Verify token is being sent: Check Network tab in DevTools

### Database connection errors

- Check if PostgreSQL is running: `docker-compose logs db`
- Verify database credentials in `.env`
- Restart services: `docker-compose restart`

### Data not appearing

- Check if migration completed: `docker exec -it ekidna_db psql -U ekidna_user -d ekidna_db -c "SELECT COUNT(*) FROM subscribers;"`
- Verify API returns data: `curl http://localhost:3001/api/subscribers`
- Check backend logs: `docker-compose logs backend`

## Support

If you encounter issues during migration:

1. Check backend logs: `docker-compose logs -f backend`
2. Check database logs: `docker-compose logs -f db`
3. Test API directly with curl/Postman
4. Review browser console for errors
5. Check Network tab in DevTools

## Timeline Recommendation

- **Week 1:** Setup Docker backend, test locally
- **Week 2:** Update MVP frontend, test thoroughly
- **Week 3:** Update website frontend, test forms
- **Week 4:** Deploy to VPS, run in parallel with Supabase
- **Week 5:** Monitor, fix issues, switch DNS if needed
- **Week 6:** Disable Supabase if everything works

## Checklist

Backend Setup:
- [ ] Docker backend running locally
- [ ] Database initialized with schema
- [ ] Email service configured
- [ ] Default admin user created
- [ ] Health check passing

Frontend Update:
- [ ] MVP using new API client
- [ ] Website using new API client
- [ ] Environment variables configured
- [ ] All components updated
- [ ] Authentication working

Testing:
- [ ] Login/logout works
- [ ] View subscribers works
- [ ] Add subscriber works
- [ ] Edit subscriber works
- [ ] Delete subscriber works
- [ ] Website form submission works
- [ ] Emails being sent

Deployment:
- [ ] VPS configured
- [ ] Docker installed
- [ ] Nginx configured
- [ ] SSL certificates installed
- [ ] Backend deployed
- [ ] Frontends deployed
- [ ] Database backups configured

Post-Migration:
- [ ] All features tested in production
- [ ] Monitoring setup
- [ ] Backups working
- [ ] Admin password changed
- [ ] Documentation updated
- [ ] Team trained on new system
