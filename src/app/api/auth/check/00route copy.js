// app/api/auth/check/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ ok: false, error: "No token" }, { status: 401 });
  }

  try {
    const { adminAuth } = await import("@/lib/firebaseAdmin"); // dynamic import ปลอดภัย
    const decoded = await adminAuth.verifyIdToken(token);

    if (decoded.role !== "adminfb") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ ok: true, uid: decoded.uid });
  } catch (err) {
    console.error("Verify token failed:", err);
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }
}
