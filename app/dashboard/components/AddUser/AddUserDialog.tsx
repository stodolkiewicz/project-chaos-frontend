"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AddUserDialog({
  isAddUserToProjectDialogOpen,
  setIsAddUserToProjectDialogOpen,
  children,
}: {
  isAddUserToProjectDialogOpen: boolean;
  setIsAddUserToProjectDialogOpen: (open: boolean) => void;
  children: (onClose: () => void) => React.ReactNode;
}) {
  return (
    <Dialog
      open={isAddUserToProjectDialogOpen}
      onOpenChange={setIsAddUserToProjectDialogOpen}
    >
      <DialogContent className="lg:min-w-2xl">
        <DialogHeader>
          <DialogTitle>Add member to project</DialogTitle>
        </DialogHeader>
        {children(() => setIsAddUserToProjectDialogOpen(false))}
      </DialogContent>
    </Dialog>
  );
}
