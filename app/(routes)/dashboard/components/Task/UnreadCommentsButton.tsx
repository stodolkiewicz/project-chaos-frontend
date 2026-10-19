import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { MessageSquare } from "lucide-react";
import { memo } from "react";
import TaskCommentsDialog from "./TaskDetailsDialog";

interface UnreadCommentsButtonProps {
  boardTask: BoardTaskDTO;
}

const UnreadCommentsButton = memo(function UnreadCommentsButton({
  boardTask,
}: UnreadCommentsButtonProps) {
  const unreadCommentsCount = boardTask.unreadCommentsCount;

  if (!(unreadCommentsCount > 0)) {
    return null;
  }

  return (
    <TaskCommentsDialog boardTask={boardTask}>
      <button
        type="button"
        aria-label={`${unreadCommentsCount} unread comment${unreadCommentsCount === 1 ? "" : "s"}`}
        className="flex items-center gap-1 shrink-0 -mr-0.5 text-xs font-medium text-text-muted cursor-pointer hover:text-foreground"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {unreadCommentsCount}
        <MessageSquare className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </TaskCommentsDialog>
  );
});

export default UnreadCommentsButton;
