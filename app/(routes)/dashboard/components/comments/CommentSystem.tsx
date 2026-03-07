'use client'

import { useState } from 'react'
import { Content } from '@tiptap/react'
import { Comment } from '@/app/types/Comment'
import TipTap from '../TipTap'
import CommentDisplay from './CommentDisplay'

interface CommentSystemProps {
  comments: Comment[]
  onAddComment: (content: Content, replyTo?: string) => void
}

const CommentSystem = ({ comments, onAddComment }: CommentSystemProps) => {
  const [newComment, setNewComment] = useState<Content>("")
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)

  const handleSubmit = () => {
    if (newComment) {
      onAddComment(newComment, replyingTo?.id || undefined)
      setNewComment("")
      setReplyingTo(null)
    }
  }

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment)
  }

  return (
    <div className="space-y-4">
      {/* Comments list */}
      <div className="space-y-3">
        {comments.filter(comment => !comment.replyTo).length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No comments yet. Be the first to add a comment!</p>
          </div>
        ) : (
          comments.filter(comment => !comment.replyTo).map((comment) => {
            const replies = comments.filter(reply => reply.replyTo === comment.id)
            return (
              <CommentDisplay 
                key={comment.id} 
                comment={comment} 
                replies={replies}
                onReply={() => handleReply(comment)}
              />
            )
          })
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
                  Replying to {replyingTo.author.name}:
                </div>
                <div className="text-sm italic text-gray-700">
                  "{extractTextFromContent(replyingTo.content).slice(0, 150)}..."
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

// Helper function to extract text from TipTap content
function extractTextFromContent(content: Content): string {
  if (typeof content === 'string') return content
  
  if (content && typeof content === 'object' && 'content' in content) {
    const nodes = content.content || []
    return nodes.map((node: any) => {
      if (node.type === 'text') return node.text || ''
      if (node.content) return extractTextFromContent({ content: node.content })
      return ''
    }).join(' ')
  }
  
  return ''
}

export default CommentSystem