# Project Chaos Frontend - Claude Instructions

## Project Overview
This is a Kanban project management application built with Next.js 15, TypeScript, and Spring Boot backend.

## Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form for form handling
- **Authentication**: JWT with middleware protection
- **Drag & Drop**: @dnd-kit

## Key Directories
- `/app/(routes)/` - Main application routes (dashboard, projects, settings)
- `/app/state/` - Redux slices and RTK Query API definitions
- `/app/types/` - TypeScript type definitions
- `/components/ui/` - shadcn/ui components
- `/lib/` - Utility functions

## Development Guidelines
- Follow existing TypeScript patterns and types in `/app/types/`
- Use RTK Query for all API calls (defined in `/app/state/api/`)
- Maintain consistent error handling with toast notifications (Sonner)
- Follow Next.js 15 App Router patterns (Server/Client Components)

## Important Files
- `middleware.ts` - JWT authentication protection
- `app/store.ts` - Redux store configuration
- `app/(routes)/layout.tsx` - Authenticated layout wrapper
- `next.config.js` - Next.js config with standalone output

## Code Conventions
- Components in PascalCase
- Files and directories in kebab-case
- Use TypeScript interfaces from `/app/types/`
- Follow existing API slice patterns for new endpoints
- Use Tailwind CSS classes consistently with existing components

## Commands
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - ESLint checking
- `npm run typecheck` - TypeScript checking