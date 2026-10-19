"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { useGetArchivedTasksQuery } from "@/app/state/TasksApiSlice";
import { useGetProjectQuery } from "@/app/state/ProjectsApiSlice";
import Task from "../Task/Task";
import { TaskStage } from "@/app/types/TaskStage";
import CreateFirstProjectDialog from "../CreateProject/CreateFirstProjectDialog";
import CreateProjectForm from "../CreateProject/CreateProjectForm";
import CreateTaskDialog from "../CreateTask/CreateTaskDialog";
import CreateTaskForm from "../CreateTask/CreateTaskForm";
import {
  TasksPaginationFooter,
  TASKS_PAGE_SIZE_OPTIONS,
} from "@/app/components/pagination/TasksPaginationFooter";
import { useEffect, useState } from "react";
import TaskFiltersBar from "../TaskFilters/TaskFiltersBar";
import { EMPTY_TASK_FILTERS, TaskFilters } from "@/app/types/TaskFilters";

export default function Archived() {
  const { data } = useGetDefaultProjectIdQuery();
  const defaultProjectId = data?.projectId;

  const isAIChatOpen = useAppSelector((state) => state.ui.isAIChatOpen);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(TASKS_PAGE_SIZE_OPTIONS[0]);
  const [filters, setFilters] = useState<TaskFilters>(EMPTY_TASK_FILTERS);

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useGetProjectQuery(defaultProjectId, {
    skip:
      !useAppSelector((state) => state.user.accessToken) || !defaultProjectId,
  });

  const {
    data: archivedTasks,
    isLoading: archivedTasksLoading,
    error: archivedTasksError,
  } = useGetArchivedTasksQuery({ projectId: defaultProjectId ?? "", page: currentPage, size: pageSize, filters }, {
    skip:
      !useAppSelector((state) => state.user.accessToken) || !defaultProjectId,
  });

  const totalPages = archivedTasks?.totalPages ?? 0;

  // Deleting or moving the last task of the last page leaves the current page empty
  useEffect(() => {
    if (currentPage > 0 && currentPage >= totalPages) {
      setCurrentPage(Math.max(totalPages - 1, 0));
    }
  }, [currentPage, totalPages]);

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  if (!defaultProjectId) {
    return (
      <CreateFirstProjectDialog>
        {(onClose) => <CreateProjectForm onClose={onClose}></CreateProjectForm>}
      </CreateFirstProjectDialog>
    );
  }

  if (projectError) {
    return (
      <div>
        Error:{" "}
        {"message" in projectError ? projectError.message : "Unknown error"}
      </div>
    );
  }

  if (archivedTasksError) {
    return (
      <div>
        Error:{" "}
        {"message" in archivedTasksError
          ? archivedTasksError.message
          : "Unknown error"}
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300`}>
      {/* ARCHIVED HEADER */}
      <div className="flex items-center justify-center mt-4 mb-4">
        <span className="text-2xl font-bold text-[#1e293b] dark:text-primary-darker-2">Archived</span>
      </div>

      {/* ARCHIVED CARD */}
      <div className={`${isAIChatOpen ? 'w-[97%]' : 'w-[85%]'} mx-auto transition-all duration-300`}>
        <div className="flex flex-col box-border border-2 dark:shadow-sm bg-panel-muted mb-12" style={{ borderRadius: '12px', padding: '12px' }}>
          {/* ARCHIVED TASKS */}
          <TaskFiltersBar filters={filters} onChange={handleFiltersChange} />
          <div>
            {(!archivedTasks || archivedTasks.content.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">
                  {filters.priorities.length > 0 || filters.labels.length > 0 || filters.assignees.length > 0
                    ? "No tasks match the filters"
                    : "No completed tasks"}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {archivedTasks?.content.map((task) => (
                <Task key={task.taskId} boardTask={task} stage={TaskStage.ARCHIVED} disableDrag={true} />
              ))}
              {/* New tasks land on the first page, so the "+" is shown only there.
                  Ending at the last grid line puts it in the rightmost free cell of the last row */}
              {currentPage === 0 && (
                <div className="[grid-column-end:-1] self-end justify-self-end m-2">
                  <CreateTaskDialog>
                {(onClose) => (
                  <CreateTaskForm
                    positionInColumn={0}
                    stage={TaskStage.ARCHIVED}
                    onClose={onClose}
                  />
                )}
              </CreateTaskDialog>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3">
            <TasksPaginationFooter
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              totalElements={archivedTasks?.totalElements ?? 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}