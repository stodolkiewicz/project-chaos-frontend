import { BoardTaskDTO } from "../types/BoardTasksDTO";

interface BoardTaskProps {
  boardTask: BoardTaskDTO;
}

export default function BoardTask({ boardTask }: BoardTaskProps) {
  return (
    <div className="rounded-2xl p-2 m-2 flex flex-col border-2 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
      <div className="flex">
        <h6 className="flex-1">{boardTask.title}</h6>
        {/* priority colorful square section */}
        <div className="flex flex-col items-end">
          <div
            className="w-2 h-1 rounded-full"
            style={{ backgroundColor: boardTask.priority.color }}
          ></div>
          <div className=" text-xs text-muted-foreground font-medium">
            {boardTask.priority.name}
          </div>
        </div>
      </div>
      <div>{boardTask.description}</div>
    </div>
  );
}
