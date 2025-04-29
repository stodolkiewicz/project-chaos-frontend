import BoardTask from "@/app/dashboard/components/BoardTask/BoardTask";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import CreateTaskDialog from "./CreateTask/CreateTaskDialog";

export default function Column({
  column,
  tasksInColumn,
  columnWidthPercentage,
}) {
  return (
    <div
      key={column.id}
      className="flex flex-col box-border border-2 rounded-md ml-2 mr-2 mb-20 min-h-[30rem] shadow-sm"
      style={{ width: `${columnWidthPercentage}%` }}
    >
      <h6 className="flex items-center px-1 py-1 bg-primary text-primary-foreground hover:bg-primary-darker-1 rounded-t-sm bg-primary-headers-darker hover:bg-primary-headers-darker transition-all duration-300 break-all">
        <span className="flex flex-1 justify-center">{column.name}</span>
      </h6>

      {tasksInColumn.map((taskInColumn) => (
        <BoardTask key={taskInColumn.taskId} boardTask={taskInColumn} />
      ))}

      <div className="w-full flex flex-1 justify-end items-end px-2 py-3">
        <CreateTaskDialog />
      </div>
    </div>
  );
}
