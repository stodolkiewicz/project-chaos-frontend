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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

export default function CreateTaskDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Plus className="w-7 h-7 p-1 text-primary hover:scale-110 hover:text-green-600 hover:border-green-200 hover:border rounded-full transition-all duration-600 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogTrigger>
      <DialogContent className="lg:min-w-2xl">
        <DialogHeader>{children}</DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
