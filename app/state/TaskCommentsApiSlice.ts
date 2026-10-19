import baseApi from "./baseApi";

export interface TaskCommentWithRepliesResponseDTO {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  replyToId?: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  replies: TaskCommentWithRepliesResponseDTO[];
}

export interface PageResponseDTO<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface CreateTaskCommentRequestDTO {
  taskId: string;
  content: string;
  replyToId?: string;
}

export const taskCommentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaskComments: builder.query<PageResponseDTO<TaskCommentWithRepliesResponseDTO>, { projectId: string; taskId: string; page?: number; size?: number }>({
      query: ({ projectId, taskId, page = 0, size = 10 }) => ({
        url: `/api/v1/projects/${projectId}/tasks/${taskId}/comments`,
        params: { page, size }
      }),
      providesTags: (result, error, { taskId }) => [
        { type: "TaskComments", id: taskId },
      ],
    }),
    createTaskComment: builder.mutation<
      TaskCommentWithRepliesResponseDTO,
      { projectId: string; taskId: string; comment: CreateTaskCommentRequestDTO }
    >({
      query: ({ projectId, taskId, comment }) => ({
        url: `/api/v1/projects/${projectId}/tasks/${taskId}/comments`,
        method: "POST",
        body: comment,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "TaskComments", id: taskId }
      ],
    }),
    markTaskCommentsAsRead: builder.mutation<void, { projectId: string; taskId: string }>({
      query: ({ projectId, taskId }) => ({
        url: `/api/v1/projects/${projectId}/tasks/${taskId}/comments/read`,
        method: "PUT",
      }),
      // Task lists carry unreadCommentsCount, so they must be refetched
      invalidatesTags: (result, error, { projectId }) => [
        { type: "BoardTasks", id: projectId },
        { type: "BacklogTasks", id: projectId },
        { type: "ArchivedTasks", id: projectId },
      ],
    }),
  }),
});

export const {
  useGetTaskCommentsQuery,
  useCreateTaskCommentMutation,
  useMarkTaskCommentsAsReadMutation,
} = taskCommentsApi;

export default taskCommentsApi;