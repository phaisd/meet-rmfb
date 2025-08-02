import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    // Set cookie or localStorage if needed (optional)
    return Response.json({ message: "Login success", token });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 401 });
  }
}
