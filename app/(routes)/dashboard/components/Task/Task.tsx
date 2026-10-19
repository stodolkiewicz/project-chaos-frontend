import { Separator } from "@radix-ui/react-separator";
import TaskHeader from "./TaskHeader";
import TaskFooter from "./TaskFooter";
import TaskEditForm from "./TaskEditForm";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { TaskStage } from "@/app/types/TaskStage";
import { TaskEditField } from "@/app/types/TaskEditField";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { startTaskEdit, stopTaskEdit } from "@/app/state/uiSlice";
import { useDraggable } from "@dnd-kit/core";
import { memo, useCallback } from "react";
import { EDITABLE_FIELD_CLASS, editTriggerProps } from "./taskEditTrigger";

interface TaskProps {
  boardTask: BoardTaskDTO;
  stage: TaskStage;
  disableDrag?: boolean;
}

const Task = memo(function Task({ boardTask, stage, disableDrag = false }: TaskProps) {
  const dispatch = useAppDispatch();
  // Returns a primitive, so only the cards entering or leaving the edit mode re-render
  const editingField = useAppSelector((state) =>
    state.ui.editingTask?.taskId === boardTask.taskId ? state.ui.editingTask.field : null
  );
  const isEditing = editingField !== null;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: boardTask.taskId,
    disabled: disableDrag || isEditing,
  });

  const handleStartEdit = useCallback(
    (field: TaskEditField) => dispatch(startTaskEdit({ taskId: boardTask.taskId, field })),
    [dispatch, boardTask.taskId]
  );
  const handleStopEdit = useCallback(() => dispatch(stopTaskEdit()), [dispatch]);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // Without the drag handle the title starts at the card edge, so content needs no indent
  const contentIndentClass = disableDrag ? "" : "task-card-indent";

  const stateClasses = isEditing
    ? "border-primary -translate-y-1 shadow-lg"
    : `border-divider ${isDragging ? "shadow-xl scale-101 z-50" : "shadow-sm"}`;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        transition: transform ? 'none' : 'all 0.300s ease',
      }}
      className={`
        group rounded-md px-3 py-2.5 m-2 flex flex-col border transition-all duration-300
        bg-panel
        ${stateClasses}
      `}
    >
      {isEditing ? (
        <TaskEditForm
          boardTask={boardTask}
          initialField={editingField}
          onClose={handleStopEdit}
          variant="card"
        />
      ) : (
        <>
          <TaskHeader
            boardTask={boardTask}
            stage={stage}
            listeners={disableDrag ? undefined : listeners}
            attributes={disableDrag ? undefined : attributes}
            disableDrag={disableDrag}
            onStartEdit={handleStartEdit}
          />
          <Separator className="mt-0.5 bg-border h-[1.5px]" />
          {boardTask.description?.trim() ? (
            // The indent sits outside the highlighted area, so the hover background covers only the text
            <div className={`mt-2 ${contentIndentClass}`}>
              <div
                className={`text-sm text-text-muted line-clamp-3 break-words ${EDITABLE_FIELD_CLASS}`}
                {...editTriggerProps("description", handleStartEdit)}
              >
                {boardTask.description}
              </div>
            </div>
          ) : !boardTask.assignee.email && (
            // Keeps one empty text line so the card body does not collapse
            <div
              className={`mt-2 text-sm ${EDITABLE_FIELD_CLASS}`}
              aria-hidden="true"
              {...editTriggerProps("description", handleStartEdit)}
            >
              &nbsp;
            </div>
          )}
          <TaskFooter boardTask={boardTask} onStartEdit={handleStartEdit} />
        </>
      )}
    </div>
  );
});

export default Task;
