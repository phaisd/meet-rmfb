// src/app/(auth)/signup/user/page.js
"use client";
import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useState } from "react";

export default function UserSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await set(ref(db, `adused/${userCredential.user.uid}`), {
        email,
        role: "userfb",
      });
      setMessage("✅ สมัครสมาชิกสำเร็จ (User)");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>สมัครสมาชิก User</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>
      <p>{message}</p>
    </div>
  );
}
