export const runtime = "nodejs"; // ✅ สำคัญมาก!

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ ok: false, error: "No token" }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);

    if (decoded.role !== "adminfb") {
      return NextResponse.json({ ok: false, error: "Permission denied" }, { status: 403 });
    }

    return NextResponse.json({ ok: true, uid: decoded.uid, email: decoded.email });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }
}
