import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function GET() {
  const cookieStore = cookies(); // ✅ ใช้แบบนี้ (ไม่ต้อง await จริง ๆ ถ้าใช้ใน server component/api)
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ ok: false, error: "No token" }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return NextResponse.json({ ok: true, uid: decoded.uid });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }
}
