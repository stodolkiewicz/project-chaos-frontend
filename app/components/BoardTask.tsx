import { BoardTaskDTO } from "../types/BoardTasksDTO";

interface BoardTaskProps {
  boardTask: BoardTaskDTO;
}

export default function BoardTask({ boardTask }: BoardTaskProps) {
  return (
    <div className="rounded-2xl p-2 m-2 flex flex-col border-2">
      <div className="flex">
        <h6 className="flex-1/2">{boardTask.title}</h6>
        <div
          className="w-3 h-2 rounded-full"
          style={{ backgroundColor: boardTask.priority.color }}
        ></div>
      </div>
      {boardTask.priority.color}
      <div>{boardTask.description}</div>
    </div>
  );
}
