import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAvatarColor, getInitials } from "./taskCardStyles";

interface TaskFooterProps {
  boardTask: BoardTaskDTO;
}

const TaskFooter = memo(function TaskFooter({
  boardTask,
}: TaskFooterProps) {
  const priorityName = boardTask.priority.name;
  const assigneeEmail = boardTask.assignee.email;

  if (!priorityName && !assigneeEmail) {
    return null;
  }

  return (
    <div className="flex items-center gap-2.5 mt-2.5">
      {/* Only the dot carries the priority color; the pill itself stays neutral */}
      {priorityName && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-divider px-2 py-0.5 text-xs font-medium text-text-muted transition duration-150 ease-out hover:scale-105 hover:shadow-sm">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: boardTask.priority.color }}
            aria-hidden="true"
          />
          {priorityName}
        </span>
      )}

      {assigneeEmail && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              role="img"
              aria-label={assigneeEmail}
              className="ml-auto flex items-center justify-center size-6 shrink-0 rounded-full text-[11px] font-medium text-white"
              style={{ backgroundColor: getAvatarColor(assigneeEmail) }}
            >
              {getInitials(assigneeEmail)}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{assigneeEmail}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
});

export default TaskFooter;
