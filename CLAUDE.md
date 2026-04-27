# Project Chaos Frontend - Claude Instructions

## Critical File Creation Rule
ALWAYS check if a file exists in the project before creating a new one (use Bash ls or Glob to search). The only exceptions are layout.tsx or page.tsx files which are framework-specific and their locations are predetermined by Next.js routing.

## Communication Rule
When Dawid asks a question, he wants an answer - not suggestions to change or remove what was just implemented. Answer the question directly without offering to undo or modify recent work unless explicitly asked.

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

## Custom Color Palette
Use these predefined primary colors instead of generic Tailwind colors:
- `primary-lighter-3` - #ebf8ff (very light blue)
- `primary-lighter-2` - #c9eaff (light blue)
- `primary-lighter-1` - #abdcff (lighter blue)
- `primary` - #2b7fff (main brand blue)
- `primary-darker-1` - #1953bf (darker blue)
- `primary-darker-2` - #0f3b99 (dark blue)
- `primary-darker-3` - #092773 (very dark blue)
- `primary-darker-4` - #010721 (almost black blue)

Available as Tailwind classes: `bg-primary`, `text-primary-darker-2`, `border-primary-lighter-1`, etc.

## Dashboard Color Usage
Additional colors used specifically on dashboard:
- `azure-600` - Used for button hover effects (form submit buttons)
- `green-600`, `green-200` - Used for icon hover effects (add task buttons)
- Standard Tailwind greens (`green-100`, `green-800`) - Used for role badges and status indicators

**Headers Style (consistent across app):**
- `bg-primary text-primary-foreground` - Main primary blue background with white text
- Used in: Dashboard column headers, ProjectInformation header, component headers
- Standard pattern: `<div className="bg-primary px-6 py-4"><h2 className="text-primary-foreground">Title</h2></div>`

**Color Selection Priority:**
1. Use custom `primary-*` colors first (brand consistency)
2. If need different colors, prefer existing dashboard colors (`azure-600`, `green-*`)
3. Only use new Tailwind colors if above options don't fit the use case

## Commands
- `npm run dev` - Development server
- `npm run build` - Production build (also runs the TypeScript type-check; this
  is the only mechanical correctness gate used in this project)
- `npm run start` - Run the production build (`node server.js` per `package.json`)

Note: `next lint` exists in `package.json` but is intentionally NOT part of the
workflow — do not add `npm run lint` to plans, tasks, or quality gates. There
is no separate `typecheck` script; the type-check happens during `npm run build`.

<!-- SPECKIT START -->
Active Spec Kit feature: `001-confetti-on-completion`.
For technical context, structure, dependencies, and the constitution-check
verdict for this feature, read:
`specs/001-confetti-on-completion/plan.md`
(plus its sibling `research.md`, `data-model.md`, `quickstart.md`, and `spec.md`).
<!-- SPECKIT END -->
