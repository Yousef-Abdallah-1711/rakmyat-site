import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const locale = request.nextUrl.pathname.split("/")[1] === "ar" ? "ar" : "en";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-rakmyat-locale", locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
