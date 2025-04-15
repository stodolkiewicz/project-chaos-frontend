import UserAvatar from "./UserAvatar";
import { useSelector } from "react-redux";

export default function TopMenu() {
  const userData = useSelector((state) => state.user);

  return (
    <div className="fixed top-0 left-0 w-screen h-[48px] flex items-center px-4 border-b-1">
      <div className="flex-1" />
      <div className="flex justify-end items-center gap-2">
        {userData ? (
          <UserAvatar
            email={userData.email}
            pictureUrl={
              userData.pictureUrl ? encodeURI(userData.pictureUrl) : undefined
            }
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            ?
          </div>
        )}
      </div>
    </div>
  );
}
