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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteTaskAlertDialogProps {
  boardTask: BoardTaskDTO;
}

export default function DeleteTaskAlertDialog({
  boardTask,
}: DeleteTaskAlertDialogProps) {
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
      <AlertDialogTrigger>
        <Trash2 className="h-4 w-4 text-muted-foreground mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </AlertDialogTrigger>
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
