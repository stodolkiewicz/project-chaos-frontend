"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetColumnsQuery } from "@/app/state/ColumnsApiSlice";
import { Button } from "@/components/ui/button";
import { useGetBoardTasksQuery } from "@/app/state/TasksApiSlice";
import { useGetProjectQuery } from "@/app/state/ProjectsApiSlice";
import Column from "./Column";

export default function DashboardContent() {
  const defaultProjectId = useAppSelector(
    (state) => state.user.defaultProjectId
  );

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
    <div>
      {/* PROJECT NAME */}
      <h2 className="text-center mt-4 mb-4">{project?.name}</h2>
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
  );
}
