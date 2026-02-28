type ProjectUser = {
  email: string;
  projectRole: "ADMIN" | "MEMBER" | "VIEWER";
  joinedDate: string;
};

export type ProjectUsersDTO = {
  projectUsers: ProjectUser[];
};
