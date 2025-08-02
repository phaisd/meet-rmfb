import { headers } from "next/headers";
import { adminAuth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  const headerList = headers();
  const cookie = headerList.get("cookie") || "";
  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

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
