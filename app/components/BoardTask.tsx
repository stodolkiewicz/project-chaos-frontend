"use client";

import { Separator } from "@radix-ui/react-separator";
import { BoardTaskDTO } from "../types/BoardTasksDTO";
import { Trash2 } from "lucide-react";
import { useDeleteTaskMutation } from "../state/TasksApiSlice";
import { useAppSelector } from "../hooks";

interface BoardTaskProps {
  boardTask: BoardTaskDTO;
}

export default function BoardTask({ boardTask }: BoardTaskProps) {
  const [deleteTask] = useDeleteTaskMutation();
  const projectId = useAppSelector((state) => state.user.defaultProjectId);

  return (
    <div className="group rounded-md p-2 m-2 flex flex-col border-1 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
      <div className="flex">
        <h6 className="flex-1">{boardTask.title}</h6>

        <Trash2
          onClick={() => deleteTask({ projectId, taskId: boardTask.taskId })}
          className="h-4 w-4 text-muted-foreground mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
        />
        {/* priority colorful square section */}
        <div className="flex flex-col items-end mr-2">
          <div
            className="w-2 h-1 rounded-full"
            style={{ backgroundColor: boardTask.priority.color }}
          ></div>
          <div className=" text-xs text-muted-foreground font-medium">
            {boardTask.priority.name}
          </div>
        </div>
      </div>
      <Separator className="bg-border h-[1.5px]" />

      <div className="mt-1">{boardTask.description}</div>

      <div className="flex mt-3">
        <div className="text-xs font-medium flex-1">assigned to:</div>{" "}
        <div className="text-xs  items-end">{boardTask.assignee.email}</div>
      </div>
    </div>
  );
}
