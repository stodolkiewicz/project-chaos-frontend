import baseApi from "./baseApi";

export interface TaskCommentResponseDTO {
  id: string;
  content: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  authorId: string;
  replyToId?: string;
}

export interface CreateTaskCommentRequestDTO {
  taskId: string;
  content: string;
  replyToId?: string;
}

export const taskCommentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaskComments: builder.query<TaskCommentResponseDTO[], { projectId: string; taskId: string }>({
      query: ({ projectId, taskId }) => `/api/v1/projects/${projectId}/tasks/${taskId}/comments`,
      providesTags: (result, error, { taskId }) => [
        { type: "TaskComments", id: taskId },
      ],
    }),
    createTaskComment: builder.mutation<
      TaskCommentResponseDTO,
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
  }),
});

export const {
  useGetTaskCommentsQuery,
  useCreateTaskCommentMutation,
} = taskCommentsApi;

export default taskCommentsApi;