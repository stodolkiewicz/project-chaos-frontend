import UserMenu from "./UserMenu";
import { useAppSelector } from "@/app/hooks";

export default function TopMenu() {
  const userData = useAppSelector((state) => state.user);

  return (
    <div className="fixed top-0 left-0 w-screen h-[48px] flex items-center px-4 border-b-1">
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
