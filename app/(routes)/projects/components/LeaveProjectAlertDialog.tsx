"use client";

import { useErrorHandler } from "@/app/hooks/useErrorHandler";
import { useLeaveProjectMutation } from "@/app/state/ProjectsApiSlice";
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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function LeaveProjectAlertDialog({
  projectId,
  projectName,
  children,
}: {
  projectId: string;
  projectName: string;
  children: React.ReactNode;
}) {
  const [leaveProject] = useLeaveProjectMutation();
  const { handleApiError } = useErrorHandler();

  async function handleOnLeaveProject() {
    try {
      await leaveProject(projectId).unwrap();
      toast.success(`Successfully left project "${projectName}".`);
    } catch (error) {
      handleApiError(error, `Failed to leave project "${projectName}".`);
    }
  }

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            {children}
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent align="center" className="-translate-x-[4px] border-1">
          <p>Leave project</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove you from the project{" "}
            <span className="font-bold">&ldquo;{projectName}&rdquo;</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleOnLeaveProject}>
            Leave Project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}