import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { ProjectUsersDTO } from "../types/ProjectUsersDTO";

export const usersApi = createApi({
  reducerPath: "UsersApi",
  tagTypes: ["Users"],
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
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getProjectUsers: builder.query<ProjectUsersDTO, string>({
      query: (projectId) => `/${projectId}/users`,
      providesTags: (result, error, projectId) => [
        { type: "Users", id: projectId },
      ],
    }),
  }),
});

export const { useGetProjectUsersQuery } = usersApi;
export default usersApi;
