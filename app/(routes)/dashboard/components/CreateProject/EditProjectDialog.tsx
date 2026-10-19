"use client";

import { useGetColumnsQuery } from "@/app/state/ColumnsApiSlice";
import { useGetProjectQuery } from "@/app/state/ProjectsApiSlice";
import { useGetBoardTasksQuery } from "@/app/state/TasksApiSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditProjectForm from "./EditProjectForm";

export default function EditProjectDialog({
  projectId,
  isOpen,
  setIsOpen,
}: {
  projectId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { data: project } = useGetProjectQuery(projectId, { skip: !isOpen });
  const { data: columns } = useGetColumnsQuery(projectId, { skip: !isOpen });
  const { data: boardTasks } = useGetBoardTasksQuery(projectId, { skip: !isOpen });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="lg:min-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription className="sr-only">
            Description, column names and column order of the project.
          </DialogDescription>
        </DialogHeader>
        {/* The form starts from the loaded data, so it renders only after all queries finish */}
        {project && columns && boardTasks && (
          <EditProjectForm
            project={project}
            columns={columns}
            boardTasks={boardTasks}
            onClose={() => setIsOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
