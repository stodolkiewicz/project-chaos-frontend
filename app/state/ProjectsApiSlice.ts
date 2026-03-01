import { UserProjectsResponseDTO } from "../types/UserProjectsResponseDTO";
import { ProjectDTO } from "../types/ProjectDTO";
import { CreateProjectRequestDTO } from "../types/CreateProjectRequestDTO";
import { CreateProjectResponseDTO } from "../types/CreateProjectResponseDTO";
import { ProjectUsersDTO } from "../types/ProjectUsersDTO";
import baseApi from "./baseApi";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProjects: builder.query<UserProjectsResponseDTO, string>({
      query: (email) => `/api/v1/projects`,
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
      query: (projectId) => `/api/v1/projects/${projectId}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    getProjectUsers: builder.query<ProjectUsersDTO, string>({
      query: (projectId) => `/api/v1/projects/${projectId}/users`,
      providesTags: (result, error, projectId) => [
        { type: "Project", id: projectId },
      ],
    }),
    createProject: builder.mutation<
      CreateProjectResponseDTO,
      CreateProjectRequestDTO
    >({
      query: (createProjectRequestDTO) => ({
        url: `/api/v1/projects`,
        method: "POST",
        body: createProjectRequestDTO,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            baseApi.util.invalidateTags([
              { type: "Project", id: "LIST" },
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
        url: `/api/v1/projects/${projectId}`,
        method: "DELETE",
      }),
      async onQueryStarted(projectId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate cache
          dispatch(
            baseApi.util.invalidateTags([
              { type: 'Project', id: projectId },
              { type: 'Project', id: 'LIST' },
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
  useGetProjectUsersQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;

export default projectsApi;
