"use client";

import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import UserAvatar from "./UserAvatar";
import { useAppDispatch } from "@/app/hooks";
import { clearUser } from "@/app/state/userSlice";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/app/server-actions/deleteCookie";

type UserMenuProps = {
  email: string;
  pictureUrl?: string;
};

export default function UserMenu({ email, pictureUrl }: UserMenuProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    dispatch(clearUser());
    deleteCookie("refresh_token");
    deleteCookie("access_token");
    router.push("/");
  };

  return (
    <Popover>
      <PopoverTrigger
        asChild
        className="rounded-full shadow-sm hover:shadow-lg transition-shadow duration-300"
      >
        <button type="button" className="cursor-pointer">
          <UserAvatar
            email={email}
            pictureUrl={pictureUrl ? encodeURI(pictureUrl) : undefined}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 border-2 bg-background -translate-x-2 translate-y-1.5">
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center gap-2 px-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate">{email}</span>
          </div>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
