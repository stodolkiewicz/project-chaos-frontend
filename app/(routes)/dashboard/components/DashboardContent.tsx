"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetColumnsQuery } from "@/app/state/ColumnsApiSlice";
import {
  useGetBoardTasksQuery,
  useMoveTaskMutation,
} from "@/app/state/TasksApiSlice";
import { useGetProjectQuery } from "@/app/state/ProjectsApiSlice";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { DndContext } from "@dnd-kit/core";
import CreateFirstProjectDialog from "./CreateProject/CreateFirstProjectDialog";
import CreateProjectForm from "./CreateProject/CreateProjectForm";
import ProjectMenu from "./ProjectMenu";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { useErrorHandler } from "@/app/hooks/useErrorHandler";
import { celebrate, isLastColumn, playRandomCelebratoryAudio } from "@/lib/celebrate";
import Backlog from "./Backlog/Backlog";
import Archived from "./Archived/Archived";
import KanbanBoard from "./KanbanBoard";

export default function DashboardContent() {
  const { data } = useGetDefaultProjectIdQuery();
  const defaultProjectId = data?.projectId;

  const [moveTask] = useMoveTaskMutation();
  const isAIChatOpen = useAppSelector((state) => state.ui.isAIChatOpen);
  
  const isBacklogOpen = useAppSelector((state) => state.ui.isBacklogOpen);
  const isBoardOpen = useAppSelector((state) => state.ui.isBoardOpen);
  const isArchiveOpen = useAppSelector((state) => state.ui.isArchiveOpen);

  const { handleApiError } = useErrorHandler();

  async function handleDragEnd(event) {
    const { over } = event;
    const taskBeingDraggedId = event.active.id;
    const columnBeingDroppedIntoId = event.over.id;

    const sourceColumnId = boardTasks?.find(
      (task) => task.taskId === taskBeingDraggedId
    )?.column.id;
    const taskRectAtDrop = event.active.rect.current.translated;

    // Oblicz maxPosition bezpośrednio z aktualnych danych
    const tasksInTargetColumn = groupedTasks[columnBeingDroppedIntoId] || [];
    const maxPositionInTargetColumn =
      tasksInTargetColumn.length > 0
        ? Math.max(...tasksInTargetColumn.map((task) => task.positionInColumn))
        : 0;

    try {
      await moveTask({
        projectId: defaultProjectId,
        taskId: taskBeingDraggedId,
        updateTaskColumnDTO: {
          targetColumnId: columnBeingDroppedIntoId,
          positionInColumn: maxPositionInTargetColumn + 1,
          nearestNeighboursPositionInColumn: [1, 3],
        },
      }).unwrap();

      if (
        sourceColumnId &&
        sourceColumnId !== columnBeingDroppedIntoId &&
        isLastColumn(columnBeingDroppedIntoId, columns)
      ) {
        const origin = taskRectAtDrop
          ? {
              x:
                (taskRectAtDrop.left + taskRectAtDrop.width / 2) /
                window.innerWidth,
              y:
                (taskRectAtDrop.top + taskRectAtDrop.height / 2) /
                window.innerHeight,
            }
          : undefined;

        celebrate(origin);
        playRandomCelebratoryAudio();
      }
    } catch (err) {
      handleApiError(err);
    }
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
      <div className={`transition-all duration-300 ${isAIChatOpen ? 'mr-[480px]' : ''}`}>
        <ProjectMenu projectName={project?.name} currentProjectId={project?.id} />
        
        <KanbanBoard columns={columns} groupedTasks={groupedTasks} />
        
        {/* BACKLOG SECTION */}
        {isBacklogOpen && (
          <div className="mt-12">
            <Backlog />
          </div>
        )}
        
        {/* DONE SECTION */}
        {isArchiveOpen && (
          <div className="mt-12 mbe-28">
            <Archived />
          </div>
        )}
      </div>
    </DndContext>
        
  );
}
