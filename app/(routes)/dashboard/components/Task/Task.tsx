import { Separator } from "@radix-ui/react-separator";
import TaskHeader from "./TaskHeader";
import TaskFooter from "./TaskFooter";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { TaskStage } from "@/app/types/TaskStage";
import { useDraggable } from "@dnd-kit/core";
import { memo } from "react";

interface TaskProps {
  boardTask: BoardTaskDTO;
  stage: TaskStage;
  disableDrag?: boolean;
}

const Task = memo(function Task({ boardTask, stage, disableDrag = false }: TaskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
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
      ref={setNodeRef}
      style={{
        ...style,
        transition: transform ? 'none' : 'all 0.300s ease',
      }}
      className={`
        group rounded-md p-2 m-2 flex flex-col border border-divider transition-all duration-300
        bg-panel 
        ${isDragging ? "shadow-xl scale-101 z-50" : "shadow-sm"}
      `}
    >
      <TaskHeader
        boardTask={boardTask}
        listeners={disableDrag ? undefined : listeners}
        attributes={disableDrag ? undefined : attributes}
        disableDrag={disableDrag}
      />
      <Separator className="bg-border h-[1.5px]" />
      <div className="mt-1 break-all">{boardTask.description}</div>
      <TaskFooter assigneeEmail={boardTask.assignee.email} boardTask={boardTask} stage={stage} />
    </div>
  );
});

export default Task;
