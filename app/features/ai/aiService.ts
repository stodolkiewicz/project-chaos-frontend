import { ChatRequestDTO } from './types';

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
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ content: message } as ChatRequestDTO),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      // TextDecoderStream - decodes bytes to text
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete();
          break;
        }

        buffer += value;
        
        // backend sends a few chunks at once:
        // data: Ala\ndata: ma\ndata: kota\n
        // data: Ala\n
        // data: ma\n
        // data: kota\n
        
        let chunkEndIndex;
        while ((chunkEndIndex = buffer.indexOf('\n')) !== -1) {
          const chunk = buffer.slice(0, chunkEndIndex);
          buffer = buffer.slice(chunkEndIndex + 1);
          
          this.processChunk(chunk, onChunk);
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  private processChunk(line: string, onChunk: (chunk: string) => void) {
    if (line.startsWith('data:')) {
      const content = line.slice(5);
      
      if (content.trim() === '[DONE]') return;

      // return content to onChunk method
      onChunk(content);
    }
  }
}

export const aiService = new AIService();