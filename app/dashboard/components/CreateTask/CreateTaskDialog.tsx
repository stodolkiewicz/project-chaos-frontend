import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreateTaskDialog({
  children,
}: {
  // children is a function, which gets onClose and returns JSX
  children: (onClose: () => void) => React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Plus className="w-7 h-7 p-1 text-primary hover:scale-110 hover:text-green-600 hover:border-green-200 hover:border rounded-full transition-all duration-600 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="-translate-x-[1px] border-1">
              <p>Add a new task</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="lg:min-w-2xl">
        <DialogHeader>
          <DialogTitle>Add a new task</DialogTitle>
        </DialogHeader>
        {/* children get onClose function. The onClose function is defined here! */}
        {children(() => setIsOpen(false))}
      </DialogContent>
    </Dialog>
  );
}
