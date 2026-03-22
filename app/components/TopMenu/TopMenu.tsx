"use client";

import UserMenu from "./UserMenu";
import { ChevronLeft, Bot } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserData } from "@/app/types/UserData";
import { useRouter } from "next/navigation";
import AIChatSheet from "@/app/features/ai/AIChatSheet";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { setAIChatOpen } from "@/app/state/uiSlice";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import ShowHideSections from "./ShowHideSections";

export default function TopMenu({ userData }: { userData: UserData }) {
  const router = useRouter();
  const path = usePathname();
  const dispatch = useAppDispatch();
  const isAIChatOpen = useAppSelector((state) => state.ui.isAIChatOpen);

  // do not show AI icon if there user does not have any project created yet
  const { data } = useGetDefaultProjectIdQuery();
  const defaultProjectId = data?.projectId;

  return (
    <div className="bg-primary opacity-96 fixed top-0 left-0 w-screen h-[2.8rem] flex items-center px-4 border-b-1 z-50 relative">
      {path !== "/dashboard" && (
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/10 active:scale-95"
          title="Go back to dashboard"
        >
          <ChevronLeft 
            className="h-5 w-5 text-white/80 group-hover:text-white group-hover:-translate-x-0.5 transition-all stroke-[2.5px]" 
          />
        </button>
      )}
      
      {/* Absolute centered ShowHideSections */}
      {defaultProjectId && path == "/dashboard" && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ShowHideSections />
        </div>
      )}
      
      <div className="flex-1" />
      <div className="flex justify-end items-center gap-3 mr-10">
        {defaultProjectId && (
            <button 
              onClick={() => dispatch(setAIChatOpen(true))}
              title="AI Assistant"
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer hover:scale-105"
            >
              <Bot className="h-5 w-5" />
            </button>
        )}

        {userData ? (
          <UserMenu email={userData.email} pictureUrl={userData.pictureUrl} />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            ?
          </div>
        )}
      </div>

      <AIChatSheet 
        open={isAIChatOpen}
        onOpenChange={(open) => dispatch(setAIChatOpen(open))}
      />
    </div>
  );
}
