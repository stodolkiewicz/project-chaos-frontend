"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export default function CreateProjectDialog({
  children,
}: {
  children: (onClose: () => void) => React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <Button className="-translate-y-15" onClick={() => setIsOpen(!isOpen)}>
        Create your first project
      </Button>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="lg:min-w-2xl">
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
            </DialogHeader>
            {/* children get onClose function. The onClose function is defined here! */}
            {children(() => setIsOpen(false))}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
