# Project Chaos

## Libraries

1. Mantine  
   https://mantine.dev/

2. React icons:  
   https://react-icons.github.io/react-icons/icons/fc/

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
