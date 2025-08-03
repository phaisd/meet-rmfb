export const runtime = "nodejs"; // Next.js API route รันบน Node.js environment

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    // ดึง cookie ชื่อ 'token' จาก request
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "No token" },
        { status: 401 }
      );
    }

    // verify token ด้วย Firebase Admin SDK
    const decoded = await adminAuth.verifyIdToken(token);

    // ตรวจสอบสิทธิ์ role 'adminfb'
    if (decoded.role !== "adminfb") {
      return NextResponse.json(
        { ok: false, error: "Permission denied" },
        { status: 403 }
      );
    }

    // ถ้าผ่านหมด ส่งกลับข้อมูล user
    return NextResponse.json({
      ok: true,
      uid: decoded.uid,
      email: decoded.email,
    });
  } catch (error) {
    console.error("Auth check error:", error); // เพิ่ม log error เพื่อดีบัก
    return NextResponse.json(
      { ok: false, error: "Invalid token" },
      { status: 401 }
    );
  }
}
