import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { UserProjectsResponseDTO } from "../types/UserProjectsResponseDTO";
import { ProjectDTO } from "../types/ProjectDTO";

export const projectsApi = createApi({
  reducerPath: "ProjectsApi",
  tagTypes: ["Projects", "Project"],
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
  // todo TAGS!
  endpoints: (builder) => ({
    getUserProjects: builder.query<UserProjectsResponseDTO, void>({
      query: () => ``,
      providesTags: [{ type: "Projects" }],
    }),
    getProject: builder.query<ProjectDTO, string>({
      query: (projectId) => `${projectId}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
  }),
});

export const { useGetUserProjectsQuery, useGetProjectQuery } = projectsApi;
export default projectsApi;
