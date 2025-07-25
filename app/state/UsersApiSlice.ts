import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { ProjectUsersDTO } from "../types/ProjectUsersDTO";
import { ChangeDefaultProjectRequestDTO } from "../types/ChangeDefaultProjectRequestDTO";
import projectsApi from "./ProjectsApiSlice";
import { AddUserRequestDTO } from "../types/AddUserRequestDTO";
import { AddUserResponseDTO } from "../types/AddUserResponseDTO";
import { API_CONFIG } from "@/lib/apiConfig";

export const usersApi = createApi({
  reducerPath: "UsersApi",
  tagTypes: ["Users"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_CONFIG.baseUrl}/api/v1/users`,
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
    addUserToProject: builder.mutation<
      AddUserResponseDTO,
      { projectId: string; userData: AddUserRequestDTO }
    >({
      query: ({ projectId, userData }) => ({
        url: `/projects/${projectId}`,
        method: "PATCH",
        body: userData,
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate tags after successful mutation
          dispatch(
            usersApi.util.invalidateTags([{ type: "Users", id: projectId }])
          );
        } catch (error) {
          console.error("Failed to add user to project:", error);
        }
      },
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
          patchResult.undo();
          console.error("Failed to change project:", error);
        }
      },
    }),
  }),
});

export const {
  useGetProjectUsersQuery,
  useChangeProjectForUserMutation,
  useAddUserToProjectMutation,
} = usersApi;
export default usersApi;
