'use client'

import { Comment } from '@/app/types/Comment'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import { JSONContent } from '@tiptap/react'

interface CommentDisplayProps {
  comment: Comment
  replies: Comment[]
  onReply: () => void
}

const CommentDisplay = ({ comment, replies, onReply }: CommentDisplayProps) => {
  // Convert TipTap JSON to HTML for display
  const getHtmlContent = (content: any): string => {
    if (typeof content === 'string') {
      return content
    }
    return generateHTML(content as JSONContent, [StarterKit])
  }
  
  const htmlContent = getHtmlContent(comment.content)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      {/* Comment header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {comment.author.avatar && (
            <img 
              src={comment.author.avatar} 
              alt={comment.author.name}
              className="w-6 h-6 rounded-full"
            />
          )}
          <div>
            <span className="font-medium text-gray-900 text-sm">
              {comment.author.name}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {comment.timestamp.toLocaleString()}
            </span>
          </div>
        </div>
        
        <button
          onClick={onReply}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Reply
        </button>
      </div>

      {/* Comment content */}
      <div 
        className="prose prose-sm max-w-none bg-gray-50 border-darker-1 border-1 p-2 rounded"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Replies with vertical line */}
      {replies.length > 0 && (
        <div className="mt-2 ml-3 border-l-2 border-gray-200 pl-3 space-y-2">
          {replies.map((reply) => {
            const replyHtml = getHtmlContent(reply.content)
            return (
              <div key={reply.id} className="bg-gray-50 border border-gray-100 rounded-lg p-2">
                {/* Reply header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    {reply.author.avatar && (
                      <img 
                        src={reply.author.avatar} 
                        alt={reply.author.name}
                        className="w-5 h-5 rounded-full"
                      />
                    )}
                    <div>
                      <span className="font-medium text-gray-900 text-xs">
                        {reply.author.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        {reply.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Reply content */}
                <div 
                  className="prose prose-sm max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: replyHtml }}
                />
              </div>
            )
          })}
        </div>
      )}
      
    </div>
  )
}

export default CommentDisplay