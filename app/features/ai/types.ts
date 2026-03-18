export interface ChatMessage {
  role: 'USER' | 'ASSISTANT';
  content: string;
}

export interface ChatRequestDTO {
  content: string;
}

export interface UseAIChatReturn {
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, projectId: string, userId: string, conversationId: string) => Promise<void>;
  clearError: () => void;
}