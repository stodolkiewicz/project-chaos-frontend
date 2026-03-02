"use client";

import { useGetProjectQuery, useGetProjectUsersQuery } from "@/app/state/ProjectsApiSlice";
import { useAppSelector } from "@/app/hooks";
import ProjectInformation from "./ProjectInformation";
import ProjectMembers from "./ProjectMembers";

interface ProjectDetailsContentProps {
  projectId: string;
}

export default function ProjectDetailsContent({ projectId }: ProjectDetailsContentProps) {
  const userEmail = useAppSelector((state) => state.user.email);
  
  const { 
    data: project, 
    isLoading: projectLoading, 
    error: projectError 
  } = useGetProjectQuery(projectId);
  
  const { 
    data: projectUsers, 
    isLoading: usersLoading, 
    error: usersError 
  } = useGetProjectUsersQuery(projectId);

  if (projectError || usersError) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-500">Error loading project details</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-gray-500">Project not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-darker-2 mb-2">{project.name}</h1>
      </div>

      <div className="space-y-8">
        <ProjectInformation project={project} />
        <ProjectMembers projectUsers={projectUsers} />
      </div>
    </div>
  );
}