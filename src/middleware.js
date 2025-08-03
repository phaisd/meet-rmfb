import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const config = {
  matcher: ["/admin/:path*"], // ✅ จำกัดเฉพาะเส้นทางที่ต้องใช้ auth
};

export async function middleware(request) {
  const cookieStore = cookies(); // ❌ ห้ามใช้ await กับ cookies()
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // ✅ ให้ผ่านไปก่อน แล้วไปตรวจสอบจริงที่ server (API)
  return NextResponse.next();
}
