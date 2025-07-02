import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { UserProjectsResponseDTO } from "../types/UserProjectsResponseDTO";
import { ProjectDTO } from "../types/ProjectDTO";
import { CreateProjectRequestDTO } from "../types/CreateProjectRequestDTO";
import { SimpleUserProjectsResponseDTO } from "../types/SimpleUserProjectsResponseDTO";
import { CreateProjectResponseDTO } from "../types/CreateProjectResponseDTO";

export const projectsApi = createApi({
  reducerPath: "ProjectsApi",
  tagTypes: ["Projects", "DefaultProject", "SimpleProjects"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/projects",
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
    // not used anywhere yet. path does not have email, but email is used for RTK tags
    getUserProjects: builder.query<UserProjectsResponseDTO, string>({
      query: (email) => ``,
      providesTags: (result, error, email) => [{ type: "Projects" }],
    }),
    getSimpleUserProjects: builder.query<SimpleUserProjectsResponseDTO, string>(
      {
        query: (email) => `/simple`,
        providesTags: (result, error, email) => [{ type: "SimpleProjects" }],
      }
    ),
    getProject: builder.query<ProjectDTO, string>({
      query: (projectId) => `${projectId}`,
      providesTags: (result, error, id) => [{ type: "Projects", id }],
    }),

    getDefaultProjectId: builder.query<{ projectId: string }, void>({
      query: () => `/default`,
      providesTags: (result) => [
        { type: "DefaultProject", id: result?.projectId },
      ],
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
              { type: "Projects", id: data.projectId },
              { type: "DefaultProject" },
              { type: "SimpleProjects" },
            ])
          );
        } catch (error) {
          console.error("Failed to create project:", error);
        }
      },
    }),
  }),
});

export const {
  useGetUserProjectsQuery,
  useGetSimpleUserProjectsQuery,
  useGetProjectQuery,
  useGetDefaultProjectIdQuery,
  useCreateProjectMutation,
} = projectsApi;
export default projectsApi;
