import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { TaskStage } from "@/app/types/TaskStage";
import { MdDragIndicator } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDndContext } from "@dnd-kit/core";
import { useState } from "react";
import TaskMenu from "./TaskMenu";
import UnreadCommentsButton from "./UnreadCommentsButton";
import { getLabelColors } from "./taskCardStyles";

interface TaskHeaderProps {
  boardTask: BoardTaskDTO;
  stage: TaskStage;
  listeners?: React.HTMLAttributes<HTMLDivElement>;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
  disableDrag?: boolean;
}

export default function TaskHeader({
  boardTask,
  stage,
  listeners,
  attributes,
  disableDrag = false,
}: TaskHeaderProps) {
  const { active } = useDndContext();
  const isDragging = active?.id === boardTask.taskId;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-[var(--task-header-gap)]">
        {!disableDrag && (
          <Tooltip
            open={isDragging ? false : tooltipOpen}
            onOpenChange={setTooltipOpen}
          >
            <TooltipTrigger asChild>
              <div
                className={`flex items-center shrink-0 text-muted-foreground touch-none select-none ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                {...listeners}
                {...attributes}
              >
                <MdDragIndicator
                  className="size-[var(--task-drag-handle-size)]"
                  aria-hidden="true"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent align="center" className="translate-x-[1px] border-1">
              <p>Drag to another column</p>
            </TooltipContent>
          </Tooltip>
        )}

        <h6 className="flex-1 min-w-0 font-medium break-words">{boardTask.title}</h6>

        <UnreadCommentsButton boardTask={boardTask} />

        <TaskMenu boardTask={boardTask} stage={stage} />
      </div>

      {boardTask.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {boardTask.labels.map((label) => (
            <span
              key={label.id}
              className="rounded-full px-2 py-0 text-xs font-medium"
              style={getLabelColors(label.color)}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
