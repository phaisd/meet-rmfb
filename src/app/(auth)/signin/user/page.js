'use client'
import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { get, ref } from "firebase/database";

export default function UserSignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignIn = async (e) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const snapshot = await get(ref(db, `adused/${userCredential.user.uid}`));
      if (snapshot.exists() && snapshot.val().role === "userfb") {
        document.cookie = `token=${await userCredential.user.getIdToken()}; path=/;`;
        window.location.href = "/usersfb";
      } else {
        setMessage("You do not have user privileges.");
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div>
      <h1>เข้าสู่ระบบ User</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign In</button>
      <p>{message}</p>

    </div>
  )
}