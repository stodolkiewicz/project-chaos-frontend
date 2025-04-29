import BoardTask from "@/app/dashboard/components/BoardTask/BoardTask";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import CreateTaskDialog from "./CreateTaskDialog";

export default function Column({
  column,
  tasksInColumn,
  columnWidthPercentage,
}) {
  return (
    <div
      key={column.id}
      className="flex flex-col box-border border-2 rounded-sm ml-2 mr-2 mb-20 min-h-[30rem]"
      style={{ width: `${columnWidthPercentage}%` }}
    >
      <h5 className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 bg-primary-headers-darker hover:bg-primary-headers-darker transition-all duration-300">
        <span className="flex flex-1 justify-center">{column.name}</span>
      </h5>

      {tasksInColumn.map((taskInColumn) => (
        <BoardTask key={taskInColumn.taskId} boardTask={taskInColumn} />
      ))}

      <div className="w-full flex flex-1 justify-end items-end px-2 py-3">
        <CreateTaskDialog />
      </div>
    </div>
  );
}
