# ekidna APS - Project Structure

## Overview
Ekidna APS is a subscriber management system for Italian APS (Associazione di Promozione Sociale) organizations.

⚠️ **Note**: This MVP currently uses Supabase for rapid prototyping. The final production version will use a **Docker-based backend** with PostgreSQL. See `DOCKER_MIGRATION.md` for migration details.

## Architecture

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling (dark yellow and black theme)
- **Shadcn/UI** components

### Backend (Current - Supabase MVP)
- **Supabase** PostgreSQL database
- **Supabase Auth** for authentication
- **Supabase Edge Functions** (Hono server)

### Backend (Final - Docker)
- **Docker** containerized backend
- **PostgreSQL** database
- **Node.js/Express** API server
- **JWT** authentication

## Directory Structure

```
/
├── App.tsx                          # Main application entry point
├── components/                      # Reusable UI components
│   ├── layout/                      # Layout components
│   │   └── Layout.tsx              # Main layout wrapper with header
│   ├── subscribers/                 # Subscriber-specific components
│   │   ├── AddSubscriberDialog.tsx # Dialog for adding new subscribers
│   │   ├── EditSubscriberDialog.tsx# Dialog for editing subscribers
│   │   ├── DeleteConfirmDialog.tsx # Confirmation dialog for deletions
│   │   ├── SubscribersTable.tsx    # Table component for displaying subscribers
│   │   ├── SubscribersFilters.tsx  # Search and filter controls
│   │   └── SubscriberStats.tsx     # Statistics cards
│   ├── Header.tsx                   # Application header
│   ├── Login.tsx                    # Login page
│   └── Dashboard.tsx                # Dashboard wrapper (routes to pages)
│   └── ui/                          # Shadcn/UI components
├── pages/                           # Page-level components
│   └── SubscribersPage.tsx         # Main subscribers management page
├── utils/                           # Utility functions
│   └── supabase/
│       ├── client.tsx              # Supabase client singleton
│       └── info.tsx                # Supabase connection info
├── supabase/                        # Backend server code
│   └── functions/
│       └── server/
│           ├── index.tsx           # Main server with routes
│           ├── kv_store.tsx        # Key-value store utilities (PROTECTED)
│           └── seed.tsx            # Test data seeding
└── styles/
    └── globals.css                 # Global styles and theme tokens
```

## Key Features

### Current Features
- ✅ User authentication (login/logout)
- ✅ View all subscribers in a paginated table
- ✅ Add new subscribers
- ✅ Edit all subscriber fields (name, email, phone, address, subscription year)
- ✅ Soft delete subscribers
- ✅ Search and filter subscribers by:
  - Name, email, phone, address
  - Subscription year
  - Status (active/deleted)
- ✅ Statistics dashboard
- ✅ Responsive design (mobile-friendly)
- ✅ Test data seeding

### Future Extensibility

#### Adding New Pages
1. Create a new page component in `/pages/` directory
2. Update `/components/Dashboard.tsx` to route to the new page
3. Consider adding navigation to the Header component

Example:
```tsx
// pages/ReportsPage.tsx
export function ReportsPage({ accessToken }: { accessToken: string }) {
  // Your page logic
  return <div>Reports Content</div>;
}

// Update Dashboard.tsx to include routing
import { ReportsPage } from '../pages/ReportsPage';
// Add routing logic
```

#### Adding New Features
1. **Payment Tracking**: Add payment status and history tracking
2. **Reports & Analytics**: Generate membership reports and statistics
3. **Email Notifications**: Send renewal reminders
4. **Document Management**: Upload and manage member documents
5. **Multi-year View**: Display subscription history timeline
6. **Bulk Operations**: Batch update subscriptions, export to CSV
7. **Admin Roles**: Different permission levels for users

## API Routes

Base URL: `https://${projectId}.supabase.co/functions/v1/make-server-cd70e814`

- `GET /subscribers` - Get all subscribers
- `POST /subscribers` - Create new subscriber
- `PUT /subscribers/:id` - Update subscriber
- `DELETE /subscribers/:id` - Soft delete subscriber
- `POST /seed` - Seed test data (development only)

## Database Schema

### Subscribers (stored in key-value store)
```typescript
interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscription_year: number;
  status: 'active' | 'deleted';
  created_at: string;
  updated_at: string;
}
```

## Development Notes

### Protected Files
Do not modify these files:
- `/supabase/functions/server/kv_store.tsx`
- `/utils/supabase/info.tsx`
- `/components/figma/ImageWithFallback.tsx`

### Color Scheme
- Primary (Dark Yellow): `#FDB813`
- Background (Black): `#000000`
- Text (White): `#FFFFFF`

### Best Practices
1. Keep components small and focused
2. Use TypeScript interfaces for type safety
3. Follow the existing file structure when adding features
4. Test with the seed data before deploying
5. Use the singleton Supabase client from `/utils/supabase/client.tsx`

## Testing
Use the "Carica Dati Test" button to seed the database with sample data for testing.
