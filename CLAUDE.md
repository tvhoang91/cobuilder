# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cobuilder is a Next.js application using a modern TypeScript stack. This repository is currently in its initial stages of development.

## Technology Stack

- **Frontend**: Next.js with React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **API**: tRPC for type-safe APIs
- **Database**: Kysely for type-safe SQL queries
- **Authentication**: NextAuth.js
- **State Management**: TanStack Query (React Query)
- **Deployment**: Vercel (frontend), Neon (database)

## Development Commands

*Note: Commands will be updated once package.json is created*

Typical Next.js commands:
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint
- `pnpm run type-check` - Run TypeScript compiler check

## Project Structure

*Note: Structure will be updated as the project develops*

Expected structure for this stack:
- `app/` - Next.js App Router pages and layouts
- `components/` - React components (shadcn/ui)
- `server/` - tRPC routers and procedures
- `lib/` - Utility functions and configurations
- `server/db/` - Database schema and migrations (Kysely)
- `schema/` - Database schema and migrations (Kysely)
- `lib/env.js` - Environment variables
- `lib/trpc/` - tRPC client and server-side code

## Development Notes

- Use App Router (Next.js 13+) for routing
- Follow shadcn/ui component patterns for consistent styling
- Implement tRPC procedures for type-safe API endpoints
- Use Kysely for database operations with full type safety
- Configure NextAuth.js for authentication flows
- Leverage TanStack Query for client-side data fetching and caching