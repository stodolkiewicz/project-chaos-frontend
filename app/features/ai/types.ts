export interface ChatMessage {
  role: 'USER' | 'ASSISTANT';
  content: string;
}

export interface ChatRequestDTO {
  content: string;
}

export interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  setMessages: (messages: ChatMessage[]) => void;
  sendMessage: (message: string, projectId: string, userId: string, conversationId: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}