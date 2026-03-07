'use client'

import { useMemo } from 'react'
import { Content } from '@tiptap/react'
import { useGetTaskCommentsQuery, useCreateTaskCommentMutation, TaskCommentResponseDTO } from '@/app/state/TaskCommentsApiSlice'
import { Comment } from '@/app/types/Comment'
import CommentSystem from './CommentSystem'
import { toast } from 'sonner'

interface TaskCommentsContainerProps {
  taskId: string
  projectId: string
}

const TaskCommentsContainer = ({ taskId, projectId }: TaskCommentsContainerProps) => {
  const { data: apiComments, isLoading, error } = useGetTaskCommentsQuery({ projectId, taskId })
  const [createComment] = useCreateTaskCommentMutation()

  // Map API DTOs to UI Comment types
  const comments = useMemo(() => {
    if (!apiComments) return []
    
    return apiComments.map((apiComment: TaskCommentResponseDTO): Comment => ({
      id: apiComment.id,
      content: parseContentFromString(apiComment.content),
      author: {
        id: apiComment.authorId,
        name: apiComment.lastModifiedBy, // Using lastModifiedBy as author name for now
      },
      timestamp: new Date(apiComment.lastModifiedDate),
      replyTo: apiComment.replyToId || undefined
    }))
  }, [apiComments])

  const handleAddComment = async (content: Content, replyTo?: string) => {
    try {
      const contentString = JSON.stringify(content)
      
      await createComment({
        projectId,
        taskId,
        comment: {
          taskId,
          content: contentString,
          replyToId: replyTo
        }
      }).unwrap()

      toast.success('Comment added successfully')
    } catch (error) {
      console.error('Failed to create comment:', error)
      toast.error('Failed to add comment')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading comments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">Error loading comments</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <CommentSystem 
        comments={comments}
        onAddComment={handleAddComment}
      />
    </div>
  )
}

// Helper function to parse content from string back to TipTap format
function parseContentFromString(contentString: string): Content {
  try {
    return JSON.parse(contentString)
  } catch {
    // Fallback for plain text
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: contentString }]
        }
      ]
    }
  }
}

export default TaskCommentsContainer