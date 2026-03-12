/**
 * Auth0 middleware for Next.js 16.
 * Handles /auth/login, /auth/logout, /auth/callback, /auth/profile routes.
 * Also manages session rolling and cookie management on every request.
 */

import { auth0 } from "./src/lib/auth0";

export async function proxy(request: Request) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
