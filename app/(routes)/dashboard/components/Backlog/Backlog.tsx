"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { useGetBacklogTasksQuery } from "@/app/state/TasksApiSlice";
import { useGetProjectQuery } from "@/app/state/ProjectsApiSlice";
import Task from "../Task/Task";
import { TaskStage } from "@/app/types/TaskStage";
import CreateFirstProjectDialog from "../CreateProject/CreateFirstProjectDialog";
import CreateProjectForm from "../CreateProject/CreateProjectForm";

export default function Backlog() {
  const { data } = useGetDefaultProjectIdQuery();
  const defaultProjectId = data?.projectId;

  const isAIChatOpen = useAppSelector((state) => state.ui.isAIChatOpen);

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useGetProjectQuery(defaultProjectId, {
    skip:
      !useAppSelector((state) => state.user.accessToken) || !defaultProjectId,
  });

  const {
    data: backlogTasks,
    isLoading: backlogTasksLoading,
    error: backlogTasksError,
  } = useGetBacklogTasksQuery(defaultProjectId, {
    skip:
      !useAppSelector((state) => state.user.accessToken) || !defaultProjectId,
  });

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

  if (backlogTasksError) {
    return (
      <div>
        Error:{" "}
        {"message" in backlogTasksError
          ? backlogTasksError.message
          : "Unknown error"}
      </div>
    );
  }

  if (backlogTasksLoading) {
    return <div>Loading backlog...</div>;
  }

  return (
    <div className={`transition-all duration-300`}>
      {/* BACKLOG HEADER */}
      <div className="flex items-center justify-center mt-4 mb-4 text-primary-darker-4 text-shadow-md">
        <span className="text-2xl font-bold text-primary-darker-2">Backlog</span>
      </div>

      {/* BACKLOG CARD */}
      <div className={`${isAIChatOpen ? 'w-[97%]' : 'w-[85%]'} mx-auto transition-all duration-300`}>
        <div className="flex flex-col box-border border-2 shadow-sm bg-panel-muted mb-12" style={{ borderRadius: '12px', padding: '12px' }}>
          {/* BACKLOG TASKS */}
          <div>
            {backlogTasks && backlogTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {backlogTasks.map((task) => (
                  <Task key={task.taskId} boardTask={task} stage={TaskStage.BACKLOG} disableDrag={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No tasks in backlog</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}