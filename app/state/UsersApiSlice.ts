import { ChangeDefaultProjectRequestDTO } from "../types/ChangeDefaultProjectRequestDTO";
import baseApi from "./baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDefaultProjectId: builder.query<{ projectId: string }, void>({
      query: () => `/api/v1/users/default-project`,
      providesTags: () => [
        { type: "DefaultProject" },
      ],
    }),
    changeProjectForUser: builder.mutation<
      void,
      ChangeDefaultProjectRequestDTO
    >({
      query: (changeDefaultProjectRequestDTO) => ({
        url: `/api/v1/users/default-project`,
        method: "PATCH",
        body: changeDefaultProjectRequestDTO,
      }),
      async onQueryStarted(
        changeDefaultProjectRequestDTO,
        { dispatch, queryFulfilled, getState }
      ) {
        // Optimistic update - immediately update cache
        const patchResult = dispatch(
          
          baseApi.util.updateQueryData("getDefaultProjectId", undefined,(draft) => {
              draft.projectId = changeDefaultProjectRequestDTO.newDefaultProjectId;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Failed to change project:", error);
        }
      },
    }),
  }),
});

export const {
  useGetDefaultProjectIdQuery,
  useChangeProjectForUserMutation,
} = usersApi;
export default usersApi;
