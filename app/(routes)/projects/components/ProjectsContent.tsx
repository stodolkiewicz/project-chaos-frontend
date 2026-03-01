"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetUserProjectsQuery } from "@/app/state/ProjectsApiSlice";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { useChangeProjectForUserMutation } from "@/app/state/UsersApiSlice";
import { Trash2, LogOut, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DeleteProjectAlertDialog from "./DeleteProjectAlertDialog";

export default function ProjectsContent() {
  const userEmail = useAppSelector((state) => state.user.email);
  const { 
    data: userProjects,
    error,
    isLoading 
  } = useGetUserProjectsQuery(userEmail);

  const { data: defaultProject } = useGetDefaultProjectIdQuery();
  const defaultProjectId = defaultProject?.projectId;

  const [changeProjectForUser] = useChangeProjectForUserMutation();

  const handleProjectActivation = (projectId: string) => {
    changeProjectForUser({ newDefaultProjectId: projectId });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-primary-darker-2 text-2xl font-bold mb-8">Your Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProjects?.projects.map((project) => {
          const isActive = project.projectId === defaultProjectId;
          return (
            <div 
              key={project.projectId} 
              className={`border rounded-lg p-6 transition-all group ${
                isActive 
                  ? 'border-primary bg-primary/5 hover:shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{project.projectName}</h3>
                <div 
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 text-gray-600 hover:bg-primary hover:text-white hover:scale-105'
                  }`}
                  onClick={() => handleProjectActivation(project.projectId)}
                >
                  {isActive ? 'Active' : 'Activate'}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{project.projectDescription}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div>Role: <span className="font-medium">{project.projectRole}</span></div>
                <div>Created: {new Date(project.projectCreatedDate).toLocaleDateString()}</div>
              
                <div className="flex justify-between items-center">
                  <div>Joined: {new Date(project.projectJoinedDate).toLocaleDateString()}</div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Eye 
                          className="h-4 w-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors duration-200"
                          onClick={() => window.location.href = `/projects/${project.projectId}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View project details</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <LogOut 
                          className="h-4 w-4 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors duration-200"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Leave project</p>
                      </TooltipContent>
                    </Tooltip>
                    { project.projectRole === "ADMIN" && (
                      <DeleteProjectAlertDialog projectId={project.projectId} projectName={project.projectName} >
                        <Trash2
                          className="h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-200"
                        />
                      </DeleteProjectAlertDialog> 
                    )}
                  </div>
                </div>

              </div>
            </div>

          );
        })}
      </div>
    </div>
  );
}