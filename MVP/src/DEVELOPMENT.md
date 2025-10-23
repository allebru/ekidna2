# Development Guide

This guide helps you develop and extend the ekidna APS application.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Adding Features](#adding-features)
4. [Best Practices](#best-practices)
5. [Testing](#testing)
6. [Common Tasks](#common-tasks)

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Code editor (VS Code recommended)
- Git for version control
- Basic React and TypeScript knowledge

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd ekidna-aps

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Development Workflow

1. **Create a new branch** for your feature
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes** and test locally

3. **Commit your changes**
```bash
git add .
git commit -m "Add: description of your changes"
```

4. **Push and create pull request**
```bash
git push origin feature/your-feature-name
```

## Project Structure

```
ekidna-aps/
├── components/          # Reusable components
│   ├── layout/         # Layout components
│   ├── subscribers/    # Subscriber-specific components
│   └── ui/             # Shadcn UI components
├── pages/              # Page-level components
├── utils/              # Utility functions
├── styles/             # Global styles
└── App.tsx             # Main application entry
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed information.

## Adding Features

### 1. Adding a New Page

#### Step 1: Create the Page Component

```typescript
// pages/ReportsPage.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

interface ReportsPageProps {
  accessToken: string;
}

export function ReportsPage({ accessToken }: ReportsPageProps) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    // Fetch reports data
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/30 bg-card">
        <CardHeader>
          <CardTitle className="text-primary">Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Your content here */}
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Step 2: Add Navigation

```typescript
// components/Dashboard.tsx
import { useState } from 'react';
import { Layout } from './layout/Layout';
import { SubscribersPage } from '../pages/SubscribersPage';
import { ReportsPage } from '../pages/ReportsPage';

interface DashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function Dashboard({ accessToken, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<'subscribers' | 'reports'>('subscribers');

  return (
    <Layout onLogout={onLogout} currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'subscribers' && <SubscribersPage accessToken={accessToken} />}
      {currentPage === 'reports' && <ReportsPage accessToken={accessToken} />}
    </Layout>
  );
}
```

#### Step 3: Update Layout with Navigation

```typescript
// components/layout/Layout.tsx
import { ReactNode } from 'react';
import { Header } from '../Header';
import { Button } from '../ui/button';

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Layout({ children, onLogout, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      
      {/* Navigation */}
      {onNavigate && (
        <nav className="border-b border-primary/20 bg-card">
          <div className="container mx-auto px-4">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate('subscribers')}
                className={currentPage === 'subscribers' ? 'text-primary' : ''}
              >
                Subscribers
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate('reports')}
                className={currentPage === 'reports' ? 'text-primary' : ''}
              >
                Reports
              </Button>
            </div>
          </div>
        </nav>
      )}
      
      <main className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
```

### 2. Adding a New Component

#### Step 1: Create Component File

```typescript
// components/subscribers/ExportButton.tsx
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  subscribers: any[];
}

export function ExportButton({ subscribers }: ExportButtonProps) {
  const handleExport = () => {
    // Convert to CSV
    const csv = convertToCSV(subscribers);
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
  };

  const convertToCSV = (data: any[]) => {
    const headers = ['Name', 'Email', 'Phone', 'Year'];
    const rows = data.map(s => [s.name, s.email, s.phone, s.subscription_year]);
    
    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  };

  return (
    <Button
      onClick={handleExport}
      className="bg-primary text-black hover:bg-primary/90"
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}
```

#### Step 2: Use in Page

```typescript
// pages/SubscribersPage.tsx
import { ExportButton } from '../components/subscribers/ExportButton';

// Inside your component
<div className="flex justify-between">
  <h2>Subscribers</h2>
  <ExportButton subscribers={filteredSubscribers} />
</div>
```

### 3. Adding a New API Endpoint (Supabase)

```typescript
// In your page component
const handleBulkUpdate = async (year: number) => {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-cd70e814/subscribers/bulk-update`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to bulk update');
    }

    const data = await response.json();
    // Handle response
  } catch (error) {
    console.error('Error:', error);
  }
};
```

And add to server:

```typescript
// supabase/functions/server/index.tsx
app.post('/make-server-cd70e814/subscribers/bulk-update', async (c) => {
  const { year } = await c.req.json();
  
  // Get all subscribers
  const subscribers = await kv.getByPrefix('subscriber:');
  
  // Update all
  const updates = subscribers.map(sub => ({
    ...sub,
    subscription_year: year,
    updated_at: new Date().toISOString(),
  }));
  
  await kv.mset(updates.map(u => [`subscriber:${u.id}`, u]));
  
  return c.json({ updated: updates.length });
});
```

## Best Practices

### Component Design

1. **Keep components small and focused**
```typescript
// ✅ Good - Single responsibility
function SubscriberName({ name }: { name: string }) {
  return <span className="text-foreground">{name}</span>;
}

// ❌ Bad - Too many responsibilities
function SubscriberEverything({ subscriber }: { subscriber: Subscriber }) {
  // Handles display, editing, deleting, etc.
}
```

2. **Use TypeScript interfaces**
```typescript
// ✅ Good
interface Subscriber {
  id: string;
  name: string;
  email: string;
}

function SubscriberCard({ subscriber }: { subscriber: Subscriber }) {
  // ...
}

// ❌ Bad
function SubscriberCard({ subscriber }: { subscriber: any }) {
  // ...
}
```

3. **Extract reusable logic**
```typescript
// ✅ Good
function useSubscribers(accessToken: string) {
  const [subscribers, setSubscribers] = useState([]);
  
  const fetchSubscribers = async () => {
    // Fetch logic
  };
  
  useEffect(() => {
    fetchSubscribers();
  }, []);
  
  return { subscribers, refetch: fetchSubscribers };
}

// Use in components
const { subscribers, refetch } = useSubscribers(accessToken);
```

### Styling

1. **Use theme tokens from globals.css**
```typescript
// ✅ Good
<div className="bg-background text-foreground border-primary">

// ❌ Bad
<div className="bg-black text-white border-yellow-500">
```

2. **Responsive design**
```typescript
// ✅ Good - Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ Bad - Desktop only
<div className="grid grid-cols-3">
```

### Error Handling

```typescript
// ✅ Good
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Error fetching data:', error);
  // Show user-friendly error message
  toast.error('Failed to load data. Please try again.');
}

// ❌ Bad
const data = await fetch(url).then(r => r.json());
```

## Testing

### Manual Testing Checklist

Before committing changes:

- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile (responsive view)
- [ ] Test with sample data
- [ ] Test with empty state
- [ ] Test with large dataset (200+ items)
- [ ] Test error scenarios
- [ ] Check console for errors/warnings
- [ ] Verify all buttons work
- [ ] Test search and filters
- [ ] Test CRUD operations

### Test Data

Use the "Carica Dati Test" button to seed test data:
- 50+ sample subscribers
- Various years (2023-2025)
- Different status (active/deleted)
- Mix of complete and partial data

## Common Tasks

### Update to Latest Shadcn Components

```bash
# Check available components
npx shadcn-ui@latest add

# Add new component
npx shadcn-ui@latest add [component-name]
```

### Add Icons

```typescript
// Import from lucide-react
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

// Use in components
<Mail className="h-4 w-4 text-primary" />
```

### Debug API Calls

```typescript
// Add detailed logging
const fetchSubscribers = async () => {
  console.log('Fetching subscribers...', { accessToken: accessToken.slice(0, 10) + '...' });
  
  try {
    const response = await fetch(url, { headers });
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

### Format Dates

```typescript
// Format dates consistently
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Usage
<span>{formatDate(subscriber.created_at)}</span>
```

## Git Workflow

### Commit Message Format

```
Type: Short description

Longer description if needed

- Bullet points for details
```

**Types:**
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Changes to existing feature
- `Refactor:` Code restructuring
- `Docs:` Documentation changes
- `Style:` Formatting, styling changes

**Examples:**
```bash
git commit -m "Add: Export to CSV functionality"
git commit -m "Fix: Pagination not resetting on filter change"
git commit -m "Update: Improve mobile responsive layout"
```

### Branch Naming

```
feature/export-csv
fix/pagination-reset
update/mobile-layout
refactor/api-client
```

## Resources

### Documentation
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/)

### Tools
- [Lucide Icons](https://lucide.dev/) - Icon search
- [Tailwind Color Generator](https://uicolors.app/) - Color palettes
- [TypeScript Playground](https://www.typescriptlang.org/play) - Test TS code

### Learning
- [React Tutorial](https://react.dev/learn)
- [TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs/utility-first)

## Getting Help

1. **Check documentation** - See all .md files in project root
2. **Search issues** - Check if someone else had the same problem
3. **Ask the team** - Reach out to other developers
4. **Console logs** - Check browser console for errors

---

Happy coding! 🚀
