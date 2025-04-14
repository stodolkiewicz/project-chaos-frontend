"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserAvatarProps {
  email?: string;
  pictureUrl?: string;
}

export default function UserAvatar({ email, pictureUrl }: UserAvatarProps) {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: implement logout
    console.log("logout");
  };

  console.log("UserAvatar props:", { email, pictureUrl });

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{email}</span>
      <Avatar>
        <AvatarImage src={pictureUrl} alt={email} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      {/* todo - move it to some menu, which is open on click on Avatar */}
      <Button variant="ghost" size="icon" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
