import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Project from "@/app/types/Project";
import { RootState } from "@/app/store";

export const projectApi = createApi({
  reducerPath: "ProjectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/user/projects",
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
    }),
  }),
});

export const { useGetUserProjectsQuery } = projectApi;
export default projectApi;
