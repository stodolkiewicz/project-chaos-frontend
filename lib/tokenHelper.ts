import { UserAuthPayload } from "@/app/types/UserData";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function extractTokenInfoFromCookies(): Promise<UserAuthPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const decoded = jwtDecode<UserAuthPayload>(accessToken);

    const decodedPayload: UserAuthPayload = {
      firstName: decoded.firstName,
      email: decoded.sub,
      pictureUrl: decoded.pictureUrl,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return decodedPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
