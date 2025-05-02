import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { BoardTaskDTO } from "../types/BoardTasksDTO";

export const tasksApi = createApi({
  reducerPath: "TasksApi",
  tagTypes: ["Tasks"],
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
    getBoardTasks: builder.query<BoardTaskDTO[], string>({
      query: (projectId) => `/${projectId}/tasks`,
      providesTags: (result, error, projectId) => [
        { type: "Tasks", id: projectId },
      ],
    }),
    deleteTask: builder.mutation<void, { projectId: string; taskId: string }>({
      query: ({ projectId, taskId }) => ({
        url: `/${projectId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      // pessimistic Query RTK cache update.
      // Wait for queryFulfilled, no error? -> delete boardTask from cache of getBoardTasks endpoint
      async onQueryStarted(
        { projectId, taskId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData(
              "getBoardTasks",
              projectId,
              (draft) => {
                return draft.filter((boardTask) => boardTask.taskId !== taskId);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete task:", error);
        }
      },
    }),
  }),
});

export const { useGetBoardTasksQuery, useDeleteTaskMutation } = tasksApi;
export default tasksApi;
