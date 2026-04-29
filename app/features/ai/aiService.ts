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

      // Standard SSE (RFC EventSource) parser:
      // - one event = group of lines terminated by an empty line
      // - inside an event, multiple `data:` lines are joined with `\n`
      // - an empty `data:` line contributes "" (preserves token-level newlines)
      let buffer = '';
      let dataLines: string[] = [];

      const flushEvent = () => {
        if (dataLines.length === 0) return;
        const content = dataLines.join('\n');
        dataLines = [];
        if (content.trim() === '[DONE]') return;
        // empty event = upstream newline token; emit "\n" so markdown structure survives
        onChunk(content === '' ? '\n' : content);
      };

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          flushEvent();
          onComplete();
          break;
        }

        buffer += value;

        let lineEnd;
        while ((lineEnd = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, lineEnd).replace(/\r$/, '');
          buffer = buffer.slice(lineEnd + 1);

          if (line === '') {
            flushEvent();
          } else if (line.startsWith('data:')) {
            // Spring's Flux<String> SSE writer emits "data:<content>\n\n" with no
            // space separator, so the content starts right after the colon.
            // Stripping a leading space here would eat real spaces from LLM tokens
            // like " H1" and produce "#H1" instead of "# H1".
            dataLines.push(line.slice(5));
          }
          // ignore comment lines (":") and other SSE fields (event:, id:, retry:)
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}

export const aiService = new AIService();