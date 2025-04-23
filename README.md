# Project Chaos

Kanban Board project in Next.js (https://nextjs.org/) and Spring Boot on the backend (https://github.com/stodolkiewicz/project-chaos-backend). Logging in is done via Google oauth2.

## Todo

1. Add db tables on the backend
2. RTK Query, get some data

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

4. React Redux  
   https://react-redux.js.org/

5. Redux Toolkit - recommended way of writing Redux  
   https://redux-toolkit.js.org/  
   Also includes RTK Query for data fetching and caching,

## Useful Links

1. Convertico  
   Convert PNG to ICO  
   https://convertico.com/

## Design Decisions

### Interaktywny onboarding z szybkim setupem

W tym podejściu po pierwszym logowaniu użytkownik widzi krótki, interaktywny onboarding, który:
Kluczowe elementy:
Półautomatyczne tworzenie projektu - pokazujesz prefilled formularz z proponowaną nazwą (np. "Jan's Project"), ale dajesz możliwość jej zmiany.

Za:
Łączy poczucie kontroli z szybkim startem
Użytkownik uczy się aplikacji podczas tworzenia projektu

Przykład implementacji:
Po logowaniu przekieruj do /dashboard/onboarding
Pokaż lekki modal/overlay z kilkoma krokami:
Krok 1: "Witaj [Imię]! Nadaj nazwę swojemu pierwszemu projektowi:" (prefilled pole)
Krok 2: "Świetnie! Twój projekt jest gotowy." (przycisk "Przejdź do projektu")

Po zakończeniu onboardingu przekieruj do /dashboard/project/[id].

### Storing default user's project

Table users, column default_project_id is to be added on the backend.
OAuth2LoginSuccessHandler will check if user has default_project_id and will redirect to:

- /dashboard/onboarding if not
- /dashboard/project/project_id if yes

### Blogs, tutorials, etc.

1. Redux - Complete Tutorial (with Redux Toolkit)
   https://www.youtube.com/watch?v=5yEG6GhoJBs
