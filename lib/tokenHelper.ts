import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";
import { cookies } from "next/headers";

export interface UserAuthPayload extends JwtPayload {
  firstName?: string;
  email?: string;
  pictureUrl?: string;
  accessToken?: string;
  refreshToken?: string;
}

export async function extractTokenInfoFromCookies(): Promise<UserAuthPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const decoded = jwtDecode<UserAuthPayload>(accessToken);

    const decodedPayload = {
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
