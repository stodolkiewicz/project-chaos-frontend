import { Separator } from "@radix-ui/react-separator";
import BoardTaskHeader from "./BoardTaskHeader";
import BoardTaskFooter from "./BoardTaskFooter";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";

interface BoardTaskProps {
  boardTask: BoardTaskDTO;
}

export default function BoardTask({ boardTask }: BoardTaskProps) {
  return (
    <div className="group rounded-md p-2 m-2 flex flex-col border-1 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
      <BoardTaskHeader boardTask={boardTask} />
      <Separator className="bg-border h-[1.5px]" />
      <div className="mt-1">{boardTask.description}</div>
      <BoardTaskFooter assigneeEmail={boardTask.assignee.email} />
    </div>
  );
}
