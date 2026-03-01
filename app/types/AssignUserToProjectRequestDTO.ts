export type AssignUserToProjectRequestDTO = {
  userEmail: string;
  projectRole: "ADMIN" | "MEMBER" | "VIEWER";
};