"use client";

import { useErrorHandler } from "@/app/hooks/useErrorHandler";
import { useRemoveUserFromProjectMutation } from "@/app/state/ProjectsApiSlice";
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

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function DeleteUserAlertDialog({
  user,
  projectId,
  children,
}: {
  user: User;
  projectId: string;
  children: React.ReactNode;
}) {
  const [removeUser] = useRemoveUserFromProjectMutation();
  const { handleApiError } = useErrorHandler();

  async function handleOnDeleteUser() {
    try {
      await removeUser({ 
        projectId, 
        userId: user.id 
      }).unwrap();
      
      const userName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.email;
      
      toast.success(`User "${userName}" has been removed from the project.`);
    } catch (error) {
      const userName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.email;
      
      handleApiError(error, `Failed to remove user "${userName}" from the project.`);
    }
  }

  const userName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.email;

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger className="cursor-pointer">
            {children}
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent align="center" className="-translate-x-[4px] border-1">
          <p>Remove user from project</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove{" "}
            <span className="font-bold">&ldquo;{userName}&rdquo;</span>
            {" "}from this project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleOnDeleteUser}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}