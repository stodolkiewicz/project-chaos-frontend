"use client";

// TODO: Split into components - ProjectInfo, MembersList, UserCard
import { useGetProjectQuery, useGetProjectUsersQuery } from "@/app/state/ProjectsApiSlice";
import { useAppSelector } from "@/app/hooks";
import Image from "next/image";
import { useState } from "react";

interface ProjectDetailsContentProps {
  projectId: string;
}

function UserCard({ user }: { user: any }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar - Google picture or initials */}
        <div className="flex-shrink-0">
          {user.googlePictureLink && !imageError ? (
            <Image 
              src={user.googlePictureLink} 
              alt={`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
              width={40}
              height={40}
              className="rounded-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                {user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
              </span>
            </div>
          )}
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Name and Email */}
          <div>
            {(user.firstName || user.lastName) ? (
              <div className="font-medium text-gray-900">
                {user.firstName || ''} {user.lastName || ''}
              </div>
            ) : null}
            <div className={`text-gray-600 ${(user.firstName || user.lastName) ? 'text-base' : 'text-base font-medium'}`}>
              {user.email}
            </div>
          </div>
          
          {/* Role */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Role:</span>
            <span className="px-2 text-sm font-medium rounded-full border-2 border-green-800 text-white bg-green-800 leading-none">
              {user.role}
            </span>
          </div>
          
          {/* Joined Date */}
          <div className="text-sm text-gray-500">
            <span className="font-medium">Joined:</span> {
              user.projectJoinDate 
                ? (() => {
                    const date = new Date(user.projectJoinDate);
                    return isNaN(date.getTime()) 
                      ? 'Unknown date' 
                      : date.toLocaleDateString()
                  })()
                : 'Unknown date'
            }
          </div>
        </div>
      </div>
    </div>
  );
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
        {/* Project Info */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Project Information</h2>
          <div className="space-y-1">
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
              <UserCard key={user.email} user={user} />
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