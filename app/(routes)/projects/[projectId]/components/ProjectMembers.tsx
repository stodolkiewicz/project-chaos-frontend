"use client";

import Image from "next/image";
import { useState } from "react";

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  googlePictureLink?: string;
  role: string;
  projectJoinDate?: string;
}

interface ProjectMembersProps {
  projectUsers?: {
    projectUsers: User[];
  };
}

export default function ProjectMembers({ projectUsers }: ProjectMembersProps) {
  const memberCount = projectUsers?.projectUsers?.length || 0;
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-primary px-6 py-2">
        <div className="flex items-baseline gap-3">
          <h2 className="text-base font-semibold text-primary-foreground">Team Members</h2>
          <span className="text-sm text-primary-foreground opacity-80 font-bold">
            ({memberCount})
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {memberCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projectUsers?.projectUsers?.map((user) => (
              <UserCard key={user.email} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">👥</span>
            </div>
            <p className="text-gray-500 font-medium">No team members yet</p>
            <p className="text-gray-400 text-sm mt-1">Members will appear here when added to the project</p>
          </div>
        )}
      </div>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  const [imageError, setImageError] = useState(false);
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const initials = user.firstName 
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    : user.email.charAt(0).toUpperCase();

  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-primary-lighter-2 text-primary-darker-2 border-primary-lighter-1';
      case 'viewer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'member':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString();
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          {user.googlePictureLink && !imageError ? (
            <Image 
              src={user.googlePictureLink} 
              alt={fullName || user.email}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-gray-100"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center ring-2 ring-gray-100">
              <span className="text-white text-lg font-semibold">
                {initials}
              </span>
            </div>
          )}
          {/* TODO: Online status indicator - implement WebSocket/heartbeat user tracking first */}
          {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div> */}
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              {fullName ? (
                <>
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {fullName}
                  </h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </>
              ) : (
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                  {user.email}
                </h3>
              )}
            </div>
            
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeStyle(user.role)}`}>
              {user.role}
            </span>
          </div>
          
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
            <span>Joined {formatJoinDate(user.projectJoinDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}