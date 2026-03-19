"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Send, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { useGetChatHistoryQuery, useGetConversationsQuery, conversationsApi } from "@/app/state/ConversationsApiSlice";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { useAIChat } from "./useAIChat";
import ConversationHistory from "./ConversationHistory";

interface AIChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AIChatSheet({ open, onOpenChange }: AIChatSheetProps) {
  const [message, setMessage] = useState("");
  
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const userId = useAppSelector((state) => state.user.userId);
  const dispatch = useAppDispatch();

  const { data } = useGetDefaultProjectIdQuery(undefined, {
    skip: !accessToken || !userId
  });
  const defaultProjectId = data?.projectId;

  const {
    data: conversations,
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useGetConversationsQuery({projectId: defaultProjectId, userId: userId}, {
    skip: !defaultProjectId || !userId
  });

  const { isLoading, error, sendMessage, clearError } = useAIChat();

  const [currentConversationId, setCurrentConversationId] = useState<string>(crypto.randomUUID());


  const {
    data: chatHistory,
    isSuccess: isChatHistorySuccess,
    isLoading: chatHistoryLoading,
    error: chatHistoryError,
  } = useGetChatHistoryQuery({projectId: defaultProjectId, userId: userId, conversationId: currentConversationId},
      { skip: !defaultProjectId || !userId || !currentConversationId }
   );

 

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !defaultProjectId || !userId) return;
    
    const messageText = message;
    setMessage("");
    
    await sendMessage(messageText, defaultProjectId, userId, currentConversationId);
  };

  const handleNewChat = () => {
    // Create new conversation ID
    setCurrentConversationId(crypto.randomUUID());
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent 
        side="right" 
        showOverlay={false} 
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="flex flex-col h-full !w-[480px] !max-w-[480px] bg-color-page border-l border-color-border"
        style={{ 
          background: 'var(--color-page)',
        }}
      >
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-left text-base">AI Assistant</SheetTitle>
            <div className="flex items-center gap-2 mr-5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="h-8 w-8 p-0 hover:bg-hover"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <ConversationHistory 
                conversations={conversations}
                conversationsLoading={conversationsLoading}
                conversationsError={conversationsError}
                currentConversationId={currentConversationId}
                setCurrentConversationId={setCurrentConversationId}
              />
            </div>
          </div>
        </SheetHeader>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mb-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError} className="ml-auto h-6 w-6 p-0">
              ×
            </Button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4">
          {!chatHistory || chatHistory.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Start a conversation with AI Assistant
            </div>
          ) : (
            <div className="space-y-2.5 pr-3">
              {chatHistory.map((chat, index) => (
                <div
                  key={chat.id || index}
                  className={`flex ${chat.type === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[89%] rounded-lg px-3 py-1 wrap-break-word overflow-hidden ${
                      chat.type === 'USER'
                        ? 'bg-chat-user text-white'
                        : 'bg-chat-assistant text-foreground'
                    }`}
                  >
                    {chat.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t pt-4 px-4 pb-4">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="flex-1 min-h-[72px] resize-none pr-12"
              rows={3}
            />
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              className="absolute bottom-2 right-2 h-8 w-8 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}