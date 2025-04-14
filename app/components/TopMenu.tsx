import {
  extractAccesstokenInfoFromCookie,
  AccessTokenJwtPayload,
} from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function TopMenu() {
  const userData: AccessTokenJwtPayload | null =
    await extractAccesstokenInfoFromCookie();

  console.log("dupa");
  console.log(userData);

  return (
    <div className="fixed top-0 left-0 w-screen h-[48px] flex items-center px-4 border-b-1">
      <div className="flex-1" />
      <div className="flex justify-end items-center gap-2">
        {userData ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">{userData.email}</span>
            <Avatar>
              <AvatarImage src={userData.pictureUrl} />
              <AvatarFallback>{userData.email}</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <Avatar>
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
