import { useState, useEffect, useRef } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationResponseDTO, useGetChatHistoryQuery } from "@/app/state/ConversationsApiSlice";
import { formatDistanceToNow, format, isToday, isYesterday, differenceInHours } from "date-fns";

const formatConversationTime = (createdAt: string): string => {
  const createdDate = new Date(createdAt);
  const hoursDiff = differenceInHours(new Date(), createdDate);
  
  if (hoursDiff < 1) {
    // Last hour: "5 minutes ago", "just now"
    return formatDistanceToNow(createdDate, { addSuffix: true });
  } else if (isToday(createdDate)) {
    // Today: "14:20" or "3 hours ago"
    if (hoursDiff < 6) {
      return formatDistanceToNow(createdDate, { addSuffix: true });
    } else {
      return format(createdDate, 'HH:mm');
    }
  } else if (isYesterday(createdDate)) {
    // Yesterday: "Yesterday, 18:05"
    return `Yesterday, ${format(createdDate, 'HH:mm')}`;
  } else {
    // Older: "12 March"
    return format(createdDate, 'd MMMM');
  }
};

interface ConversationHistoryProps {
  conversations?: ConversationResponseDTO[];
  conversationsLoading: boolean;
  conversationsError?: any;
  currentConversationId: string;
  setCurrentConversationId: (conversationId: string) => void;
}

export default function ConversationHistory({ 
  conversations,
  conversationsLoading,
  conversationsError,
  currentConversationId,
  setCurrentConversationId
}: ConversationHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSetCurrentConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0 hover:bg-hover"
      >
        <History className="h-4 w-4" />
      </Button>
      
      {/* History Overlay */}
      {isOpen && (
        <div 
          ref={overlayRef}
          className="absolute top-full right-0 mt-2 w-80 bg-panel border border-divider rounded-lg shadow-lg z-50 max-h-120 overflow-y-auto"
        >
          <div className="p-3">
            <h3 className="font-medium text-sm mb-3 text-text-muted">Conversation History</h3>
            <div className="space-y-2">
            {conversationsLoading ? (
              <div className="text-sm text-text-muted text-center py-4">
                Loading conversations...
              </div>
            ) : conversationsError ? (
              <div className="text-sm text-red-500 text-center py-4">
                Failed to load conversations
              </div>
            ) : conversations && conversations.length > 0 ? (
              conversations.map((conversation, index) => {
                const timeAgo = formatConversationTime(conversation.createdAt);
                
                return (
                  <div key={conversation.id || `conversation-${index}`} 
                      className={`p-2 hover:bg-hover rounded-md cursor-pointer 
                        ${conversation.id === currentConversationId ? 'bg-slate-50 border-l-4 border-emerald-300' : ''}
                      `}
                      onClick={() => handleSetCurrentConversation(conversation.id)}
                      >
                    <div className="text-sm font-medium">
                      {conversation.title || 'Untitled Conversation'}
                    </div>
                    <div className="text-xs text-text-subtle mt-1">{timeAgo}</div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-text-muted text-center py-4">
                No conversations
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}