import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";
import { cookies } from "next/headers";

export interface AccessTokenJwtPayload extends JwtPayload {
  firstName?: string;
  email?: string;
  pictureUrl?: string;
}

export async function extractAccesstokenInfoFromCookie(): Promise<AccessTokenJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<AccessTokenJwtPayload>(token);

    const decodedPayload = {
      firstName: decoded.firstName,
      email: decoded.sub,
      pictureUrl: decoded.pictureUrl,
    };

    return decodedPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
