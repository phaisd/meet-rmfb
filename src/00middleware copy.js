import { NextResponse } from "next/server";

export const config = {
  matcher: ["/meets/:path*", "/api/:path*", "/useMeets/:path*", "/tableMeets/:path*"],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/meets") && request.method === "DELETE") {
    const isAdminfb = request.headers.get("x-adminfb") === "true";
    if (!isAdminfb) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}
