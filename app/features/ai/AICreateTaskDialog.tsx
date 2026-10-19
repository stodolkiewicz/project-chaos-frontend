"use client";

import CreateTaskForm from "@/app/(routes)/dashboard/components/CreateTask/CreateTaskForm";
import { useGetColumnsQuery } from "@/app/state/ColumnsApiSlice";
import { useGetBoardTasksQuery } from "@/app/state/TasksApiSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RequestCreateTaskEvent } from "./types";

export default function AICreateTaskDialog({
  projectId,
  proposal,
  onClose,
}: {
  projectId: string;
  proposal: RequestCreateTaskEvent;
  onClose: () => void;
}) {
  const { data: columns } = useGetColumnsQuery(projectId);
  const { data: boardTasks } = useGetBoardTasksQuery(projectId);

  // The task is added at the end of the first board column
  const firstColumn = columns?.[0];
  const tasksInFirstColumn =
    boardTasks?.filter((task) => task.column.id === firstColumn?.id) ?? [];
  const maxPositionInColumn =
    tasksInFirstColumn.length > 0
      ? Math.max(...tasksInFirstColumn.map((task) => task.positionInColumn))
      : 0;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="lg:min-w-2xl">
        <DialogHeader>
          <DialogTitle>AI suggests a new task</DialogTitle>
        </DialogHeader>
        {firstColumn && boardTasks && (
          <CreateTaskForm
            positionInColumn={maxPositionInColumn + 1}
            columnId={firstColumn.id}
            onClose={onClose}
            initialTitle={proposal.title}
            initialDescription={proposal.description}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
