"use client";

import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { useMarkTaskCommentsAsReadMutation } from "@/app/state/TaskCommentsApiSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskEditField } from "@/app/types/TaskEditField";
import { useState } from "react";
import TaskCommentsContainer from "../comments/TaskCommentsContainer";
import { TaskAttachments } from "./attachments/TaskAttachments";
import TaskEditForm from "./TaskEditForm";
import { getLabelColors } from "./taskCardStyles";
import { EDITABLE_FIELD_CLASS, EDITABLE_LABEL_CLASS, editTriggerProps } from "./taskEditTrigger";

export default function TaskCommentsDialog({
  boardTask,
  children,
}: {
  boardTask: BoardTaskDTO;
  children: React.ReactNode;
}) {
  const { data } = useGetDefaultProjectIdQuery();
  const projectId = data?.projectId;
  const [markTaskCommentsAsRead] = useMarkTaskCommentsAsReadMutation();
  // Local, so editing here does not switch the board card into the edit mode
  const [editingField, setEditingField] = useState<TaskEditField | null>(null);

  if (!projectId) return null;

  // Comments are marked as read on close, not on open.
  // Marking on open refetches the task list with a zero count.
  // The unread badge then unmounts and closes this dialog with it.
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      markTaskCommentsAsRead({ projectId, taskId: boardTask.taskId });
      setEditingField(null);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent
        className="max-w-[70vw] w-full max-h-[90vh] overflow-y-auto sm:max-w-[70vw] top-[50vh] bg-gray-50"
        // While editing, Escape cancels the edit instead of closing the dialog
        onEscapeKeyDown={(e) => {
          if (editingField) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription className="sr-only">
            Details, attachments and comments of the task.
          </DialogDescription>
        </DialogHeader>
        <div className="p-3 bg-white rounded-lg">
          {editingField ? (
            <TaskEditForm
              boardTask={boardTask}
              initialField={editingField}
              onClose={() => setEditingField(null)}
              variant="details"
            />
          ) : (
            <>
              <h4
                className={`font-semibold text-base mb-1 ${EDITABLE_FIELD_CLASS}`}
                {...editTriggerProps("title", setEditingField)}
              >
                {boardTask.title}
              </h4>
              {boardTask.labels?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {boardTask.labels.map((label) => (
                    <span
                      key={label.id}
                      className={`rounded-full px-2 py-0 text-xs font-medium ${EDITABLE_LABEL_CLASS}`}
                      style={getLabelColors(label.color)}
                      {...editTriggerProps("labels", setEditingField)}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
              {boardTask.priority.name && (
                <div
                  className={`text-xs text-gray-500 mb-2 ${EDITABLE_FIELD_CLASS}`}
                  {...editTriggerProps("priority", setEditingField)}
                >
                  Priority: {boardTask.priority.name}
                </div>
              )}
              <p
                // The minimal height keeps an empty description double-clickable
                className={`min-h-6 text-base text-gray-900 mb-2 ${EDITABLE_FIELD_CLASS}`}
                {...editTriggerProps("description", setEditingField)}
              >
                {boardTask.description}
              </p>
              {boardTask.assignee.email && (
                <div
                  className={`text-sm text-gray-900 ${EDITABLE_FIELD_CLASS}`}
                  {...editTriggerProps("assignee", setEditingField)}
                >
                  <span>Assigned to: {boardTask.assignee.email}</span>
                </div>
              )}
            </>
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