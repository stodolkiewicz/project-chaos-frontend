import { TaskPriorityDTO } from "../types/TaskPriorityDTO";
import baseApi from "./baseApi";

export const taskPrioritiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaskPriorities: builder.query<TaskPriorityDTO[], string>({
      query: (projectId) => `/api/v1/projects/${projectId}/task-priorities`,
      providesTags: (result, error, projectId) => [
        { type: "TaskPriorities", id: projectId },
      ],
    }),
  }),
});

export const { useGetTaskPrioritiesQuery } = taskPrioritiesApi;
export default taskPrioritiesApi;
