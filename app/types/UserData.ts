import type { JwtPayload } from "jwt-decode";

export interface UserData {
  firstName?: string;
  email: string;
  pictureUrl?: string;
  accessToken: string;
  refreshToken?: string;
}

export interface UserAuthPayload extends JwtPayload, UserData {}
