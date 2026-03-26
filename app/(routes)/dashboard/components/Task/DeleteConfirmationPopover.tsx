"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DeleteConfirmationPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  trigger: React.ReactNode;
  title?: string;
  description?: string;
}

export function DeleteConfirmationPopover({
  isOpen,
  onOpenChange,
  onConfirm,
  trigger,
  title = "Delete item?",
  description = "This action cannot be undone."
}: DeleteConfirmationPopoverProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-48 p-3" align="end">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-gray-500 mt-1">
              {description}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="flex-1 h-7 text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirm}
              className="flex-1 h-7 text-xs"
            >
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}