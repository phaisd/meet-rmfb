import { NextResponse } from "next/server";

export const config = {
  matcher: [],
  // matcher: ["/admin/:path*"], // ตรวจสอบเส้นทาง /admin เท่านั้น
};

export async function middleware(request) {
  // ดึง token จาก cookie
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // ถ้าไม่มี token ให้ redirect ไป /auth
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // ถ้ามี token ให้ผ่าน middleware
  return NextResponse.next();
}
