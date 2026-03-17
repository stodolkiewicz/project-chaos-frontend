import { ChatMessage, ChatRequestDTO } from './types';

export class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }

  async streamChat(
    projectId: string,
    userId: string,
    message: string,
    conversationId: string = 'default',
    token: string,
    onChunk: (chunk: string) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<void> {
    try {
      
      const response = await fetch(
        `${this.baseUrl}/api/v1/projects/${projectId}/users/${userId}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'X_AI_CONVERSATION_ID': conversationId,
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ content: message } as ChatRequestDTO),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = ''; // <--- DODAJEMY BUFOR

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete();
          break;
        }

        // 1. Dekodujemy i dodajemy do bufora
        buffer += decoder.decode(value, { stream: true });
        
        // 2. Dzielimy bufor na linie
        const lines = buffer.split('\n');

        // 3. Ostatni element (może być niepełną linią) zostawiamy w buforze
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
              
              // 2. Wycinamy dokładnie "data:" (5 znaków) i NIC WIĘCEJ
              const content = line.slice(5);

              // 3. Sprawdzamy, czy to nie koniec streamu
              if (content.trim() === '[DONE]') continue;

              // 4. Przekazujemy content "tak jak jest" (z zachowaniem spacji na początku)
              onChunk(content);
            }
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

}

export const aiService = new AIService();