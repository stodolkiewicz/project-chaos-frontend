import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { ProjectUsersDTO } from "../types/ProjectUsersDTO";
import { ChangeDefaultProjectRequestDTO } from "../types/ChangeDefaultProjectRequestDTO";
import { setDefaultProjectId } from "./userSlice";
import projectsApi from "./ProjectsApiSlice";

export const usersApi = createApi({
  reducerPath: "UsersApi",
  tagTypes: ["Users"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/users",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getProjectUsers: builder.query<ProjectUsersDTO, string>({
      query: (projectId) => `/${projectId}/users`,
      providesTags: (result, error, projectId) => [
        { type: "Users", id: projectId },
      ],
    }),
    changeProjectForUser: builder.mutation<
      void,
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
        // Save previous state for rollback
        const previousProjectId = (getState() as RootState).user
          .defaultProjectId;
        try {
          // optimistic update
          dispatch(
            setDefaultProjectId(
              changeDefaultProjectRequestDTO.newDefaultProjectId
            )
          );

          await queryFulfilled;

          projectsApi.util.invalidateTags([
            {
              type: "DefaultProject",
              id: changeDefaultProjectRequestDTO.newDefaultProjectId,
            },
          ]);
        } catch (error) {
          // Rollback przy błędzie
          dispatch(setDefaultProjectId(previousProjectId));

          // Invalidate cache dla poprzedniego projektu (rollback)
          projectsApi.util.invalidateTags([
            {
              type: "DefaultProject",
              id: previousProjectId,
            },
          ]);

          console.error("Failed to change project:", error);
        }
      },
    }),
  }),
});

export const { useGetProjectUsersQuery, useChangeProjectForUserMutation } =
  usersApi;
export default usersApi;
