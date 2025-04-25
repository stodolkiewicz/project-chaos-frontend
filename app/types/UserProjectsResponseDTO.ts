interface UserProject {
  projectId: string;
  projectName: string;
  projectDescription: string;
  projectCreatedDate: string; // Date string, like "2025-04-21T21:05:30.011086Z"
  projectRole: "ADMIN" | "MEMBER" | "VIEWER";
  projectJoinedDate: string;
}

export interface UserProjectsResponseDTO {
  projects: UserProject[];
  defaultProjectId: string;
}
