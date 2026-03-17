"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { useAppSelector } from "@/app/hooks";
import { useAIChat } from "./useAIChat";

interface AIChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AIChatSheet({ open, onOpenChange }: AIChatSheetProps) {
  const [message, setMessage] = useState("");
  
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const userId = useAppSelector((state) => state.user.userId);
  
  const { data } = useGetDefaultProjectIdQuery(undefined, {
    skip: !accessToken || !userId
  });
  const defaultProjectId = data?.projectId;

  const { messages, isLoading, error, sendMessage, clearError } = useAIChat();

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !defaultProjectId || !userId) return;
    
    const messageText = message;
    setMessage("");
    
    await sendMessage(messageText, defaultProjectId, userId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        showOverlay={false} 
        className="flex flex-col h-full !w-[450px] !max-w-[450px]"
        style={{ 
          width: '450px', 
          maxWidth: '450px',
          background: 'var(--color-page)',
          borderLeft: '1px solid var(--color-border)'
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-left text-base">AI Assistant</SheetTitle>
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
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Start a conversation with AI Assistant
            </div>
          ) : (
            <div className="space-y-2.5 pr-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[65%] rounded-lg px-3 py-1 break-words overflow-hidden ${
                      msg.role === 'user'
                        ? 'bg-chat-user text-white'
                        : 'bg-chat-assistant text-foreground'
                    }`}
                  >
                    {msg.content}
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