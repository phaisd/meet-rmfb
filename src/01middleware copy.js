import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, cert, getApps } from "firebase-admin/app";

// ✅ ป้องกันโหลดซ้ำ
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "YOUR_PROJECT_ID",
      clientEmail: "YOUR_CLIENT_EMAIL",
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  });
}

export const config = {
  matcher: ["/admin/:path*", "/meets/:path*", "/useMeets/:path*", "/api/meets/:path*"],
};

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    // ✅ ตรวจสอบ token กับ Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token);

    // ✅ ตรวจ role จาก custom claims หรือจาก database
    if (decodedToken?.role !== "adminfb") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.next();
  } catch (error) {
    console.error("middleware error:", error.message);
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}
