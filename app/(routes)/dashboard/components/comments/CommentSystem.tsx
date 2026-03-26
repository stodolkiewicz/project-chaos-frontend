'use client'

import { useState } from 'react'
import { Content } from '@tiptap/react'
import { TaskCommentWithRepliesResponseDTO } from '@/app/state/TaskCommentsApiSlice'
import TipTap from '../TipTap'
import CommentDisplay from './CommentDisplay'
import { extractTextFromTipTapContent } from '@/lib/tiptapUtils'
import { PaginationControls } from '@/app/components/pagination/PaginationControls'
import PaginationProps from '@/app/components/pagination/PaginationProps'

interface CommentSystemProps {
  comments: TaskCommentWithRepliesResponseDTO[]
  onAddComment: (content: Content, replyTo?: string) => void
  pagination?: PaginationProps
}

const CommentSystem = ({ comments, onAddComment, pagination }: CommentSystemProps) => {
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

        {/* Pagination */}
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          currentPageSize={pagination.pageSize}
          onPageSizeChange={pagination.onPageSizeChange}
          totalElements={pagination.totalElements}
          className="mb-4 mt-4"
        />

      {/* New comment */}
      <div className="border-t pt-8 bg-slate-50 p-4 rounded-md">
        <h3 className="text-base font-semibold mb-4">Add Comment</h3>
        
        {/* Show comment being replied to */}
        {replyingTo && (
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md">
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
          toolbarSections={['headings', 'formatting']}
        />
        
        <div className="flex mt-4">
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-3 py-1 text-base rounded-md hover:bg-primary-darker-1 ml-auto"
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