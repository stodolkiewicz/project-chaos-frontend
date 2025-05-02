"use server";

import { cookies } from "next/headers";

// used to delete HttpOnly cookies.
// web browsers do not have access to them.
// Thus, HttpOnly cookies can only be deleted on the server.
export async function deleteCookie(cookieName: string): Promise<void> {
  (await cookies()).set(cookieName, "");
}
