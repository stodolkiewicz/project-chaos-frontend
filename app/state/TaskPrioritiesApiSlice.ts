import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { TaskPriorityDTO } from "../types/TaskPriorityDTO";

export const taskPrioritiesApi = createApi({
  reducerPath: "TaskPrioritiesApi",
  tagTypes: ["TaskPriorities"],
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
    getTaskPriorities: builder.query<TaskPriorityDTO[], string>({
      query: (projectId) => `/${projectId}/task-priorities`,
      providesTags: (result, error, projectId) => [
        { type: "TaskPriorities", id: projectId },
      ],
    }),
  }),
});

export const { useGetTaskPrioritiesQuery } = taskPrioritiesApi;
export default taskPrioritiesApi;
