import { TaskAttachmentsResponseDTO } from "../types/AttachmentTypes";
import baseApi from "./baseApi";

export const taskAttachmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaskAttachments: builder.query<TaskAttachmentsResponseDTO, { projectId: string; taskId: string }>({
      query: ({ projectId, taskId }) => `/api/v1/projects/${projectId}/tasks/${taskId}/storage/urls`,
      providesTags: (result, error, { taskId }) => [
        { type: "TaskAttachments", id: taskId },
      ],
    }),
    uploadTaskAttachment: builder.mutation<string, { 
      file: File; 
      projectId: string; 
      taskId: string; 
    }>({
      query: ({ file, projectId, taskId }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/api/v1/projects/${projectId}/tasks/${taskId}/storage/upload`,
          method: "POST",
          body: formData,
        };
      },
      async onQueryStarted(
        { projectId, taskId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          // Invalidate the attachments list to refetch after upload
          dispatch(
            baseApi.util.invalidateTags([
              { type: "TaskAttachments", id: taskId }
            ])
          );
        } catch (error) {
          console.error("Failed to upload attachment:", error);
        }
      },
    }),
    deleteTaskAttachment: builder.mutation<void, { 
      projectId: string; 
      taskId: string; 
      attachmentId: string; 
    }>({
      query: ({ projectId, taskId, attachmentId }) => ({
        url: `/api/v1/projects/${projectId}/tasks/${taskId}/storage/${attachmentId}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { taskId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          // Invalidate the attachments list to refetch after delete
          dispatch(
            baseApi.util.invalidateTags([
              { type: "TaskAttachments", id: taskId }
            ])
          );
        } catch (error) {
          console.error("Failed to delete attachment:", error);
        }
      },
    }),
  }),
});

export const {
  useGetTaskAttachmentsQuery,
  useUploadTaskAttachmentMutation,
  useDeleteTaskAttachmentMutation,
} = taskAttachmentApi;

export default taskAttachmentApi;