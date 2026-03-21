import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { TaskStage } from "@/app/types/TaskStage";
import DeleteTaskAlertDialog from "./DeleteTaskAlertDialog";
import TaskCommentsDialog from "./TaskCommentsDialog";
import { MoreVertical, Trash2, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface TaskFooterProps {
  assigneeEmail: string;
  boardTask: BoardTaskDTO;
  stage: TaskStage;
}

export default function TaskFooter({
  assigneeEmail,
  boardTask,
  stage,
}: TaskFooterProps) {
  return (
    <div className="flex flex-col mt-3">
      {assigneeEmail && (
        <>
          <div className="text-xs font-medium text-text-muted">assigned to:</div>
          <div className="flex justify-between items-center">
            <div className="text-xs break-all text-text-muted">{assigneeEmail}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVertical
                  className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground ml-2"
                  onPointerDown={(e) => e.stopPropagation()}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onPointerDown={(e) => e.stopPropagation()}>
                <TaskCommentsDialog boardTask={boardTask}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comments
                  </DropdownMenuItem>
                </TaskCommentsDialog>
                <DeleteTaskAlertDialog boardTask={boardTask} stage={stage}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Task
                  </DropdownMenuItem>
                </DeleteTaskAlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
      {!assigneeEmail && (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical
                className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground ml-2"
                onPointerDown={(e) => e.stopPropagation()}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onPointerDown={(e) => e.stopPropagation()}>
              <TaskCommentsDialog boardTask={boardTask}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comments
                </DropdownMenuItem>
              </TaskCommentsDialog>
              <DeleteTaskAlertDialog boardTask={boardTask} stage={stage}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DeleteTaskAlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
