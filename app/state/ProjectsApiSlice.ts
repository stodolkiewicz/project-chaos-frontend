import { UserProjectsResponseDTO } from "../types/UserProjectsResponseDTO";
import { ProjectDTO } from "../types/ProjectDTO";
import { CreateProjectRequestDTO } from "../types/CreateProjectRequestDTO";
import { CreateProjectResponseDTO } from "../types/CreateProjectResponseDTO";
import { ProjectUsersDTO } from "../types/ProjectUsersDTO";
import { AssignUserToProjectRequestDTO } from "../types/AssignUserToProjectRequestDTO";
import { AssignUserToProjectResponseDTO } from "../types/AssignUserToProjectResponseDTO";
import { UnassignUserFromProjectRequestDTO } from "../types/UnassignUserFromProjectRequestDTO";
import { ChangeUserRoleRequestDTO } from "../types/ChangeUserRoleRequestDTO";
import { ChangeUserRoleResponseDTO } from "../types/ChangeUserRoleResponseDTO";
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
      providesTags: (result, error, id) => [{ type: "ProjectUsers", id }],
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
      invalidatesTags: [{ type: "Project", id: "LIST" }, "DefaultProject"],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (projectId) => ({
        url: `/api/v1/projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, projectId) => [
        { type: "Project", id: projectId },
        { type: "Project", id: "LIST" },
        "DefaultProject",
      ],
    }),

    addUserToProject: builder.mutation<
      AssignUserToProjectResponseDTO,
      { projectId: string; userData: AssignUserToProjectRequestDTO }
    >({
      query: ({ projectId, userData }) => ({
        url: `/api/v1/projects/${projectId}/users`,
        method: "PATCH",
        body: userData,
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate tags after successful mutation
          dispatch(
            baseApi.util.invalidateTags([{ type: "ProjectUsers", id: projectId }])
          );
        } catch (error) {
          console.error("Failed to add user to project:", error);
        }
      },
    }),

    removeUserFromProject: builder.mutation<
      void,
      { projectId: string; userData: UnassignUserFromProjectRequestDTO }
    >({
      query: ({ projectId, userData }) => ({
        url: `/api/v1/projects/${projectId}/users`,
        method: "DELETE",
        body: userData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "ProjectUsers", id: projectId },
        { type: "Project", id: projectId },
        "DefaultProject",
      ],
    }),

    changeUserRole: builder.mutation<
      ChangeUserRoleResponseDTO,
      { projectId: string; userId: string; roleData: ChangeUserRoleRequestDTO }
    >({
      query: ({ projectId, userId, roleData }) => ({
        url: `/api/v1/projects/${projectId}/users/${userId}/role`,
        method: "PATCH",
        body: roleData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "ProjectUsers", id: projectId }, 
        { type: "Project", id: projectId },
      ],
    }),

  }),
});

export const {
  useGetUserProjectsQuery,
  useGetProjectQuery,
  useGetProjectUsersQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useAddUserToProjectMutation,
  useRemoveUserFromProjectMutation,
  useChangeUserRoleMutation,
} = projectsApi;

export default projectsApi;
