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
  return (
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
  );
}

function UserCard({ user }: { user: User }) {
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