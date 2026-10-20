export interface TaskPriorityDTO {
  id: string;
  priorityValue: number;
  name: string;
  color: string;
  // The number of tasks with this priority, in every stage
  taskCount: number;
}
