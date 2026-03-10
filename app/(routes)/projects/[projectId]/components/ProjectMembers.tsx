"use client";

import { InvitationResponseDTO } from "@/app/state/ProjectInvitationsApiSlice";
import Image from "next/image";
import { useState } from "react";
import { BsHourglassSplit } from "react-icons/bs";
import { Trash2 } from "lucide-react";
import { useGetUserProjectsQuery, useChangeUserRoleMutation } from "@/app/state/ProjectsApiSlice";
import { useAppSelector } from "@/app/hooks";
import { useErrorHandler } from "@/app/hooks/useErrorHandler";
import DeleteInvitationAlertDialog from "./DeleteInvitationAlertDialog";
import DeleteUserAlertDialog from "./DeleteUserAlertDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  googlePictureLink?: string;
  role: string;
  projectJoinDate?: string;
}

interface ProjectMembersProps {
  projectUsers?: User[];
  projectInvitations?: InvitationResponseDTO[];
  projectId: string;
}


export default function ProjectMembers({ projectUsers, projectInvitations, projectId }: ProjectMembersProps) {
  const memberCount = projectUsers?.length || 0;
  const invitationCount = projectInvitations?.length || 0;
  
  const userEmail = useAppSelector((state) => state.user.email);
  const { data: userProjects } = useGetUserProjectsQuery(userEmail);
  const currentProject = userProjects?.projects?.find(project => project.projectId === projectId);
  const isAdmin = currentProject?.projectRole === "ADMIN";
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-primary hover:bg-primary-darker-1 px-6 py-2 transition-colors cursor-pointer">
        <div className="flex items-baseline gap-3">
          <h2 className="text-base font-semibold text-primary-foreground">Team Members</h2>
          <span className="text-sm text-primary-foreground opacity-80 font-bold">
            ({memberCount}{invitationCount > 0 && ` + ${invitationCount} pending`})
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projectUsers?.map((user) => (
            <UserCard key={user.id} user={user} isAdmin={isAdmin} projectId={projectId} />
          ))}
          {projectInvitations?.map((invitation) => (
            <InvitationCard key={invitation.id} invitation={invitation} isAdmin={isAdmin} />
          ))}
        </div>
      </div>
    </div>
  );
}

function UserCard({ user, isAdmin, projectId }: { user: User; isAdmin: boolean; projectId: string }) {
  const [imageError, setImageError] = useState(false);
  const [changeUserRole] = useChangeUserRoleMutation();
  const { handleApiError } = useErrorHandler();
  
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const initials = user.firstName 
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    : user.email.charAt(0).toUpperCase();

  function handleRoleChange(newRole: string) {
    if (newRole === user.role) return;

    const userName = fullName || user.email;
    
    changeUserRole({
      projectId,
      userId: user.id,
      roleData: { projectRole: newRole as "ADMIN" | "MEMBER" | "VIEWER" },
    })
    .unwrap()
    .then(() => {
      toast.success(`Role changed to ${newRole} for "${userName}".`);
    })
    .catch((error) => {
      handleApiError(error, `Failed to change role for "${userName}".`);
    });
  }

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
            
            {isAdmin && user.role.toLowerCase() !== 'admin' ? (
              <Select value={user.role} onValueChange={handleRoleChange}>
                <SelectTrigger 
                  size="sm"
                  className={`h-6 px-2 py-1 text-xs font-medium border rounded-full ${getRoleBadgeStyle(user.role)} hover:opacity-80 transition-opacity`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="VIEWER">Viewer</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeStyle(user.role)}`}>
                {user.role}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
              <span>Joined {formatJoinDate(user.projectJoinDate)}</span>
            </div>
            
            {isAdmin && user.role.toLowerCase() !== 'admin' && (
              <DeleteUserAlertDialog user={user} projectId={projectId}>
                <Trash2 
                  className="w-4 h-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onPointerDown={(e) => e.stopPropagation()}
                />
              </DeleteUserAlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InvitationCard({ invitation, isAdmin }: { invitation: InvitationResponseDTO; isAdmin: boolean }) {
  const initials = invitation.email.charAt(0).toUpperCase();
  
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString();
  };

  return (
    <div className="group bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 rounded-xl p-4 opacity-80 relative overflow-hidden hover:opacity-90 transition-all duration-300 shadow-inner border-dashed">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
      
      <div className="flex items-center gap-4 relative z-10">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full flex items-center justify-center ring-1 ring-slate-300/50 shadow-sm">
            <span className="text-white text-lg font-semibold">
              {initials}
            </span>
          </div>
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {invitation.email}
              </h3>
              <p className="text-gray-600 text-sm">Invited by {invitation.invitedByEmail}</p>
            </div>
            
            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm opacity-70 ${getRoleBadgeStyle(invitation.role)}`}>
              {invitation.role}
            </span>
          </div>
          
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
            <span>Invited {formatDate(invitation.createdDate)}</span>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <BsHourglassSplit className="text-slate-400 w-3.5 h-3.5 hover:rotate-180 transition-transform duration-700 cursor-pointer" />
              <span className="text-xs font-medium text-gray-700 tracking-wide">INVITATION PENDING</span>
            </div>
            {isAdmin && (
              <DeleteInvitationAlertDialog invitation={invitation}>
                <Trash2 
                  className="w-4 h-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onPointerDown={(e) => e.stopPropagation()}
                />
              </DeleteInvitationAlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}