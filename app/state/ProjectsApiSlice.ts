import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { UserProjectsResponseDTO } from "../types/UserProjectsResponseDTO";
import { ProjectDTO } from "../types/ProjectDTO";

export const projectsApi = createApi({
  reducerPath: "ProjectsApi",
  tagTypes: ["Projects"],
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
      providesTags: (result, error, email) => [{ type: "Projects", id: email }],
    }),
    getProject: builder.query<ProjectDTO, string>({
      query: (projectId) => `${projectId}`,
      providesTags: (result, error, id) => [{ type: "Projects", id }],
    }),
  }),
});

export const { useGetUserProjectsQuery, useGetProjectQuery } = projectsApi;
export default projectsApi;
