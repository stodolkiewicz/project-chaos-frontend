'use client'

import { useState } from 'react'
import { Content } from '@tiptap/react'
import { useGetTaskCommentsQuery, useCreateTaskCommentMutation, TaskCommentWithRepliesResponseDTO } from '@/app/state/TaskCommentsApiSlice'
import CommentSystem from './CommentSystem'
import { toast } from 'sonner'

interface TaskCommentsContainerProps {
  taskId: string
  projectId: string
}

const TaskCommentsContainer = ({ taskId, projectId }: TaskCommentsContainerProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const defaultPageSize = 10
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const { data: apiComments, isLoading, error } = useGetTaskCommentsQuery({ 
    projectId, 
    taskId, 
    page: currentPage, 
    size: pageSize 
  })
  const [createComment] = useCreateTaskCommentMutation()

  const comments = apiComments?.content || []
  const totalPages = apiComments?.totalPages || 0
  const totalElements = apiComments?.totalElements || 0

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
      
      // Go to last page to see the new comment
      if (totalPages > 0) {
        setCurrentPage(totalPages - 1)
      }
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(0) // Reset to first page when changing page size
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
        pagination={{
          currentPage,
          totalPages,
          pageSize,
          onPageSizeChange: handlePageSizeChange,
          totalElements,
          onPageChange: handlePageChange,
          isLoading
        }}
      />
    </div>
  )
}


export default TaskCommentsContainer