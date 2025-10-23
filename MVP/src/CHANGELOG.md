# Changelog

## Version 2.0.0 - Restructured for Scalability (Supabase MVP)

⚠️ **Important**: This version uses Supabase for rapid MVP development. The final production version will migrate to Docker. See `DOCKER_MIGRATION.md` for details.

### Major Changes

#### 1. Component Reorganization
- **Created modular component structure** for better maintainability
- Separated subscriber-related components into `/components/subscribers/` directory
- Created layout components in `/components/layout/` directory

#### 2. New Component Structure
```
/components/
├── layout/
│   └── Layout.tsx                   # Main app layout wrapper
├── subscribers/
│   ├── AddSubscriberDialog.tsx     # Add new subscriber
│   ├── EditSubscriberDialog.tsx    # Edit all subscriber fields ✨ NEW
│   ├── DeleteConfirmDialog.tsx     # Delete confirmation
│   ├── SubscribersTable.tsx        # Paginated table view
│   ├── SubscribersFilters.tsx      # Search and filter controls
│   └── SubscriberStats.tsx         # Statistics dashboard
```

#### 3. Pages Architecture
- Created `/pages/` directory for page-level components
- `SubscribersPage.tsx` contains all subscriber management logic
- Dashboard.tsx now acts as a routing wrapper (ready for future pages)

#### 4. Full Field Editing
- **Now possible to edit ALL subscriber fields** (name, email, phone, address, year)
- Click the edit icon on any row to open the edit dialog
- Validation and error handling included

#### 5. Improved Table View
- Compact table layout replaces card grid
- Displays 25 subscribers per page (pagination)
- Responsive design: hides less critical columns on mobile
- Better for handling 200+ subscribers

#### 6. Better Code Organization
- Separated concerns: UI components, business logic, and pages
- Easier to add new features and pages
- Clear structure for team collaboration

### Features
✅ Edit all subscriber fields (not just year)
✅ Paginated table view (25 items per page)
✅ Responsive table (adaptive columns)
✅ Modular component structure
✅ Ready for future page additions
✅ Better maintainability

### Technical Improvements
- Removed unused `SubscriberCard.tsx` component
- Consolidated dialog components
- Improved type safety with shared interfaces
- Better separation of concerns

### Future Ready
The new structure makes it easy to add:
- Reports page
- Settings page
- User management
- Payment tracking
- Document management
- Any other features

See `PROJECT_STRUCTURE.md` for detailed documentation.

---

## Version 1.0.0 - Initial MVP
- Basic subscriber management
- Authentication system
- Search and filters
- Card-based view
- Inline year editing only
