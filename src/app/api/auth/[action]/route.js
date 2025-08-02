import { auth, db } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req, context) {
  try {
    const { params } = await context; // ✅ ต้อง await context
    const action = params;

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    if (action === "signup") {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = ref(db, `adused/${user.uid}`);
      await set(userRef, {
        email,
        role: "adminfb",
      });

      return NextResponse.json({ message: "Signup success", uid: user.uid });

    } else if (action === "signin") {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = ref(db, `adused/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error("No user data found");
      }

      const userData = snapshot.val();
      if (userData.role !== "adminfb") {
        throw new Error("Access denied: not admin");
      }

      const token = await user.getIdToken(); // ✅ สร้าง token

      const response = NextResponse.json({ message: "Signin success", uid: user.uid });

      // ✅ กำหนดอายุ cookie 1 ชั่วโมง
      response.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60, // 1 ชั่วโมง
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return response;

    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
