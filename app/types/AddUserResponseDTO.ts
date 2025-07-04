export type AddUserResponseDTO = {
  projectId: string;
  userEmail: string;
  projectRole: "ADMIN" | "MEMBER" | "VIEWER";
  message: string;
};
