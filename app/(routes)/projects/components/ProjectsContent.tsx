"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetUserProjectsQuery } from "@/app/state/ProjectsApiSlice";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { useChangeProjectForUserMutation } from "@/app/state/UsersApiSlice";
import { Trash2, LogOut, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DeleteProjectAlertDialog from "./DeleteProjectAlertDialog";
import LeaveProjectAlertDialog from "./LeaveProjectAlertDialog";
import { useRouter } from 'next/navigation';

export default function ProjectsContent() {
  const router = useRouter();
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
              className={`border rounded-lg p-6 transition-all group flex flex-col ${
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
              <p className="text-gray-600 mb-4 line-clamp-2">{project.projectDescription}</p>
              
              <div className="space-y-2 text-sm text-gray-500 mt-auto">
                <div>Role: <span className="font-medium">{project.projectRole}</span></div>
                <div>Created: {new Date(project.projectCreatedDate).toLocaleDateString()}</div>
                <div className="flex justify-between items-center">
                  <div>Joined: {new Date(project.projectJoinedDate).toLocaleDateString()}</div>
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="p-2 rounded-md bg-gray-100 border border-gray-200 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 text-gray-500"
                          onClick={() => router.push(`/projects/${project.projectId}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View project details</p>
                      </TooltipContent>
                    </Tooltip>
                    <LeaveProjectAlertDialog projectId={project.projectId} projectName={project.projectName}>
                      <button className="p-2 rounded-md bg-gray-100 border border-gray-200 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-300 transition-all duration-200 text-gray-500">
                        <LogOut className="h-4 w-4" />
                      </button>
                    </LeaveProjectAlertDialog>
                    { project.projectRole === "ADMIN" && (
                      <DeleteProjectAlertDialog projectId={project.projectId} projectName={project.projectName} >
                        <button className="p-2 rounded-md bg-gray-100 border border-gray-200 hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-all duration-200 text-gray-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
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