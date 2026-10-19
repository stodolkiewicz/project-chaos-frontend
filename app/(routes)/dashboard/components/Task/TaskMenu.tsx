import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { TaskStage } from "@/app/types/TaskStage";
import DeleteTaskAlertDialog from "./DeleteTaskAlertDialog";
import TaskCommentsDialog from "./TaskDetailsDialog";
import { MoreVertical, Trash2, Archive, RotateCcw, Calendar, CheckCheck, ArrowUpLeft, Undo2, Play, LayoutDashboard, Inbox, ListPlus, FileText } from "lucide-react";
import { 
  useMoveTasksToBacklogMutation, 
  useMoveTasksToArchiveMutation, 
  useMoveTasksToBoardMutation 
} from "@/app/state/TasksApiSlice";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { useErrorHandler } from "@/app/hooks/useErrorHandler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { memo, useState } from "react";

interface TaskMenuProps {
  boardTask: BoardTaskDTO;
  stage: TaskStage;
}

const TaskMenu = memo(function TaskMenu({
  boardTask,
  stage,
}: TaskMenuProps) {
  const { data } = useGetDefaultProjectIdQuery();
  const projectId = data?.projectId;
  const { handleApiError } = useErrorHandler();
  
  const [moveToBacklog] = useMoveTasksToBacklogMutation();
  const [moveToArchive] = useMoveTasksToArchiveMutation();
  const [moveToBoard] = useMoveTasksToBoardMutation();

  const handleMoveTask = async (targetStage: TaskStage) => {
    if (!projectId) return;
    
    try {
      switch (targetStage) {
        case TaskStage.BACKLOG:
          await moveToBacklog({ projectId, taskIds: [boardTask.taskId] }).unwrap();
          break;
        case TaskStage.ARCHIVED:
          await moveToArchive({ projectId, taskIds: [boardTask.taskId] }).unwrap();
          break;
        case TaskStage.BOARD:
          await moveToBoard({ projectId, taskIds: [boardTask.taskId] }).unwrap();
          break;
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const getMenuOptions = () => {
    const options = [];
    
    // Always add Comments first
    options.push({
      type: "comments",
      component: (
        <TaskCommentsDialog key="comments" boardTask={boardTask}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <FileText className="h-4 w-4 mr-2" />
            Task Details
          </DropdownMenuItem>
        </TaskCommentsDialog>
      )
    });

    // Add move options based on stage
    const moveOptions = [];
    switch (stage) {
      case TaskStage.BOARD:
        moveOptions.push(
          { 
            label: "Back to Backlog", 
            icon: ListPlus,
            action: () => handleMoveTask(TaskStage.BACKLOG)
          },
          { 
            label: "Move to Done", 
            icon: CheckCheck, 
            action: () => handleMoveTask(TaskStage.ARCHIVED)
          }
        );
        break;
      case TaskStage.BACKLOG:
        moveOptions.push({ 
          label: "Move to Board",
          icon: Play, 
          action: () => handleMoveTask(TaskStage.BOARD)
        });
        break;
      case TaskStage.ARCHIVED:
        moveOptions.push(
          { 
            label: "Back to Board", 
            icon: LayoutDashboard, 
            action: () => handleMoveTask(TaskStage.BOARD) 
          },
          { 
            label: "Back to Backlog", 
            icon: ListPlus, 
            action: () => handleMoveTask(TaskStage.BACKLOG)
          }
        );
        break;
    }

    // Add move options as regular menu items
    moveOptions.forEach((option, index) => {
      options.push({
        type: "move",
        component: (
          <DropdownMenuItem key={`move-${index}`} onClick={option.action}>
            <option.icon className="h-4 w-4 mr-2" />
            {option.label}
          </DropdownMenuItem>
        )
      });
    });

    // Add Delete option only for BOARD and BACKLOG stages
    if (stage !== TaskStage.ARCHIVED) {
      // Add separator before delete
      options.push({
        type: "separator",
        component: <DropdownMenuSeparator key="separator" />
      });
      
      options.push({
        type: "delete",
        component: (
          <DeleteTaskAlertDialog key="delete" boardTask={boardTask} stage={stage}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2 className="h-4 w-4 mr-2 text-red-500" />
              Delete Task
            </DropdownMenuItem>
          </DeleteTaskAlertDialog>
        )
      });
    }

    return options;
  };

  const menuOptions = getMenuOptions();

  // The trigger keeps its space while hidden, so nothing shifts on hover.
  // It is narrower than the icon, pulled closer to its neighbour and into the card padding
  // to reserve as little space as possible.
  const triggerVisibilityClasses = [
    "opacity-0",
    "group-hover:opacity-100",
    "focus-visible:opacity-100",
    "data-[state=open]:opacity-100",
    "[@media(hover:none)]:opacity-100",
  ].join(" ");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Task menu"
          className={`flex justify-center shrink-0 w-3 -ml-0.5 -mr-2 rounded-sm text-muted-foreground cursor-pointer hover:text-foreground ${triggerVisibilityClasses}`}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4 shrink-0" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onPointerDown={(e) => e.stopPropagation()}>
        {menuOptions.map((option, index) => option.component)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default TaskMenu;
