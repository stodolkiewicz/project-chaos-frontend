import BoardTask from "@/app/dashboard/components/BoardTask/BoardTask";
import CreateTaskDialog from "./CreateTask/CreateTaskDialog";
import CreateTaskForm from "./CreateTask/CreateTaskForm";
import { ColumnDTO } from "@/app/types/ColumnDTO";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function Column({
  column,
  tasksInColumn,
  columnWidthPercentage,
}: {
  column: ColumnDTO;
  tasksInColumn: BoardTaskDTO[];
  columnWidthPercentage: number;
}) {
  const maxPositionInColumn =
    tasksInColumn.length > 0
      ? Math.max(...tasksInColumn.map((task) => task.positionInColumn))
      : 0;

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
        <CreateTaskDialog>
          {/* children function returns React.ReactNode */}
          {(onClose) => (
            <>
              <DialogTitle>Add a new task</DialogTitle>
              <CreateTaskForm
                positionInColumn={maxPositionInColumn + 1}
                columnId={column.id}
                onClose={onClose}
              />
            </>
          )}
        </CreateTaskDialog>
      </div>
    </div>
  );
}
