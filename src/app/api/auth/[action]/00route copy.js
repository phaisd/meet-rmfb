import { auth, db } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ตรวจสอบ role จาก database
    const userRef = ref(db, `adused/${user.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      throw new Error("No user data found.");
    }

    const userData = snapshot.val();
    if (userData.role !== "adminfb") {
      throw new Error("Access denied: not admin.");
    }

    return new Response(JSON.stringify({ message: "Signin success", uid: user.uid }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 401 });
  }
}
