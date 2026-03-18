import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { aiService } from './aiService';

import { UseAIChatReturn } from './types';
import { conversationsApi, ChatMemoryResponseDTO } from '@/app/state/ConversationsApiSlice';

export const useAIChat = (): UseAIChatReturn => {
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

    // Add user message to cache immediately
    const userMessage: ChatMemoryResponseDTO = { 
      id: crypto.randomUUID(), 
      conversationId: conversationId, 
      content: message, 
      type: 'USER', 
      timestamp: new Date().toISOString() 
    };

    // Add assistant message placeholder to cache
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: ChatMemoryResponseDTO = { 
      id: assistantMessageId, 
      conversationId: conversationId, 
      content: '', 
      type: 'ASSISTANT', 
      timestamp: new Date().toISOString() 
    };

    // Update cache with user message and placeholder assistant
    dispatch(conversationsApi.util.updateQueryData('getChatHistory', 
      { projectId, userId, conversationId }, 
      (draft) => {
        draft.push(userMessage, assistantMessage);
      }
    ));

    try {
      await aiService.streamChat(
        projectId,
        userId,
        message,
        conversationId,
        accessToken || '',
        // onChunk - update the assistant message in cache
        (chunk: string) => {
          dispatch(conversationsApi.util.updateQueryData('getChatHistory', 
            { projectId, userId, conversationId }, 
            (draft) => {
              const lastMessage = draft[draft.length - 1];
              if (lastMessage && lastMessage.id === assistantMessageId) {
                lastMessage.content += chunk;
              }
            }
          ));
        },
        // onError
        (error: Error) => {
          setError(error.message);
          // Remove the empty assistant message on error
          dispatch(conversationsApi.util.updateQueryData('getChatHistory', 
            { projectId, userId, conversationId }, 
            (draft) => {
              const lastIndex = draft.length - 1;
              if (draft[lastIndex] && draft[lastIndex].id === assistantMessageId) {
                draft.splice(lastIndex, 1);
              }
            }
          ));
        },
        // onComplete
        () => {
          // Invalidate conversations list after successful message
          dispatch(conversationsApi.util.invalidateTags([{ type: "Conversations", id: "LIST" }]));
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      // Remove the empty assistant message on error
      dispatch(conversationsApi.util.updateQueryData('getChatHistory', 
        { projectId, userId, conversationId }, 
        (draft) => {
          const lastIndex = draft.length - 1;
          if (draft[lastIndex] && draft[lastIndex].id === assistantMessageId) {
            draft.splice(lastIndex, 1);
          }
        }
      ));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, accessToken]);


  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    sendMessage,
    clearError,
  };
};