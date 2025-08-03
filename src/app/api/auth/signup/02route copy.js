// app/api/signup/route.js

import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { ref, set } from "firebase-admin/database";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // ✅ สร้าง user ใหม่ด้วย Admin SDK
    const userRecord = await adminAuth.createUser({ email, password });

    // ✅ บันทึกข้อมูลลง Firebase Realtime Database
    await set(ref(adminDb, "adused/" + userRecord.uid), {
      email,
      role: "adminfb",
    });

    // ✅ ตั้งค่า custom claims (เช่น role)
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: "adminfb" });

    return NextResponse.json({ ok: true, message: "Signup success" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Signup failed" },
      { status: 500 }
    );
  }
}
