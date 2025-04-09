import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";

// https://nextjs.org/docs/app/building-your-application/routing/middleware

// Used for securing paths, which are meant only for logged in users.
// Checks if there exists cookie "access_token" and if it is not expired.
// ok -> let the request through
// not ok -> redirect to /
export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if (!token || !isTokenValid(token)) {
    // not ok -> redirect to /
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ok -> let the request through
  return NextResponse.next();
}

// Definition of paths for which middleware will fire.
// Here - any path starting with /dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};

// helper function
function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 >= Date.now();
  } catch {
    return false;
  }
}
