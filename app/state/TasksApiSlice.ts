import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { BoardTaskDTO } from "../types/BoardTasksDTO";
import { CreateTaskFormData } from "../dashboard/components/CreateTask/CreateTaskForm";
import { UpdateTaskColumnDTO } from "../types/UpdateTaskColumnDTO";

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
    createTask: builder.mutation<
      void, // what backend returns, void = we don't care
      { projectId: string; createTaskFormData: CreateTaskFormData }
    >({
      query: ({ projectId, createTaskFormData }) => ({
        url: `/${projectId}/tasks`,
        method: "POST",
        body: createTaskFormData,
      }),
      // optimistic update
      async onQueryStarted(
        { projectId, createTaskFormData },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          // After successful creation, invalidate the tasks list to refetch
          dispatch(
            tasksApi.util.invalidateTags([{ type: "Tasks", id: projectId }])
          );
        } catch (error) {
          console.error("Failed to create task:", error);
        }
      },
    }),
    moveTask: builder.mutation<
      void,
      {
        projectId: string;
        taskId: string;
        updateTaskColumnDTO: UpdateTaskColumnDTO;
      }
    >({
      query: ({ projectId, taskId, updateTaskColumnDTO }) => ({
        url: `/${projectId}/tasks/${taskId}`,
        method: "PATCH",
        body: updateTaskColumnDTO,
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Po udanym przeniesieniu taska, odśwież listę tasków
          dispatch(
            tasksApi.util.invalidateTags([{ type: "Tasks", id: projectId }])
          );
        } catch (error) {
          console.error("Failed to move task:", error);
        }
      },
    }),
  }),
});

export const {
  useGetBoardTasksQuery,
  useDeleteTaskMutation,
  useCreateTaskMutation,
  useMoveTaskMutation,
} = tasksApi;
export default tasksApi;
