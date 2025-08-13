'use client'
import { db } from "@/lib/firebaseConfig";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth } from "@/lib/firebaseConfig";

export default function AdminSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password);
      await set(ref(db, `adused/${userCredential.user.uid}`), {
        email, role: "adminfb",
      });
      setMessage("Admin account created successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div>
      <h1>สมัครสมาชิก Admin</h1>
      <p>Please fill out the form to create an admin account.</p>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>
      <p>{message}</p>
    </div>
  );
}