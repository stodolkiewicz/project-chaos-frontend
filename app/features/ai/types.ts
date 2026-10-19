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
  proposals: TaskProposal[];
  dismissProposal: (id: string) => void;
}

export interface TokenEvent {
  text: string;
}

export interface RequestCreateTaskEvent {
  title: string;
  description: string;
}

export interface RequestDeleteTaskEvent {
  taskId: string;
  title: string;
}

// Task change proposed by the AI. The user confirms or cancels it.
export type TaskProposal =
  | { id: string; type: 'RequestCreateTask'; data: RequestCreateTaskEvent }
  | { id: string; type: 'RequestDeleteTask'; data: RequestDeleteTaskEvent };
