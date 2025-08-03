export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { setAdminRoleByEmail } from "@/lib/firebaseAdmin";

// ✅ ป้องกันด้วย secret key
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "dev-secret-key";

export async function POST(req) {
  const body = await req.json();
  const { email, secret } = body;

  console.log("SECRET KEY:", process.env.ADMIN_SECRET_KEY);

  if (secret !== ADMIN_SECRET_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await setAdminRoleByEmail(email);
    return NextResponse.json({ ok: true, message: `Set adminfb for ${email}` });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
