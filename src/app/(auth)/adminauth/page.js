"use client";
import { auth, db } from "@/lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { useState } from "react";
import styles from "@/app/(auth)/authall.module.css";

export default function AuthAdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async () => {
    try {
      if (isSignup) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await set(ref(db, `adweb/${userCredential.user.uid}`), {
          email,
          role: "adminfb",
        });
        setMessage("✅ สร้างบัญชี Admin สำเร็จ");
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const snapshot = await get(ref(db, `adweb/${userCredential.user.uid}`));
        if (snapshot.exists() && snapshot.val().role === "adminfb") {
          document.cookie = `token=${await userCredential.user.getIdToken()}; path=/`;
          window.location.href = "/admin";
        } else {
          setMessage("❌ ไม่ใช่ Admin");
        }
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>{isSignup ? "ลงทะเบียน Admin" : "เข้าสู่ระบบ Admin"}</h1>

      <input
        type="email"
        placeholder="อีเมล"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="รหัสผ่าน"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* ปุ่มหลัก ใช้โหมดเดียวกัน */}
      <button onClick={handleAuth}>{isSignup ? "Sign Up" : "Sign In"}</button>

      {/* ปุ่มสลับโหมด */}
      <button type="button" onClick={() => setIsSignup((prev) => !prev)}>
        {isSignup
          ? "มีบัญชีแล้ว? กดเพื่อเข้าสู่ระบบ"
          : "ยังไม่มีบัญชี? กดเพื่อลงทะเบียน"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
