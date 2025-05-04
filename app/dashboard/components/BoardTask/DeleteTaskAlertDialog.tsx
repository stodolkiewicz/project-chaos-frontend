"use client";

import { useAppSelector } from "@/app/hooks";
import { useDeleteTaskMutation } from "@/app/state/TasksApiSlice";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteTaskAlertDialogProps {
  boardTask: BoardTaskDTO;
}

export default function DeleteTaskAlertDialog({
  boardTask,
  children,
}: {
  boardTask: BoardTaskDTO;
  children: React.ReactNode;
}) {
  const [deleteTask] = useDeleteTaskMutation();
  const projectId = useAppSelector((state) => state.user.defaultProjectId);

  async function handleOnDeleteTask() {
    try {
      await deleteTask({ projectId, taskId: boardTask.taskId }).unwrap();
      toast.success(`Task "${boardTask.title}" has been deleted.`);
    } catch {
      toast.error(`Failed to delete task "${boardTask.title}".`);
    }
  }

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger className="cursor-pointer">
            {children}
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent align="center" className="-translate-x-[4px] border-1">
          <p>Delete this task</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the{" "}
            <span className="font-bold">&ldquo;{boardTask.title}&rdquo; </span>
            task.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleOnDeleteTask}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
