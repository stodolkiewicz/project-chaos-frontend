"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AIChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AIChatSheet({ open, onOpenChange }: AIChatSheetProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessage("");
    
    // TODO: Call AI API here
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        showOverlay={false} 
        className="flex flex-col h-full !w-[450px] !max-w-[450px]"
        style={{ width: '450px', maxWidth: '450px' }}
      >
        <SheetHeader>
          <SheetTitle className="text-left text-base">AI Assistant</SheetTitle>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Start a conversation with AI Assistant
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 break-words overflow-hidden ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-900'
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