import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) return NextResponse.next();
  const locale = request.nextUrl.pathname.split("/")[1] === "en" ? "en" : "ar";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-rakmyat-locale", locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
