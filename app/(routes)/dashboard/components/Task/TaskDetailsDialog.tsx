"use client";

import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TaskCommentsContainer from "../comments/TaskCommentsContainer";
import { TaskAttachments } from "./attachments/TaskAttachments";

export default function TaskCommentsDialog({
  boardTask,
  children,
}: {
  boardTask: BoardTaskDTO;
  children: React.ReactNode;
}) {
  const { data } = useGetDefaultProjectIdQuery();
  const projectId = data?.projectId;

  if (!projectId) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[70vw] w-full max-h-[90vh] overflow-y-auto sm:max-w-[70vw] top-[50vh] bg-gray-50">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="p-3 bg-white rounded-lg">
          <h4 className="font-semibold text-base mb-1">{boardTask.title}</h4>
          {boardTask.priority.name && (
            <div className="text-xs text-gray-500 mb-2">Priority: {boardTask.priority.name}</div>
          )}
          <p className="text-base text-gray-900 mb-2">{boardTask.description}</p>
          {boardTask.assignee.email && (
            <div className="text-sm text-gray-900">
              <span>Assigned to: {boardTask.assignee.email}</span>
            </div>
          )}
        </div>
        
        <TaskAttachments projectId={projectId} taskId={boardTask.taskId} />
        <TaskCommentsContainer 
          taskId={boardTask.taskId} 
          projectId={projectId} 
        />
      </DialogContent>
    </Dialog>
  );
}