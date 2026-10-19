import { TaskStage } from "@/app/types/TaskStage";
import { Plus } from "lucide-react";
import CreateTaskDialog from "./CreateTaskDialog";
import CreateTaskForm from "./CreateTaskForm";

interface AddTaskGhostCardProps {
  stage?: TaskStage;
  // Board column the new task goes to
  columnId?: string;
  positionInColumn?: number;
  // Puts the icon and the text in one line, for the narrow board columns
  compact?: boolean;
}

// Placeholder card in the task list that opens the create task dialog
export default function AddTaskGhostCard({
  stage,
  columnId,
  positionInColumn = 0,
  compact = false,
}: AddTaskGhostCardProps) {
  const layoutClass = compact ? "flex-row gap-1 py-1.5" : "flex-col gap-1.5 min-h-24";

  return (
    <CreateTaskDialog
      trigger={
        <button
          type="button"
          className={`group m-2 flex items-center justify-center ${layoutClass} rounded-md border border-dashed border-divider bg-panel/70 text-sm text-foreground cursor-pointer transition-all duration-300 hover:bg-panel hover:scale-[1.03] hover:shadow-lg`}
        >
          {/* Hovering the card animates the icon like the "+" in the board columns */}
          <Plus
            className="w-7 h-7 p-1 rounded-full text-primary transition-all duration-600 group-hover:scale-110 group-hover:text-green-600 group-hover:border group-hover:border-green-200"
            aria-hidden="true"
          />
          Add task
        </button>
      }
    >
      {(onClose) => (
        <CreateTaskForm
          positionInColumn={positionInColumn}
          columnId={columnId}
          stage={stage}
          onClose={onClose}
        />
      )}
    </CreateTaskDialog>
  );
}
