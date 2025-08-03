import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user info to Realtime Database
    await set(ref(db, "adused/" + user.uid), {
      email,
      role: "adminfb", // default role
    });

    return Response.json({ message: "Signup success" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
