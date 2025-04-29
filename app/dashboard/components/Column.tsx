import BoardTask from "@/app/dashboard/components/BoardTask/BoardTask";
import { Plus } from "lucide-react";

export default function Column({
  column,
  tasksInColumn,
  columnWidthPercentage,
}) {
  return (
    <div
      key={column.id}
      className="box-border border-2 rounded-sm ml-2 mr-2 min-h-[30rem]"
      style={{ width: `${columnWidthPercentage}%` }}
    >
      <h5 className="group flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 bg-primary-headers-darker hover:bg-primary-headers-darker transition-all duration-300">
        <span className="flex flex-1 justify-center">{column.name}</span>
        <Plus className=" hover:scale-115 text-green-600 w-7 h-7 p-1 hover:border-slate-300 hover:border rounded-full transition-all duration-300 cursor-pointer" />
      </h5>

      {tasksInColumn.map((taskInColumn) => (
        <BoardTask key={taskInColumn.taskId} boardTask={taskInColumn} />
      ))}
    </div>
  );
}
