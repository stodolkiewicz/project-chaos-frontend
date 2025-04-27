interface Priority {
  id: string;
  priorityValue: number;
  name: string;
  color: string;
}

interface Column {
  id: string;
  name: string;
}

interface Assignee {
  email: string;
}

interface Label {
  id: string;
  name: string;
  color: string;
}

export interface BoardTaskDTO {
  taskId: string;
  title: string;
  description: string;
  positionInColumn: number;
  priority: Priority;
  column: Column;
  assignee: Assignee;
  labels: Label[];
}
