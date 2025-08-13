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

Expected structure for this stack. Add this after initial setup:

## Authentication and Authorization

- ADMIN is the user with email "tvhoang91@gmail.com"
- DESIGNER: admin give the user role DESIGNER. designer could access to all features except Manage User.
- GUEST: anyone could login with Google Account. only see the Welcome page ask to contact admin
- PUBLIC: before login, user could see the Welcome page with Login Button