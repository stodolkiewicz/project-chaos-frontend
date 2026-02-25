"use client";

import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, FolderPlus, SmilePlus } from "lucide-react";
import { useState } from "react";
import CreateProjectDialog from "./CreateProject/CreateProjectDialog";
import CreateProjectForm from "./CreateProject/CreateProjectForm";
import { useGetSimpleUserProjectsQuery } from "@/app/state/ProjectsApiSlice";
import { useAppSelector } from "@/app/hooks";
import { useChangeProjectForUserMutation } from "@/app/state/UsersApiSlice";
import AddUserDialog from "./AddUser/AddUserDialog";
import AddUserForm from "./AddUser/AddUserForm";

type ProjectMenuProps = {
  projectName: string;
  currentProjectId: string;
};

export default function ProjectMenu({
  projectName,
  currentProjectId,
}: ProjectMenuProps) {
  const [menuOpened, setMenuOpened] = useState(false);
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);
  const [isAddUserToProjectDialogOpen, setIsAddUserToProjectDialogOpen] =
    useState(false);

  const userEmail = useAppSelector((state) => state.user.email);
  const {
    data: simpleUserProjects,
    isLoading,
    error,
  } = useGetSimpleUserProjectsQuery(userEmail);

  const otherProjects = simpleUserProjects?.projects.filter(
    (project) => project.projectId != currentProjectId
  );

  const [changeProjectForUser] = useChangeProjectForUserMutation();

  function handleOpenCloseMenu() {
    setMenuOpened(() => !menuOpened);
  }

  return (
    <div className="flex items-center justify-center mt-4 mb-4 text-primary-darker-4 text-shadow-md">
      <div className="flex items-center p-2  transition-all duration-200 text-primary-darker-2 hover:bg-white border-0 rounded-md">
        <span className="text-2xl font-bold mr-2">{projectName}</span>
        <DropdownMenu open={menuOpened} onOpenChange={setMenuOpened}>
          <DropdownMenuTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ChevronDown
                    onClick={handleOpenCloseMenu}
                    size={32}
                    className={`ml-1  ${
                      menuOpened ? "rotate-180" : ""
                    } w-7 h-7 p-1 text-primary hover:scale-110  transition-all duration-600 cursor-pointer`}
                  />
                </TooltipTrigger>
                <TooltipContent className="-translate-x-[1px] border-1">
                  {!menuOpened ? <p>Show project list</p> : ""}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{projectName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {otherProjects?.map((proj) => (
              <DropdownMenuItem
                key={proj.projectId}
                onClick={() =>
                  changeProjectForUser({ newDefaultProjectId: proj.projectId })
                }
              >
                {proj.projectName}
              </DropdownMenuItem>
            ))}

            {otherProjects?.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsCreateProjectDialogOpen(true);
                setMenuOpened(false);
              }}
            >
              <FolderPlus className="w-8 h-8 p-0 text-primary-darker-1  hover:border rounded-full duration-300 scale-100" />
              <span className="font-medium">Create new project </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsAddUserToProjectDialogOpen(true);
                setMenuOpened(false);
              }}
            >
              <SmilePlus className="w-8 h-8 p-0 text-primary-darker-1 hover:border rounded-full duration-300 scale-100" />
              <span className="font-medium">Add member</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* DropdownMenu messes display of this dialog. That's why it has to be outside of it. */}
        <CreateProjectDialog
          isCreateProjectDialogOpen={isCreateProjectDialogOpen}
          setIsCreateProjectDialogOpen={setIsCreateProjectDialogOpen}
        >
          {(onClose) => <CreateProjectForm onClose={onClose} />}
        </CreateProjectDialog>
        <AddUserDialog
          isAddUserToProjectDialogOpen={isAddUserToProjectDialogOpen}
          setIsAddUserToProjectDialogOpen={setIsAddUserToProjectDialogOpen}
        >
          {(onClose) => <AddUserForm onClose={onClose}></AddUserForm>}
        </AddUserDialog>
      </div>
    </div>
  );
}
