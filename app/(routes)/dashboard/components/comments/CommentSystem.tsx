'use client'

import { useState } from 'react'
import { Content } from '@tiptap/react'
import { TaskCommentWithRepliesResponseDTO } from '@/app/state/TaskCommentsApiSlice'
import TipTap from '../TipTap'
import CommentDisplay from './CommentDisplay'
import { convertTipTapContentToHtml, extractTextFromTipTapContent } from '@/lib/tiptapUtils'

interface CommentSystemProps {
  comments: TaskCommentWithRepliesResponseDTO[]
  onAddComment: (content: Content, replyTo?: string) => void
}

const CommentSystem = ({ comments, onAddComment }: CommentSystemProps) => {
  const [newComment, setNewComment] = useState<Content>({ type: 'doc', content: [] })
  const [replyingTo, setReplyingTo] = useState<TaskCommentWithRepliesResponseDTO | null>(null)

  const [resetKey, setResetKey] = useState(0)
  const emptyContent: Content = { type: 'doc', content: [] };

  const handleSubmit = () => {
    if (newComment) {
      onAddComment(newComment, replyingTo?.id || undefined)
      setReplyingTo(null)
      
      // force reset TipTap editor by changing its key as seNewComment does not work
      setNewComment(emptyContent)
      setResetKey(prev => prev + 1)
    }
  }

  const handleReply = (comment: TaskCommentWithRepliesResponseDTO) => {
    setReplyingTo(comment)
  }

  return (
    <div className="space-y-4">
      {/* Comments list */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No comments yet. Be the first to add a comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentDisplay 
              key={comment.id} 
              comment={comment} 
              onReply={() => handleReply(comment)}
            />
          ))
        )}
      </div>

      {/* New comment */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Add Comment</h3>
        
        {/* Show comment being replied to */}
        {replyingTo && (
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-blue-600 mb-1">
                  Replying to {replyingTo.lastModifiedBy}:
                </div>
                <div className="text-sm italic text-gray-700">
                  "{extractTextFromTipTapContent(replyingTo.content).slice(0, 150)}..."
                </div>
              </div>
              <button 
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Editor */}
        <TipTap 
          key={resetKey}
          value={newComment}
          onChange={setNewComment}
        />
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-darker-1"
            disabled={!newComment}
          >
            {replyingTo ? 'Post Reply' : 'Post Comment'}
          </button>
        </div>
      </div>
    </div>
  )
}


export default CommentSystem