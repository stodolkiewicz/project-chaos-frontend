"use client";

import { useErrorHandler } from "@/app/hooks/useErrorHandler";
import { useDeleteProjectInvitationMutation } from "@/app/state/ProjectInvitationsApiSlice";
import { InvitationResponseDTO } from "@/app/state/ProjectInvitationsApiSlice";
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

export default function DeleteInvitationAlertDialog({
  invitation,
  children,
}: {
  invitation: InvitationResponseDTO;
  children: React.ReactNode;
}) {
  const [deleteInvitation] = useDeleteProjectInvitationMutation();
  const { handleApiError } = useErrorHandler();

  async function handleOnDeleteInvitation() {
    try {
      await deleteInvitation({ 
        invitationId: invitation.id, 
        projectId: invitation.projectId 
      }).unwrap();
      toast.success(`Invitation for "${invitation.email}" has been deleted.`);
    } catch (error) {
      handleApiError(error, `Failed to delete invitation for "${invitation.email}".`);
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
          <p>Delete this invitation</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete the invitation to project for{" "}
            <span className="font-bold">{invitation.email}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleOnDeleteInvitation}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}