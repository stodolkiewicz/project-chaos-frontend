"use client";

import { useErrorHandler } from "@/app/hooks/useErrorHandler";
import { useDeleteTaskMutation } from "@/app/state/TasksApiSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { RequestDeleteTaskEvent } from "./types";

export default function AIDeleteTaskAlertDialog({
  projectId,
  proposal,
  onClose,
}: {
  projectId: string;
  proposal: RequestDeleteTaskEvent;
  onClose: () => void;
}) {
  const [deleteTask] = useDeleteTaskMutation();
  const { handleApiError } = useErrorHandler();

  async function handleOnDeleteTask() {
    try {
      await deleteTask({ projectId, taskId: proposal.taskId }).unwrap();
      toast.success(`Task "${proposal.title}" has been deleted.`);
    } catch (error) {
      handleApiError(error, `Failed to delete task "${proposal.title}".`);
    }
  }

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>AI suggests deleting a task</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the{" "}
            <span className="font-bold">&ldquo;{proposal.title}&rdquo; </span>
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
