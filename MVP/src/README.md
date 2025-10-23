# ekidna APS - Subscriber Management System

> 🚀 **New here?** Start with [START_HERE.md](START_HERE.md) for a quick overview!

A modern subscriber management system for Italian APS (Associazione di Promozione Sociale) organizations.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![MVP](https://img.shields.io/badge/status-MVP-orange)
![Backend](https://img.shields.io/badge/backend-Supabase%20→%20Docker-green)

## 🎯 Overview

ekidna APS helps Italian APS organizations manage their members efficiently with a clean, intuitive interface featuring:
- Complete subscriber management (add, edit, delete)
- Advanced search and filtering
- Subscription year tracking
- Responsive design with dark yellow and black theme
- Pagination for handling 200+ subscribers

## 🏗️ Current Status

**MVP Version**: Uses Supabase for rapid prototyping  
**Production Plan**: Will migrate to Docker-based backend (see [DOCKER_MIGRATION.md](DOCKER_MIGRATION.md))

## 📋 Features

### Core Features
✅ **User Authentication** - Secure login/logout system  
✅ **Subscriber Management** - Full CRUD operations  
✅ **Edit All Fields** - Name, email, phone, address, subscription year  
✅ **Soft Delete** - Mark subscribers as deleted without losing data  
✅ **Advanced Search** - Search by name, email, phone, or address  
✅ **Smart Filters** - Filter by subscription year and status  
✅ **Statistics Dashboard** - Quick overview of subscriber counts  
✅ **Pagination** - Efficient handling of large subscriber lists (25 per page)  
✅ **Responsive Design** - Mobile-friendly interface  

### Future Features
🔜 Payment tracking and history  
🔜 Email notifications for renewals  
🔜 Reports and analytics  
🔜 Document management  
🔜 Bulk operations and CSV export  
🔜 Multi-user roles and permissions  

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Supabase account (for MVP)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ekidna-aps

# Install dependencies
npm install

# Start development server
npm start
```

### First Time Setup

1. **Login**: Use your Supabase credentials
2. **Seed Data**: Click "Carica Dati Test" to load sample subscribers
3. **Explore**: Try searching, filtering, editing subscribers

## 📁 Project Structure

```
ekidna-aps/
├── components/
│   ├── layout/              # Layout components (Header, etc.)
│   ├── subscribers/         # Subscriber-specific components
│   │   ├── AddSubscriberDialog.tsx
│   │   ├── EditSubscriberDialog.tsx
│   │   ├── SubscribersTable.tsx
│   │   └── ... more
│   └── ui/                  # Shadcn/UI components
├── pages/
│   └── SubscribersPage.tsx  # Main subscribers page
├── utils/
│   └── supabase/            # Supabase utilities (will be replaced)
├── styles/
│   └── globals.css          # Global styles and theme
└── App.tsx                  # Application entry point
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed documentation.

## 🎨 Design System

### Colors
- **Primary**: Dark Yellow (`#FDB813`)
- **Background**: Black (`#000000`)
- **Text**: White (`#FFFFFF`)
- **Muted**: Gray tones

### Components
Built with [Shadcn/UI](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/)

## 🔧 Development

### Key Commands
```bash
npm start          # Start development server
npm run build      # Build for production
npm run lint       # Run linter
```

### Adding New Features

1. **New Component**: Add to `/components/[category]/`
2. **New Page**: Add to `/pages/` and update Dashboard.tsx
3. **New API Route**: Update backend server (see docs)

Example:
```typescript
// Create a new page
// pages/ReportsPage.tsx
export function ReportsPage({ accessToken }: { accessToken: string }) {
  return <div>Reports Content</div>;
}

// Add to Dashboard
import { ReportsPage } from '../pages/ReportsPage';
```

## 📊 API Routes

Base: `https://{projectId}.supabase.co/functions/v1/make-server-cd70e814`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/subscribers` | GET | Get all subscribers |
| `/subscribers` | POST | Create subscriber |
| `/subscribers/:id` | PUT | Update subscriber |
| `/subscribers/:id` | DELETE | Soft delete subscriber |
| `/seed` | POST | Seed test data |

## 🐳 Docker Migration

This MVP uses Supabase for rapid development. For production deployment with Docker:

1. Read [DOCKER_MIGRATION.md](DOCKER_MIGRATION.md)
2. Follow the step-by-step migration guide
3. Update frontend to use new API endpoints
4. Deploy with docker-compose

### Benefits of Docker
- Full infrastructure control
- No vendor lock-in
- Cost-effective scaling
- Complete data ownership
- Custom authentication

## 📱 Screenshots

### Dashboard View
Displays statistics and subscriber table with search/filter controls.

### Edit Subscriber
Modal dialog for editing all subscriber fields.

### Mobile View
Responsive design that works on all devices.

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS v4
- Shadcn/UI components
- Lucide React icons

### Backend (Current - MVP)
- Supabase PostgreSQL
- Supabase Auth
- Supabase Edge Functions

### Backend (Future - Production)
- Docker
- PostgreSQL
- Node.js/Express
- JWT Authentication

## 📝 Documentation

**→ [📚 Complete Documentation Index](DOCUMENTATION_INDEX.md)** - Find all docs organized by topic

### Overview & Structure
- [README.md](README.md) - This file (start here!)
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Detailed architecture and structure
- [DEVELOPMENT.md](DEVELOPMENT.md) - 👨‍💻 Development workflow and best practices
- [CHANGELOG.md](CHANGELOG.md) - Version history and changes

### Docker Migration (Future Production)
- [SUPABASE_VS_DOCKER.md](SUPABASE_VS_DOCKER.md) - ⭐ Compare Supabase vs Docker (start here!)
- [DOCKER_MIGRATION.md](DOCKER_MIGRATION.md) - Complete step-by-step migration guide
- [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md) - 🚀 Quick Docker setup in 5 steps
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment and maintenance

## 🤝 Contributing

This is an MVP project. To contribute:

1. Review the project structure
2. Check the migration plan
3. Follow the existing code patterns
4. Test thoroughly before submitting

## 📄 License

[Your License Here]

## 🙋 Support

For questions or issues, please contact the development team.

---

**Built with ❤️ for Italian APS organizations**
