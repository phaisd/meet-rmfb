import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const config = {
  matcher: ["/admin/:path*"], // ✅ จำกัดเฉพาะเส้นทางที่ต้องใช้ auth
};

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}
