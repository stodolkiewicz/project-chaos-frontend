import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { ChangeDefaultProjectRequestDTO } from "../types/ChangeDefaultProjectRequestDTO";
import { AddUserRequestDTO } from "../types/AddUserRequestDTO";
import { AddUserResponseDTO } from "../types/AddUserResponseDTO";
import { RemoveUserResponseDTO } from "../types/RemoveUserResponseDTO";
import { ChangeUserRoleRequestDTO } from "../types/ChangeUserRoleRequestDTO";
import { ChangeUserRoleResponseDTO } from "../types/ChangeUserRoleResponseDTO";
import { API_CONFIG } from "@/lib/apiConfig";
import projectsApi from "./ProjectsApiSlice";

export const usersApi = createApi({
  reducerPath: "UsersApi",
  tagTypes: ["Users", "DefaultProject"],
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
    getDefaultProjectId: builder.query<{ projectId: string }, void>({
      query: () => `/default-project`,
      providesTags: () => [
        { type: "DefaultProject" },
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
            projectsApi.util.invalidateTags([{ type: "Users", id: projectId }])
          );
        } catch (error) {
          console.error("Failed to add user to project:", error);
        }
      },
    }),
    removeUserFromProject: builder.mutation<
      RemoveUserResponseDTO,
      { projectId: string; userEmail: string }
    >({
      query: ({ projectId, userEmail }) => ({
        url: `/projects/${projectId}/users/${userEmail}`,
        method: "DELETE",
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate tags after successful mutation
          dispatch(
            usersApi.util.invalidateTags(
              [ { type: "Users", id: projectId },
                { type: "DefaultProject" }
              ]
            )
          );

          dispatch(
            projectsApi.util.invalidateTags([
              { type: "Project", id: projectId }
            ]),
          );

        } catch (error) {
          console.error("Failed to remove user from project:", error);
        }
      },
    }),

    changeUserRole: builder.mutation<
      ChangeUserRoleResponseDTO,
      { projectId: string; userEmail: string; roleData: ChangeUserRoleRequestDTO }
    >({
      query: ({ projectId, userEmail, roleData }) => ({
        url: `/projects/${projectId}/users/${userEmail}/role`,
        method: "PUT",
        body: roleData,
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate tags after successful mutation
          dispatch(
            usersApi.util.invalidateTags([{ type: "Users", id: projectId }])
          );
          dispatch(
            projectsApi.util.invalidateTags([
              { type: "Project", id: projectId }
            ])
          );
        } catch (error) {
          console.error("Failed to change user role:", error);
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
          usersApi.util.updateQueryData(
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
  useGetDefaultProjectIdQuery,
  useChangeProjectForUserMutation,
  useAddUserToProjectMutation,
  useRemoveUserFromProjectMutation,
  useChangeUserRoleMutation,
} = usersApi;
export default usersApi;
