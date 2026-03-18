import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { aiService } from './aiService';

import { ChatMessage, UseAIChatReturn } from './types';
import { conversationsApi } from '@/app/state/ConversationsApiSlice';

export const useAIChat = (): UseAIChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const dispatch = useAppDispatch();
  
  const sendMessage = useCallback(async (
    message: string,
    projectId: string,
    userId: string,
    conversationId: string = 'default'
  ) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: ChatMessage = { role: 'USER', content: message };
    setMessages(prev => [...prev, userMessage]);

    // Prepare assistant message placeholder
    const assistantMessage: ChatMessage = { role: 'ASSISTANT', content: '' };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      await aiService.streamChat(
        projectId,
        userId,
        message,
        conversationId,
        accessToken || '',
        // onChunk - update the last message (assistant)
        (chunk: string) => {
          setMessages(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            const lastMessage = updated[lastIndex];

            // updating assistant message
            // new object (address) so that react can spot the change
            updated[lastIndex] = {
              ...lastMessage,
              content: lastMessage.content + chunk 
            };   
                      
            return updated;
          });
        },
        // onError
        (error: Error) => {
          setError(error.message);
          // Remove the empty assistant message on error
          setMessages(prev => prev.slice(0, -1));
        },
        // onComplete
        () => {
            if (messages.length === 2) {
              dispatch(conversationsApi.util.invalidateTags([{ type: "Conversations", id: "LIST" }]));
            }
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      // Remove the empty assistant message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, accessToken]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    setMessages,
    sendMessage,
    clearMessages,
    clearError,
  };
};