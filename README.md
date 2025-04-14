# Project Chaos

Kanban Board project in Next.js (https://nextjs.org/) and Spring Boot on the backend (https://github.com/stodolkiewicz/project-chaos-backend). Logging in is done via Google oauth2.

## Commands

```bash
npm run dev
```

## Technical Explanations

### /midleware.ts

Used for securing paths, which are meant only for logged in users.  
Checks if there exists cookie "access_token" and if it is not expired.  
ok -> let the request through  
not ok -> redirect to /

## Libraries

1. React icons:  
   https://react-icons.github.io/react-icons/icons/fc/

2. tailwindcss  
   https://tailwindcss.com/

3. shadcn/ui  
   https://ui.shadcn.com/

## Useful Links

1. Convertico  
   Convert PNG to ICO  
   https://convertico.com/
