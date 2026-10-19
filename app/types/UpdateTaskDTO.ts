export interface UpdateTaskDTO {
  title: string;
  description: string;
  // Null removes the assignee
  assigneeEmail: string | null;
  // Null removes the priority
  priorityId: string | null;
  labels: { name: string; color: string }[];
}
