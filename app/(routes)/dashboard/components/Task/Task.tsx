import { Separator } from "@radix-ui/react-separator";
import TaskHeader from "./TaskHeader";
import TaskFooter from "./TaskFooter";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { TaskStage } from "@/app/types/TaskStage";
import { useDraggable } from "@dnd-kit/core";

interface TaskProps {
  boardTask: BoardTaskDTO;
  stage: TaskStage;
  disableDrag?: boolean;
}

export default function Task({ boardTask, stage, disableDrag = false }: TaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: boardTask.taskId,
    disabled: disableDrag,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className="group rounded-md p-2 m-2 flex flex-col hover:shadow-md hover:bg-hover transition-all duration-300 bg-panel border border-divider h-full"
      ref={setNodeRef}
      style={{
        ...style,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}
    >
      <div className="flex flex-col flex-grow">
        <TaskHeader
          boardTask={boardTask}
          listeners={disableDrag ? undefined : listeners}
          attributes={disableDrag ? undefined : attributes}
          disableDrag={disableDrag}
        />
        <Separator className="bg-border h-[1.5px]" />
        <div className="mt-1 break-all flex-grow">{boardTask.description}</div>
      </div>
      <TaskFooter assigneeEmail={boardTask.assignee.email} boardTask={boardTask} stage={stage} />
    </div>
  );
}
