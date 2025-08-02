import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Signout success" });

  // 🔥 ลบ cookie
  response.cookies.set("token", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}
