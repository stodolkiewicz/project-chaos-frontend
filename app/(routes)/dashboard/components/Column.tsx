import Task from "@/app/(routes)/dashboard/components/Task/Task";
import AddTaskGhostCard from "./CreateTask/AddTaskGhostCard";
import { ColumnDTO } from "@/app/types/ColumnDTO";
import { COLUMN_COLORS } from "@/app/types/ColumnColor";
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
      className="flex flex-col box-border border-2 ml-2 mr-2 mb-4 min-h-[30rem] dark:shadow-sm bg-panel-muted"
      style={{ borderRadius: '12px', padding: '8px' }}
      ref={setNodeRef}
    >
      {/* The left padding equals the card margin, border and padding, so the dot lines up with the drag handle of the cards */}
      <h6 className="flex items-center gap-2 pl-[21px] pr-2 py-1 text-sm break-all">
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: COLUMN_COLORS[column.color] }}
          aria-hidden="true"
        />
        <span className="text-foreground">{column.name}</span>
        <span className="font-normal text-text-muted">· {tasksInColumn.length}</span>
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
