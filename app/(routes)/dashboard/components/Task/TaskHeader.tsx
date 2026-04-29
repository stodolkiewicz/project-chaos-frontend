import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { MdDragIndicator } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDndContext } from "@dnd-kit/core";
import { useState } from "react";

function isColorDark(hexColor: string): boolean {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 128;
}

interface TaskHeaderProps {
  boardTask: BoardTaskDTO;
  listeners?: React.HTMLAttributes<HTMLDivElement>;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
  disableDrag?: boolean;
}

export default function TaskHeader({
  boardTask,
  listeners,
  attributes,
  disableDrag = false,
}: TaskHeaderProps) {
  const { active } = useDndContext();
  const isDragging = active?.id === boardTask.taskId;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <>
      <div className="flex">
        {!disableDrag && (
          <Tooltip
            open={isDragging ? false : tooltipOpen}
            onOpenChange={setTooltipOpen}
          >
            <TooltipTrigger asChild>
              <div
                className={`flex items-center mr-1 touch-none select-none ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                {...listeners}
                {...attributes}
              >
                <MdDragIndicator />
              </div>
            </TooltipTrigger>
            <TooltipContent align="center" className="translate-x-[1px] border-1">
              <p>Drag to another column</p>
            </TooltipContent>
          </Tooltip>
        )}

        <h6 className="flex-1 ">{boardTask.title}</h6>


        <div className="flex flex-col items-end mr-2">
          <div
            className="w-2 h-1 rounded-full"
            style={{ backgroundColor: boardTask.priority.color }}
          />
          <div className="text-xs text-text-muted font-medium">
            {boardTask.priority.name}
          </div>
        </div>
      </div>
      <div>
        {boardTask.labels?.map((label, id) => (
          <div
            key={id}
            className={`shadow-2xl inline-block hover:opacity-78 duration-300 overflow-hidden text-ellipsis font-medium text-xs  bg-amber-300 rounded-full pr-1.5 pl-1.5 ${
              isColorDark(label.color) ? "text-white" : ""
            }`}
            style={{ backgroundColor: label.color }}
          >
            {"#" + label.name + " "}
          </div>
        ))}
      </div>
    </>
  );
}
