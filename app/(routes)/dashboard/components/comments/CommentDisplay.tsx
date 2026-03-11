'use client'

import { TaskCommentWithRepliesResponseDTO } from '@/app/state/TaskCommentsApiSlice'
import { convertTipTapContentToHtml } from '@/lib/tiptapUtils'

interface CommentDisplayProps {
  comment: TaskCommentWithRepliesResponseDTO
  onReply: () => void
}

const CommentDisplay = ({ comment, onReply }: CommentDisplayProps) => {
  const htmlContent = convertTipTapContentToHtml(comment.content)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      {/* Comment header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div>
            <span className="font-medium text-gray-900 text-sm">
              {comment.lastModifiedBy}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {new Date(comment.lastModifiedDate).toLocaleString()}
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
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 ml-3 border-l-2 border-gray-200 pl-3 space-y-2">
          {comment.replies.map((reply) => {
            const replyHtml = convertTipTapContentToHtml(reply.content)
            return (
              <div key={reply.id} className="bg-gray-50 border border-gray-100 rounded-lg p-2">
                {/* Reply header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    <div>
                      <span className="font-medium text-gray-900 text-xs">
                        {reply.lastModifiedBy}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        {new Date(reply.lastModifiedDate).toLocaleString()}
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