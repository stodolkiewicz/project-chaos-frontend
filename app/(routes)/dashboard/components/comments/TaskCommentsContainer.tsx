'use client'

import { Content } from '@tiptap/react'
import { useGetTaskCommentsQuery, useCreateTaskCommentMutation, TaskCommentWithRepliesResponseDTO } from '@/app/state/TaskCommentsApiSlice'
import CommentSystem from './CommentSystem'
import { toast } from 'sonner'

interface TaskCommentsContainerProps {
  taskId: string
  projectId: string
}

const TaskCommentsContainer = ({ taskId, projectId }: TaskCommentsContainerProps) => {
  const { data: apiComments, isLoading, error } = useGetTaskCommentsQuery({ projectId, taskId })
  const [createComment] = useCreateTaskCommentMutation()

  const comments = apiComments?.content || []

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
      toast.error('Failed to add comment')
    }
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


export default TaskCommentsContainer