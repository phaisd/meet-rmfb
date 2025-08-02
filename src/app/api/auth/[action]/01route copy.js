import { auth, db } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { action } = params.action;

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    if (action === "signup") {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // บันทึกข้อมูลผู้ใช้ลงใน Realtime Database
      const userRef = ref(db, `adused/${user.uid}`);
      await set(userRef, {
        email,
        role: "adminfb",
      });

      return NextResponse.json({ message: "Signup success", uid: user.uid });

    } else if (action === "signin") {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ตรวจสอบ role จาก database
      const userRef = ref(db, `adused/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error("No user data found");
      }

      const userData = snapshot.val();
      if (userData.role !== "adminfb") {
        throw new Error("Access denied: not admin");
      }

      return NextResponse.json({ message: "Signin success", uid: user.uid });

    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
