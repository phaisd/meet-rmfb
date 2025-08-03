import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export const config = {
  matcher: [],
  // matcher: ["/admin/:path*"],

};

export async function middleware(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (decodedToken.role !== "adminfb") {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    return NextResponse.next();
  } catch (err) {
    console.error("Token verification failed", err);
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}
