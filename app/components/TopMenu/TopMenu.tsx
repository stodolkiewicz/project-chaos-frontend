import Link from "next/link";
import UserMenu from "./UserMenu";
import { useAppSelector } from "@/app/hooks";
import { ArrowBigLeft, ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { HiArrowNarrowLeft } from "react-icons/hi";

export default function TopMenu() {
  const userData = useAppSelector((state) => state.user);
  const path = usePathname();

  return (
    <div className="bg-primary opacity-96 fixed top-0 left-0 w-screen h-[2.8rem] flex items-center px-4 border-b-1">
      {path !== "/dashboard" && (
        <Link 
          href="/dashboard" 
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/10 active:scale-95"
          title="Go back to dashboard"
        >
          <ChevronLeft 
            className="h-5 w-5 text-white/80 group-hover:text-white group-hover:-translate-x-0.5 transition-all stroke-[2.5px]" 
          /> 
          <span className="text-white/90 group-hover:text-white font-medium text-sm uppercase tracking-wider">
            Dashboard
          </span>
        </Link>
      )}
      <div className="flex-1" />
      <div className="flex justify-end items-center gap-2 mr-10">
        {userData ? (
          <UserMenu email={userData.email} pictureUrl={userData.pictureUrl} />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            ?
          </div>
        )}
      </div>
    </div>
  );
}
