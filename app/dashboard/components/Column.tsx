import BoardTask from "@/app/dashboard/components/BoardTask/BoardTask";

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
      <h5 className="text-center bg-primary hover:bg-[var(--primary-hover)] transition-all duration-300">
        {column.name}
      </h5>
      {tasksInColumn.map((taskInColumn) => (
        <BoardTask key={taskInColumn.taskId} boardTask={taskInColumn} />
      ))}
    </div>
  );
}
