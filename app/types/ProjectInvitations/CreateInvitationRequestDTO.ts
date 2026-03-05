export type CreateInvitationRequestDTO = {
  email: string;
  role: "ADMIN" | "MEMBER" | "VIEWER";
};
