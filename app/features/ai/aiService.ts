import { fetchEventSource } from '@microsoft/fetch-event-source';
import {
  ChatRequestDTO,
  RequestCreateTaskEvent,
  RequestDeleteTaskEvent,
  TokenEvent,
} from './types';

class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  }

  async streamChat(
    projectId: string,
    userId: string,
    message: string,
    conversationId: string = 'default',
    accessToken: string,
    onChunk: (chunk: string) => void,
    onRequestCreateTask: (event: RequestCreateTaskEvent) => void,
    onRequestDeleteTask: (event: RequestDeleteTaskEvent) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<void> {
    try {
      await fetchEventSource(
        `${this.baseUrl}/api/v1/projects/${projectId}/users/${userId}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X_AI_CONVERSATION_ID': conversationId,
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ content: message } as ChatRequestDTO),
          // Reopening the stream after the tab is hidden would send the message again
          openWhenHidden: true,
          async onopen(response) {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          },
          onmessage(event) {
            switch (event.event) {
              case 'token':
                onChunk((JSON.parse(event.data) as TokenEvent).text);
                break;
              case 'RequestCreateTask':
                onRequestCreateTask(JSON.parse(event.data) as RequestCreateTaskEvent);
                break;
              case 'RequestDeleteTask':
                onRequestDeleteTask(JSON.parse(event.data) as RequestDeleteTaskEvent);
                break;
            }
          },
          // Rethrowing stops fetchEventSource from retrying the request
          onerror(error) {
            throw error;
          },
        }
      );
      onComplete();
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}

export const aiService = new AIService();
