import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { TaskPriorityDTO } from "@/app/types/TaskPriorityDTO";
import { UpdateTaskDTO } from "@/app/types/UpdateTaskDTO";

// Builds the task as the backend will return it after the update, so the cache can be patched before the refetch
export function buildUpdatedTask(
  boardTask: BoardTaskDTO,
  updateTaskDTO: UpdateTaskDTO,
  taskPriorities: TaskPriorityDTO[] | undefined
): BoardTaskDTO {
  const priority = taskPriorities?.find((p) => p.id === updateTaskDTO.priorityId);

  return {
    ...boardTask,
    title: updateTaskDTO.title,
    description: updateTaskDTO.description,
    // Empty fields mean "no priority" and "no assignee", as in the tasks response
    priority: priority ?? { id: "", priorityValue: 0, name: "", color: "" },
    assignee: { email: updateTaskDTO.assigneeEmail ?? "" },
    labels: updateTaskDTO.labels.map((label) => {
      // The backend stores label names trimmed and lower-cased
      const name = label.name.trim().toLowerCase();
      return {
        // New labels get their id after the refetch, so the name stands in for it
        id: boardTask.labels.find((l) => l.name === name)?.id ?? name,
        name,
        color: label.color,
      };
    }),
  };
}
