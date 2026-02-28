"use client";

import { useGetProjectQuery, useGetProjectUsersQuery } from "@/app/state/ProjectsApiSlice";
import { useAppSelector } from "@/app/hooks";

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

  console.log(projectUsers);

  if (projectLoading || usersLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

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
        {/* Project Info */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Project Information</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Project ID:</span>
              <span className="ml-2 text-gray-600 font-mono text-sm">{project.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <span className="ml-2 text-gray-600">
                {new Date(project.createdDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Description:</span>
              <span className="ml-2 text-gray-600">{project.description}</span>
            </div>
          </div>
        </div>

        {/* Project Members */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-6">
            Members ({projectUsers?.projectUsers?.length || 0})
          </h2>
          <div className="space-y-3">
            {projectUsers?.projectUsers?.map((user) => (
              <div key={user.email} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="space-y-2">
                  <div className="font-medium text-gray-900">
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Role:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.projectRole === 'ADMIN' 
                        ? 'bg-red-100 text-red-800' 
                        : user.projectRole === 'MEMBER' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.projectRole}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Joined:</span> {
                      user.joinedDate 
                        ? (() => {
                            const date = new Date(user.joinedDate);
                            return isNaN(date.getTime()) 
                              ? 'Unknown date' 
                              : date.toLocaleDateString()
                          })()
                        : 'Unknown date'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
          {(!projectUsers?.projectUsers || projectUsers.projectUsers.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No members found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}