"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  email?: string;
  pictureUrl?: string;
}

export default function UserAvatar({ email, pictureUrl }: UserAvatarProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={pictureUrl} alt={email} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
