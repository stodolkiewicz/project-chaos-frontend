export type ChangeUserRoleResponseDTO = {
  projectId: string;
  userEmail: string;
  newRole: "ADMIN" | "MEMBER" | "VIEWER";
};