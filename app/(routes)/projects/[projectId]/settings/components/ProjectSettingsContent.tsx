"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetColumnPreferencesQuery, useGetColumnsQuery } from "@/app/state/ColumnsApiSlice";
import { useGetProjectQuery, useGetUserProjectsQuery } from "@/app/state/ProjectsApiSlice";
import { useGetTaskPrioritiesQuery } from "@/app/state/TaskPrioritiesApiSlice";
import { useGetBoardTasksQuery } from "@/app/state/TasksApiSlice";
import { ColumnPreferenceDTO } from "@/app/types/ColumnPreferenceDTO";
import ProjectSettingsForm from "./ProjectSettingsForm";

export default function ProjectSettingsContent({ projectId }: { projectId: string }) {
  const userEmail = useAppSelector((state) => state.user.email);
  const { data: userProjects } = useGetUserProjectsQuery(userEmail);
  const projectRole = userProjects?.projects.find((p) => p.projectId === projectId)?.projectRole;
  const isViewer = projectRole === "VIEWER";

  const { data: project, error: projectError } = useGetProjectQuery(projectId);
  const { data: columns } = useGetColumnsQuery(projectId);
  const { data: boardTasks } = useGetBoardTasksQuery(projectId);
  // The backend gives preferences only to members, so a viewer sees the defaults
  const { data: savedPreferences } = useGetColumnPreferencesQuery(projectId, {
    skip: !projectRole || isViewer,
  });

  // Only an admin edits the priorities
  const isAdmin = projectRole === "ADMIN";
  const { data: priorities } = useGetTaskPrioritiesQuery(projectId, { skip: !isAdmin });

  const preferences: ColumnPreferenceDTO[] | undefined = isViewer
    ? columns?.map((column, index) => ({
        columnId: column.id,
        sound: index === columns.length - 1 ? "RANDOM" : "NONE",
        confetti: index === columns.length - 1,
      }))
    : savedPreferences;

  if (projectError) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-500">Error loading project settings</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-primary-darker-2 mb-8">
        {project ? `${project.name} settings` : "Project settings"}
      </h1>
      {/* The form starts from the loaded data, so it renders only after all queries finish */}
      {project && columns && boardTasks && preferences && projectRole && (!isAdmin || priorities) && (
        <ProjectSettingsForm
          project={project}
          columns={columns}
          boardTasks={boardTasks}
          preferences={preferences}
          priorities={priorities ?? []}
          projectRole={projectRole}
        />
      )}
    </div>
  );
}
