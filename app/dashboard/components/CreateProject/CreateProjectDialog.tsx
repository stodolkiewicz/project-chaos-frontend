"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CreateProjectDialog({
  isCreateProjectDialogOpen,
  setIsCreateProjectDialogOpen,
  children,
}: {
  isCreateProjectDialogOpen: boolean;
  setIsCreateProjectDialogOpen: (open: boolean) => void;
  children: (onClose: () => void) => React.ReactNode;
}) {
  return (
    <Dialog
      open={isCreateProjectDialogOpen}
      onOpenChange={setIsCreateProjectDialogOpen}
    >
      <DialogContent className="lg:min-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
        </DialogHeader>
        {children(() => setIsCreateProjectDialogOpen(false))}
      </DialogContent>
    </Dialog>
  );
}
