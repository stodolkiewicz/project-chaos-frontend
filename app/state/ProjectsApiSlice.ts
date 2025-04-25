import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { UserProjectsResponseDTO } from "../types/UserProjectsResponseDTO";

export const projectsApi = createApi({
  reducerPath: "ProjectsApi",
  tagTypes: ["Projects"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/projects",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserProjects: builder.query<UserProjectsResponseDTO, void>({
      query: () => ``,
      providesTags: [{ type: "Projects" }],
    }),
  }),
});

export const { useGetUserProjectsQuery } = projectsApi;
export default projectsApi;
