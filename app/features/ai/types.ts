export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestDTO {
  content: string;
}

export interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, projectId: string, userId: string, conversationId?: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}