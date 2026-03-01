export type ChangeUserRoleResponseDTO = {
  projectId: string;
  userId: string;
  newRole: "ADMIN" | "MEMBER" | "VIEWER";
};