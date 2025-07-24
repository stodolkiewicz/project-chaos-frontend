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

1. icons:  
   https://react-icons.github.io/react-icons/icons/fc/  
   https://lucide.dev/icons

2. tailwindcss  
   https://tailwindcss.com/

3. shadcn/ui  
   https://ui.shadcn.com/

4. React Redux  
   https://react-redux.js.org/

5. Redux Toolkit - recommended way of writing Redux  
   https://redux-toolkit.js.org/  
   Also includes RTK Query for data fetching and caching,

6. React Hook Form  
   https://react-hook-form.com/get-started

## Useful Links

1. Convertico  
   Convert PNG to ICO  
   https://convertico.com/

### Docs, Blogs, tutorials, etc.

1. Redux - Complete Tutorial (with Redux Toolkit)
   https://www.youtube.com/watch?v=5yEG6GhoJBs

2. Query RTK pessimistic cache updates  
   https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#pessimistic-updates

3. Query RTK caching / tags / refetching  
   https://redux-toolkit.js.org/rtk-query/usage/automated-refetching

4. Next.js caching  
   https://www.youtube.com/watch?v=LVTEKjKHJ5w
