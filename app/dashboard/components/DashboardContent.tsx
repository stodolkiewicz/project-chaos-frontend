"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetColumnsQuery } from "@/app/state/ColumnsApiSlice";
import {
  useGetBoardTasksQuery,
  useMoveTaskMutation,
} from "@/app/state/TasksApiSlice";
import { useGetProjectQuery } from "@/app/state/ProjectsApiSlice";
import Column from "./Column";
import { DndContext } from "@dnd-kit/core";
import CreateFirstProjectDialog from "./CreateProject/CreateFirstProjectDialog";
import CreateProjectForm from "./CreateProject/CreateProjectForm";
import ProjectMenu from "./ProjectMenu";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";

export default function DashboardContent() {
  const defaultProjectId = useAppSelector(
    (state) => state.user.defaultProjectId
  );

  const [moveTask, { isLoading, isSuccess, isError, error }] =
    useMoveTaskMutation();

  function handleDragEnd(event) {
    const { over } = event;
    const taskBeingDraggedId = event.active.id;
    const columnBeingDroppedIntoId = event.over.id;

    // Oblicz maxPosition bezpośrednio z aktualnych danych
    const tasksInTargetColumn = groupedTasks[columnBeingDroppedIntoId] || [];
    const maxPositionInTargetColumn =
      tasksInTargetColumn.length > 0
        ? Math.max(...tasksInTargetColumn.map((task) => task.positionInColumn))
        : 0;

    console.log("maxPositionInTargetColumn");
    console.log(maxPositionInTargetColumn);
    console.log(event.active.data);

    moveTask({
      projectId: defaultProjectId,
      taskId: taskBeingDraggedId,
      updateTaskColumnDTO: {
        targetColumnId: columnBeingDroppedIntoId,
        positionInColumn: maxPositionInTargetColumn + 1,
        nearestNeighboursPositionInColumn: [1, 3],
      },
    });
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
      <CreateFirstProjectDialog>
        {(onClose) => <CreateProjectForm onClose={onClose}></CreateProjectForm>}
      </CreateFirstProjectDialog>
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

  const groupedTasks: Record<string, BoardTaskDTO[]> = columns?.reduce(
    (acc, column) => {
      // get all boardTasks which belong to a given column
      const tasksInColumn =
        boardTasks?.filter((task) => task.column.id === column.id) || [];
      // sort all boardTasks based on positionInColumn, then add them to the map. key = column.id, value - BoardTaskDTO[]
      acc[column.id] = tasksInColumn.sort(
        (a, b) => a.positionInColumn - b.positionInColumn
      );
      return acc;
    },
    {} as Record<string, BoardTaskDTO[]>
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <ProjectMenu projectName={project.name} currentProjectId={project.id} />
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
                />
              );
            })}
          </div>
        )}
      </div>
    </DndContext>
  );
}
