import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import DeleteTaskAlertDialog from "./DeleteTaskAlertDialog";
import { Trash2 } from "lucide-react";
import { MdDragIndicator } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDndContext } from "@dnd-kit/core";
import { useState } from "react";

interface BoardTaskHeaderProps {
  boardTask: BoardTaskDTO;
}

function isColorDark(hexColor: string): boolean {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 128;
}

interface BoardTaskHeaderProps {
  boardTask: BoardTaskDTO;
  listeners?: React.HTMLAttributes<HTMLDivElement>;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
}

export default function BoardTaskHeader({
  boardTask,
  listeners,
  attributes,
}: BoardTaskHeaderProps) {
  const { active } = useDndContext();
  const isDragging = active?.id === boardTask.taskId;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <>
      <div className="flex">
        <Tooltip
          open={isDragging ? false : tooltipOpen}
          onOpenChange={setTooltipOpen}
        >
          <TooltipTrigger asChild>
            <div
              className={`flex items-center mr-1  ${
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

        <h6 className="flex-1 ">{boardTask.title}</h6>

        <DeleteTaskAlertDialog boardTask={boardTask}>
          <Trash2
            className="h-4 w-4 text-muted-foreground mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onPointerDown={(e) => e.stopPropagation()}
          />
        </DeleteTaskAlertDialog>

        <div className="flex flex-col items-end mr-2">
          <div
            className="w-2 h-1 rounded-full"
            style={{ backgroundColor: boardTask.priority.color }}
          />
          <div className="text-xs text-muted-foreground font-medium">
            {boardTask.priority.name}
          </div>
        </div>
      </div>
      <div>
        {boardTask.labels.map((label, id) => (
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
