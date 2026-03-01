export type AssignUserToProjectResponseDTO = {
  projectId: string;
  userId: string;
  projectRole: "ADMIN" | "MEMBER" | "VIEWER";
};