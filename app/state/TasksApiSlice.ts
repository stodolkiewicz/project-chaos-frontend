import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { BoardTaskDTO } from "../types/BoardTasksDTO";

export const tasksApi = createApi({
  reducerPath: "TasksApi",
  tagTypes: ["Tasks"],
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
    getBoardTasks: builder.query<BoardTaskDTO[], string>({
      query: (projectId) => `/${projectId}/tasks`,
      providesTags: [{ type: "Tasks" }],
    }),
  }),
});

export const { useGetBoardTasksQuery } = tasksApi;
export default tasksApi;
