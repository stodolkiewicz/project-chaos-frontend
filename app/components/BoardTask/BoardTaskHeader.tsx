import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import DeleteTaskAlertDialog from "./DeleteTaskAlertDialog";

interface BoardTaskHeaderProps {
  boardTask: BoardTaskDTO;
}

export default function BoardTaskHeader({ boardTask }: BoardTaskHeaderProps) {
  return (
    <div className="flex">
      <h6 className="flex-1">{boardTask.title}</h6>

      <DeleteTaskAlertDialog boardTask={boardTask} />

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
  );
}
