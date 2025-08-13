import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"], // ตรวจสอบเส้นทาง /admin เท่านั้น
};

export async function middleware(request) {
  // ตรวจสอบ consent cookie
  const consentCookie = request.cookies.get("consent_analytics");
  if (!consentCookie || consentCookie !== "true") {
    // หากยังไม่ได้ยินยอม analytics อาจบล็อก script หรือทำ logging
  }

  // ตรวจสอบ token / role
  const token = request.cookies.get("token")?.value; // สมมติเก็บ token ใน cookie

  if (!token) {
    // ถ้าไม่มี token ให้ redirect ไป /auth
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // สมมติ decode role จาก token (หรือดึงจาก cookie/DB)
  const role = request.cookies.get("role")?.value || "userfb"; // ค่า default เป็น userfb

  if (request.nextUrl.pathname.startsWith("/adminauth") && role !== "adminfb") {
    // ถ้าเข้าหน้า /admin แต่ไม่ใช่ adminfb → redirect
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ถ้ามี token และผ่าน role check → ผ่าน middleware
  return NextResponse.next();
}
