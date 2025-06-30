import type { JwtPayload } from "jwt-decode";

export interface UserCookieData {
  firstName?: string;
  email: string;
  pictureUrl?: string;
  accessToken: string;
  refreshToken?: string;
}

export interface UserData extends UserCookieData {
  defaultProjectId?: string;
}

export interface UserAuthPayload extends JwtPayload, UserCookieData {}
