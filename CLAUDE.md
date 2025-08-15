# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cobuilder is a Next.js application using a modern TypeScript stack for collaborative design and project management. The application features role-based access control, project management, and block-based design collaboration.

## Technology Stack

- **Frontend**: Next.js 15.4.6 with React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components with Radix UI primitives
- **API**: tRPC v11 for type-safe APIs
- **Database**: Kysely for type-safe SQL queries, Neon PostgreSQL
- **Authentication**: NextAuth.js v5 (beta) with Google OAuth
- **State Management**: TanStack Query (React Query) v5
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Sonner for toast notifications
- **Deployment**: Vercel (frontend), Neon (database)

## Development Commands

- `pnpm run dev` - Start development server with Turbopack
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm db:migrate` - Run database migrations
- `pnpm db:migrate:down` - Rollback database migrations

## Project Structure

### Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── blocks/            # Block editor pages
│   ├── projects/          # Project management pages
│   └── api/               # API routes
├── components/
│   ├── hooks/             # Custom React hooks
│   ├── layout/            # Layout components (header, navigation)
│   ├── providers/         # Context providers
│   └── ui/                # shadcn/ui components
├── schema/                # Zod schemas and TypeScript types
│   ├── user-schema.ts     # User and auth schemas
│   ├── project-schema.ts  # Project management schemas
│   └── block-schema.ts    # Design block schemas
├── server/                # Server-side code
│   ├── api/               # tRPC routers and procedures
│   ├── auth/              # NextAuth configuration
│   └── db/                # Database setup and migrations
├── trpc/                  # tRPC client configuration
├── types/                 # Global TypeScript definitions
└── lib/                   # Utility functions
```

### URL Structure

```
/ - Welcome page
/(management) - Layout for management sidebar
/(management)/projects - Project management page
/(management)/users - User management page
/builder/[projectSlug] - Layout for project sidebar
/builder/[projectSlug] - Project page
/builder/[projectSlug]/[blockSlug] - Block page
```

## Authentication and Authorization

### Role Hierarchy
1. **ADMIN** - User with email "tvhoang91@gmail.com"
   - Full system access including user management
   - Cannot change own role (prevented in backend)
   
2. **DESIGNER** - Assigned by admin
   - Access to all features except user management
   - Can collaborate on projects and blocks
   
3. **GUEST** - Default role for new Google OAuth users
   - Limited access, primarily Welcome page
   - Must contact admin for elevated permissions
   
4. **PUBLIC** - Unauthenticated users
   - Can only see Welcome page with login button

### tRPC Procedures
- `protectedProcedure` - Any authenticated user
- `adminProcedure` - ADMIN role only
- `designerProcedure` - DESIGNER and ADMIN roles

## Key Features Implemented

### User Management (Admin)
- User table with avatar, name, email, role columns
- Role assignment dropdown (DESIGNER/GUEST)
- Protected admin-only access

### Database Schema
- Users with roles and OAuth integration
- Projects and blocks structure ready
- Kysely migrations system

### UI Components
Available shadcn/ui components:
- Table, Card, Select, Avatar, Button, Badge
- Dialog, Dropdown Menu, Form, Input, Label
- Navigation Menu, Pagination, Textarea, Tooltip
- All components use Tailwind CSS v4 and Radix UI

## API Routes

### tRPC Routers
- `user` - User management, profile, role updates
  - `getAllUsers` (admin) - Get all users for admin table
  - `updateRole` (admin) - Update user roles
  - `getProfile` (protected) - Get current user profile
  - `getCollaborators` (designer) - Get users for collaboration

## Database

### Tables
- `User` - User profiles with role-based access
- `Account` - OAuth account linking
- `Session` - User sessions
- `VerificationToken` - Email verification tokens
- Projects and Blocks tables (schema defined, migrations pending)

### Migrations
- Located in `src/server/db/migrations/`
- Run with `pnpm db:migrate`
- Initial migration creates auth tables

## Environment Setup
- Uses `.env.local` for environment variables
- Database connection via Neon PostgreSQL
- NextAuth configuration for Google OAuth

## Code Patterns

### File Naming
- kebab-case for files and directories
- PascalCase for React components
- Descriptive names for pages and components

### Import Structure
- External libraries first
- Internal components and utilities
- Type imports last

### Error Handling
- tRPC error throwing in mutations
- Form validation with Zod schemas
- Toast notifications for user feedback

### Server-side + Client-side tRPC Pattern
For pages that need server-side data loading with client-side mutations (like admin page):

**Server Component (page.tsx)**:
```typescript
import { api, HydrateClient } from '@/trpc/server'
import { auth } from '@/server/auth'

export default async function Page() {
  const session = await auth()
  const data = await api.someRouter.someQuery()
  
  return (
    <HydrateClient>
      <ClientComponent initialData={data} />
    </HydrateClient>
  )
}
```

**Client Component**:
```typescript
'use client'
import { api } from '@/trpc/react'

export function ClientComponent({ initialData }) {
  const { data } = api.someRouter.someQuery.useQuery(undefined, {
    initialData,
    refetchOnMount: false,
  })
  
  const utils = api.useUtils()
  const mutation = api.someRouter.someMutation.useMutation({
    onSuccess: () => utils.someRouter.someQuery.invalidate()
  })
  
  // Interactive UI with mutations...
}
```

This pattern provides:
- Fast initial load (server-side data)
- Client-side mutations and cache invalidation
- No loading states on initial render

## Notes for Development

- Always use existing UI components from `src/components/ui/`
- Follow the established tRPC pattern for new API endpoints
- Respect role-based access controls in both frontend and backend
- Use Kysely for type-safe database queries
- Prefer server components where possible, use 'use client' only when needed