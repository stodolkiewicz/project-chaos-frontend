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

    console.log("upuszczon");
    console.log("task being dragged:" + event.active.id);
    console.log("columnId being dropped into:" + event.over.id);
    console.log("event summary:", {
      active: event.active,
      over: event.over,
      delta: event.delta,
    });

    moveTask({
      projectId: defaultProjectId,
      taskId: taskBeingDraggedId,
      updateTaskColumnDTO: {
        targetColumnId: columnBeingDroppedIntoId,
        positionInColumn: maxPositions[columnBeingDroppedIntoId],
        // to do: fix it
        nearestNeighboursPositionInColumn: [1, 3],
      },
    });

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }

  const {
    data: columns,
    isLoading: columnsLoading,
    error: columnsError,
  } = useGetColumnsQuery(defaultProjectId, {
    skip: !useAppSelector((state) => state.user.accessToken),
  });

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useGetProjectQuery(defaultProjectId, {
    skip: !useAppSelector((state) => state.user.accessToken),
  });

  const {
    data: boardTasks,
    isLoading: boardTasksLoading,
    error: boardTasksError,
  } = useGetBoardTasksQuery(defaultProjectId, {
    skip: !useAppSelector((state) => state.user.accessToken),
  });

  if (!defaultProjectId || !columns)
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <Button className="-translate-y-15">Create your first project</Button>
      </div>
    );

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
        <h3 className="text-center mt-4 mb-4 text-primary-darker-4 text-shadow-md">
          {project?.name}
        </h3>
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
