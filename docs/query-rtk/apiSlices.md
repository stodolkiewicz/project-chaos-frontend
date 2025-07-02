# API Slices

## Normal Query Update

1. Wysyłasz mutację (np. POST /project)

2. Jak się uda → RTK robi refetch wszystkich zapytań z podanym tagiem (np. ['Project'])

3. Dopiero po tym zobaczysz nowe dane

## Pessimistic Query Update

1. Wysyłasz mutację

2. Jak się uda → sam ręcznie aktualizujesz cache

3. **Nie ma refetcha**, ale dane od razu się zmieniają (jak tylko masz wynik z serwera)

## Optimistic Query Update

Działa jak "udawanie", że zmiana już zaszła — aktualizujesz cache od razu, a potem:  
jeśli mutacja się udała — nic nie robisz,  
jeśli mutacja się nie udała — cofasz zmianę.

UsersApiSlice.ts

```javascript
  ...
  endpoints: (builder) => ({
    changeProjectForUser: builder.mutation<
      void, // - response, void for "dont care"
      ChangeDefaultProjectRequestDTO
    >({
      query: (changeDefaultProjectRequestDTO) => ({
        url: `default-project`,
        method: "PATCH",
        body: changeDefaultProjectRequestDTO,
      }),
      async onQueryStarted(
        changeDefaultProjectRequestDTO,
        { dispatch, queryFulfilled, getState }
      ) {
        // Optimistic update - immediately update cache
        const patchResult = dispatch(
          projectsApi.util.updateQueryData(
            "getDefaultProjectId",
            undefined,
            (draft) => {
              // update cache data
              draft.projectId =
                changeDefaultProjectRequestDTO.newDefaultProjectId;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          // undo update if error
          patchResult.undo();
          console.error("Failed to change project:", error);
        }
      },
    }),
  }),
  ...
```
