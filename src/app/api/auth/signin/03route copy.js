import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const idToken = await user.getIdToken(); // 🟢 สำคัญ!

    // ตรวจสอบสิทธิ์ role จาก database
    const userRef = ref(db, `adused/${user.uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    if (userData?.role !== "adminfb") {
      throw new Error("Permission denied");
    }

    // ส่ง token กลับ หรือ set เป็น cookie
    const response = NextResponse.json({ message: "Signin success" });
    response.cookies.set("token", idToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 401 });
  }
}
