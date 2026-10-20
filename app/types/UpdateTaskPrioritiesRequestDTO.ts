export type UpdateTaskPriorityRequestDTO = {
  // A missing id means a new priority
  id?: string;
  name: string;
  priorityValue: number;
  color: string;
};

// Existing priorities missing from the list are deleted, and their tasks lose the priority
export type UpdateTaskPrioritiesRequestDTO = {
  priorities: UpdateTaskPriorityRequestDTO[];
};
