export type AddUserRequestDTO = {
  userEmail: string;
  projectRole: "ADMIN" | "MEMBER" | "VIEWER";
};
