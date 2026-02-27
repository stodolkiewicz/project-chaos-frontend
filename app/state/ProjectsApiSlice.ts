import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { UserProjectsResponseDTO } from "../types/UserProjectsResponseDTO";
import { ProjectDTO } from "../types/ProjectDTO";
import { CreateProjectRequestDTO } from "../types/CreateProjectRequestDTO";
import { CreateProjectResponseDTO } from "../types/CreateProjectResponseDTO";
import { API_CONFIG } from "@/lib/apiConfig";
import usersApi from "./UsersApiSlice";

export const projectsApi = createApi({
  reducerPath: "ProjectsApi",
  tagTypes: ["Project"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_CONFIG.baseUrl}/api/v1/projects`,
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
    getUserProjects: builder.query<UserProjectsResponseDTO, string>({
      query: (email) => ``,
      providesTags: (result, error, email) => 
        result ? 
          [
            ...result.projects.map(({ projectId }) => ({ type: 'Project' as const, id: projectId })),
              { type: 'Project', id: 'LIST' }
          ] 
        : 
          [{ type: 'Project', id: 'LIST' }],
    }),
    getProject: builder.query<ProjectDTO, string>({
      query: (projectId) => `${projectId}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation<
      CreateProjectResponseDTO,
      CreateProjectRequestDTO
    >({
      query: (createProjectRequestDTO) => ({
        url: ``,
        method: "POST",
        body: createProjectRequestDTO,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            projectsApi.util.invalidateTags([
              { type: "Project", id: "LIST" }
            ]),
          );

          dispatch(
            usersApi.util.invalidateTags([
              { type: "DefaultProject" }
            ])
          );
        } catch (error) {
          console.error("Failed to create project:", error);
        }
      },
    }),

    deleteProject: builder.mutation<void, string>({
      query: (projectId) => ({
        url: `/${projectId}`,
        method: "DELETE",
      }),
      async onQueryStarted(projectId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate ProjectsApi cache
          dispatch(
            projectsApi.util.invalidateTags([
              { type: 'Project', id: projectId },
              { type: 'Project', id: 'LIST' }
            ])
          );
          // Invalidate UsersApi cache (default project might have changed)
          dispatch(
            usersApi.util.invalidateTags([
              { type: "DefaultProject" }
            ])
          );
        } catch (error) {
          console.error("Failed to delete project:", error);
        }
      },
    }),

  }),
});

export const {
  useGetUserProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
export default projectsApi;
