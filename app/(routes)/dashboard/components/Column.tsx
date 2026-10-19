import Task from "@/app/(routes)/dashboard/components/Task/Task";
import AddTaskGhostCard from "./CreateTask/AddTaskGhostCard";
import { ColumnDTO } from "@/app/types/ColumnDTO";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { TaskStage } from "@/app/types/TaskStage";
import { useDroppable } from "@dnd-kit/core";

export default function Column({
  column,
  tasksInColumn,
  isFirstColumn,
}: {
  column: ColumnDTO;
  tasksInColumn: BoardTaskDTO[];
  // New tasks are added only to the first column
  isFirstColumn: boolean;
}) {
  const maxPositionInColumn =
    tasksInColumn.length > 0
      ? Math.max(...tasksInColumn.map((task) => task.positionInColumn))
      : 0;

  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      key={column.id}
      id={column.id}
      className="flex flex-col box-border border-2 ml-2 mr-2 mb-4 min-h-[30rem] shadow-sm bg-panel-muted"
      style={{ borderRadius: '12px', padding: '12px' }}
      ref={setNodeRef}
    >
      <h6 className="flex items-center px-1 py-1 bg-primary text-primary-foreground hover:bg-primary-darker-1 rounded-t-sm bg-primary-headers-darker hover:bg-primary-headers-darker transition-all duration-300 break-all">
        <span className="flex flex-1 justify-center">{column.name}</span>
      </h6>

      {tasksInColumn.map((taskInColumn) => (
        <Task key={taskInColumn.taskId} boardTask={taskInColumn} stage={TaskStage.BOARD} />
      ))}

      {isFirstColumn && (
        // The auto top margin pushes the card to the bottom of the column
        <div className="mt-auto flex flex-col">
          <AddTaskGhostCard
            columnId={column.id}
            positionInColumn={maxPositionInColumn + 1}
            compact
          />
        </div>
      )}
    </div>
  );
}
