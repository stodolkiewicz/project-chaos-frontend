"use client";

import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type ProjectMenuProps = {
  projectName: string;
};

export default function ProjectMenu({ projectName }: ProjectMenuProps) {
  const [menuOpened, setMenuOpened] = useState(false);

  function handleOpenCloseMenu() {
    setMenuOpened(() => !menuOpened);
  }

  return (
    <div className="flex items-center justify-center mt-4 mb-4 text-primary-darker-4 text-shadow-md">
      <div className="flex items-center p-2  transition-all duration-200 text-primary-darker-2 hover:bg-white border-0 rounded-md">
        <span className="text-2xl font-bold mr-2">{projectName}</span>
        <DropdownMenu open={menuOpened} onOpenChange={setMenuOpened}>
          <DropdownMenuTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ChevronDown
                    onClick={handleOpenCloseMenu}
                    size={32}
                    className={`ml-1  ${
                      menuOpened ? "rotate-180" : ""
                    } w-7 h-7 p-1 text-primary hover:scale-110  transition-all duration-600 cursor-pointer`}
                  />
                </TooltipTrigger>
                <TooltipContent className="-translate-x-[1px] border-1">
                  {!menuOpened ? <p>Show project list</p> : ""}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
