import baseApi from "./baseApi";

export interface ConversationResponseDTO {
  id: string;
  projectId: string;
  title?: string;
  createdAt: string;
}

export interface ChatMemoryResponseDTO {
  id: string;
  conversationId: string | null;
  content: string;
  type: 'USER' | 'ASSISTANT';
  timestamp: string;
}

export const conversationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<ConversationResponseDTO[], { projectId: string; userId: string }>({
      query: ({ projectId, userId }) => 
        `/api/v1/projects/${projectId}/users/${userId}/conversations`,
      providesTags: (result, error, { projectId, userId }) => [
        { type: "Conversations", id: "LIST" },
      ],
    }),
    getChatHistory: builder.query<ChatMemoryResponseDTO[], { projectId: string; userId: string; conversationId: string }>({
      query: ({ projectId, userId, conversationId }) => 
        `/api/v1/projects/${projectId}/users/${userId}/conversation/${conversationId}`,
      providesTags: (result, error, { conversationId }) => [
        { type: "ChatHistory", id: conversationId },
      ],
    }),
    deleteChatHistory: builder.mutation<void, { projectId: string; userId: string; conversationId: string }>({
      query: ({ projectId, userId, conversationId }) => ({
        url: `/api/v1/projects/${projectId}/users/${userId}/conversation/${conversationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "ChatHistory", id: conversationId },
        { type: "Conversations", id: "LIST" },
      ],
    }),
  }),
});

export const { 
  useGetConversationsQuery,
  useGetChatHistoryQuery,
  useDeleteChatHistoryMutation
} = conversationsApi;