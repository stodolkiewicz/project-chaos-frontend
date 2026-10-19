import { useState, useEffect, useRef } from "react";
import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationResponseDTO, useGetChatHistoryQuery } from "@/app/state/ConversationsApiSlice";
import DeleteConversationAlertDialog from "./DeleteConversationAlertDialog";
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
  onDeleteConversation: (conversationId: string) => Promise<void>;
}

export default function ConversationHistory({ 
  conversations,
  conversationsLoading,
  conversationsError,
  currentConversationId,
  setCurrentConversationId,
  onDeleteConversation
}: ConversationHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<ConversationResponseDTO | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // The delete dialog renders outside the overlay, so its clicks must not close the overlay
      if (conversationToDelete) return;

      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, conversationToDelete]);

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
                      className={`group flex items-start justify-between gap-2 p-2 hover:bg-hover rounded-md cursor-pointer 
                        ${conversation.id === currentConversationId ? 'bg-slate-50 border-l-4 border-emerald-300' : ''}
                      `}
                      onClick={() => handleSetCurrentConversation(conversation.id)}
                      >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">
                        {conversation.title || 'Untitled Conversation'}
                      </div>
                      <div className="text-xs text-text-subtle mt-1">{timeAgo}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(event) => {
                        // Prevent the click from also selecting the conversation
                        event.stopPropagation();
                        setConversationToDelete(conversation);
                      }}
                      className="h-6 w-6 p-0 shrink-0 opacity-0 group-hover:opacity-100 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

      {conversationToDelete && (
        <DeleteConversationAlertDialog
          conversation={conversationToDelete}
          onConfirm={() => onDeleteConversation(conversationToDelete.id)}
          onClose={() => setConversationToDelete(null)}
        />
      )}
    </div>
  );
}