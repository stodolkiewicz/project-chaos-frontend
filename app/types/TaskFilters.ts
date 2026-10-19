// Selecting this value finds tasks without a priority, a label or an assignee
export const NO_VALUE = "none";

// Each list holds the selected ids; values inside one list are alternatives
export interface TaskFilters {
  priorities: string[];
  labels: string[];
  assignees: string[];
}

export const EMPTY_TASK_FILTERS: TaskFilters = {
  priorities: [],
  labels: [],
  assignees: [],
};
