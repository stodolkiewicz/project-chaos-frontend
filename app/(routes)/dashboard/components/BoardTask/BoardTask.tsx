import { Separator } from "@radix-ui/react-separator";
import BoardTaskHeader from "./BoardTaskHeader";
import BoardTaskFooter from "./BoardTaskFooter";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { useDraggable } from "@dnd-kit/core";

interface BoardTaskProps {
  boardTask: BoardTaskDTO;
}

export default function BoardTask({ boardTask }: BoardTaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: boardTask.taskId,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className="group rounded-md p-2 m-2 flex flex-col hover:shadow-md hover:bg-hover transition-all duration-300 bg-panel border border-divider"
      ref={setNodeRef}
      style={{
        ...style,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}
    >
      <BoardTaskHeader
        boardTask={boardTask}
        listeners={listeners}
        attributes={attributes}
      />
      <Separator className="bg-border h-[1.5px]" />
      <div className="mt-1 break-all">{boardTask.description}</div>
      <BoardTaskFooter assigneeEmail={boardTask.assignee.email} boardTask={boardTask} />
    </div>
  );
}
