"use client";

import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import CreateTaskForm from "../CreateTask/CreateTaskForm";

export default function EditTaskDialog({
  boardTask,
  children,
}: {
  boardTask: BoardTaskDTO;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="lg:min-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription className="sr-only">
            Title, description, assignee, priority and labels of the task.
          </DialogDescription>
        </DialogHeader>
        <CreateTaskForm
          taskToEdit={boardTask}
          positionInColumn={boardTask.positionInColumn}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
