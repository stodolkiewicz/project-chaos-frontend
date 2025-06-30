"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetColumnsQuery } from "@/app/state/ColumnsApiSlice";
import { Button } from "@/components/ui/button";
import {
  useGetBoardTasksQuery,
  useMoveTaskMutation,
} from "@/app/state/TasksApiSlice";
import { useGetProjectQuery } from "@/app/state/ProjectsApiSlice";
import Column from "./Column";
import { DndContext } from "@dnd-kit/core";
import { useState } from "react";
import CreateProjectDialog from "./CreateProject/CreateProjectDialog";
import CreateProjectForm from "./CreateProject/CreateProjectForm";
import { ChevronDown, Folder } from "lucide-react";
import ProjectMenu from "./ProjectMenu";

export default function DashboardContent() {
  const defaultProjectId = useAppSelector(
    (state) => state.user.defaultProjectId
  );

  // for storing maxPositionInColumn from all columns
  const [maxPositions, setMaxPositions] = useState({});

  function handleMaxPositionInColumn(columnId, maxPosition) {
    setMaxPositions((prev) => {
      // to avoid infinite rendering loop return prev state if no changes
      if (prev[columnId] === maxPosition) return prev;
      return {
        ...prev,
        [columnId]: maxPosition,
      };
    });
  }

  // for dragging
  const [parent, setParent] = useState(null);

  const [moveTask, { isLoading, isSuccess, isError, error }] =
    useMoveTaskMutation();

  function handleDragEnd(event) {
    const { over } = event;
    const taskBeingDraggedId = event.active.id;
    const columnBeingDroppedIntoId = event.over.id;

    // console.log("upuszczon");
    // console.log("task being dragged:" + event.active.id);
    // console.log("columnId being dropped into:" + event.over.id);
    // console.log("event summary:", {
    //   active: event.active,
    //   over: event.over,
    //   delta: event.delta,
    // });

    moveTask({
      projectId: defaultProjectId,
      taskId: taskBeingDraggedId,
      updateTaskColumnDTO: {
        targetColumnId: columnBeingDroppedIntoId,
        positionInColumn: maxPositions[columnBeingDroppedIntoId] + 1,
        // to do: fix it. Not used on the backend at all.
        nearestNeighboursPositionInColumn: [1, 3],
      },
    });

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useGetProjectQuery(defaultProjectId, {
    skip:
      !useAppSelector((state) => state.user.accessToken) || !defaultProjectId,
  });

  const {
    data: columns,
    isLoading: columnsLoading,
    error: columnsError,
  } = useGetColumnsQuery(defaultProjectId, {
    skip:
      !useAppSelector((state) => state.user.accessToken) || !defaultProjectId,
  });

  const {
    data: boardTasks,
    isLoading: boardTasksLoading,
    error: boardTasksError,
  } = useGetBoardTasksQuery(defaultProjectId, {
    skip:
      !useAppSelector((state) => state.user.accessToken) || !defaultProjectId,
  });

  if (!defaultProjectId || !columns) {
    // console.log("columns - not there!");
    return (
      <CreateProjectDialog>
        {(onClose) => <CreateProjectForm onClose={onClose}></CreateProjectForm>}
      </CreateProjectDialog>
    );
  }

  let columnWidthPercentage = 80 / columns?.length;

  if (columnsLoading || boardTasksLoading) return <div>Loading...</div>;
  if (columnsError)
    return (
      <div>
        Error:{" "}
        {"message" in columnsError ? columnsError.message : "Unknown error"}
      </div>
    );
  if (boardTasksError)
    return (
      <div>
        Error:{" "}
        {"message" in boardTasksError
          ? boardTasksError.message
          : "Unknown error"}
      </div>
    );

  const groupedTasks = columns?.reduce((acc, column) => {
    acc[column.id] = boardTasks?.filter((task) => task.column.id === column.id);
    return acc;
  }, {});

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        {/* PROJECT NAME */}
        <ProjectMenu projectName={project.name} />
        {/* COLUMNS */}
        {columns?.length > 0 && (
          <div className="flex justify-center mx-auto">
            {columns.map((column, index) => {
              const tasksInColumn = groupedTasks[column.id] || [];
              return (
                <Column
                  key={column.id}
                  column={column}
                  tasksInColumn={tasksInColumn}
                  columnWidthPercentage={columnWidthPercentage}
                  onMaxPositionInColumn={handleMaxPositionInColumn}
                />
              );
            })}
          </div>
        )}
      </div>
    </DndContext>
  );
}
