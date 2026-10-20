import { TaskPriorityDTO } from "../types/TaskPriorityDTO";
import { UpdateTaskPrioritiesRequestDTO } from "../types/UpdateTaskPrioritiesRequestDTO";
import baseApi from "./baseApi";

export const taskPrioritiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaskPriorities: builder.query<TaskPriorityDTO[], string>({
      query: (projectId) => `/api/v1/projects/${projectId}/task-priorities`,
      providesTags: (result, error, projectId) => [
        { type: "TaskPriorities", id: projectId },
      ],
    }),

    updateTaskPriorities: builder.mutation<
      void,
      { projectId: string; body: UpdateTaskPrioritiesRequestDTO }
    >({
      query: ({ projectId, body }) => ({
        url: `/api/v1/projects/${projectId}/task-priorities`,
        method: "PUT",
        body,
      }),
      // Tasks show the name and color of their priority, and lose it when it is deleted
      invalidatesTags: (result, error, { projectId }) =>
        error
          ? []
          : [
              { type: "TaskPriorities", id: projectId },
              { type: "BoardTasks", id: projectId },
              { type: "BacklogTasks", id: projectId },
              { type: "ArchivedTasks", id: projectId },
            ],
    }),
  }),
});

export const { useGetTaskPrioritiesQuery, useUpdateTaskPrioritiesMutation } = taskPrioritiesApi;
export default taskPrioritiesApi;
