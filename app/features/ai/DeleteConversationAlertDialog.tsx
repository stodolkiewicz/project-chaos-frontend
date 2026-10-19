"use client";

import { useErrorHandler } from "@/app/hooks/useErrorHandler";
import { ConversationResponseDTO } from "@/app/state/ConversationsApiSlice";
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

export default function DeleteConversationAlertDialog({
  conversation,
  onConfirm,
  onClose,
}: {
  conversation: ConversationResponseDTO;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const { handleApiError } = useErrorHandler();

  const title = conversation.title || 'Untitled Conversation';

  async function handleOnDeleteConversation() {
    try {
      await onConfirm();
      toast.success(`Conversation "${title}" has been deleted.`);
    } catch (error) {
      handleApiError(error, `Failed to delete conversation "${title}".`);
    }
  }

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the{" "}
            <span className="font-bold">&ldquo;{title}&rdquo; </span>
            conversation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleOnDeleteConversation}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
