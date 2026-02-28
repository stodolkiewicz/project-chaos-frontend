type ProjectUser = {
  email: string;
  firstName: string | null;
  lastName: string | null;
  googlePictureLink: string | null;
  role: "ADMIN" | "MEMBER" | "VIEWER";
  projectJoidDate: string;
};

export type ProjectUsersDTO = {
  projectUsers: ProjectUser[];
};
