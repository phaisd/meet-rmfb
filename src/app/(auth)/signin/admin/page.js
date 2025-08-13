// src/app/(auth)/signin/admin/page.js
"use client";
import { auth, db } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useState } from "react";


export default function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const snapshot = await get(ref(db, `adused/${userCredential.user.uid}`));
      if (snapshot.exists() && snapshot.val().role === "adminfb") {
        document.cookie = `token=${await userCredential.user.getIdToken()}; path=/`;
        window.location.href = "/admin";
      } else {
        setMessage("❌ ไม่ใช่ Admin");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div >
      <h1>เข้าสู่ระบบ Admin</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign In</button>
      <p>{message}</p>
    </div>
  );
}
