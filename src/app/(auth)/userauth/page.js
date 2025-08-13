"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import styles from "@/app/(auth)/authall.module.css";

export default function AuthUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (isSignup) {
      // Sign Up
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await set(ref(db, `adweb/${userCredential.user.uid}`), {
          email,
          role: "userfb",
          uid: userCredential.user.uid,
        });
        setMessage("✅ สมัครสมาชิกสำเร็จ (User)");
      } catch (error) {
        setMessage(error.message);
      }
    } else {
      // Sign In
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const snapshot = await get(ref(db, `adweb/${userCredential.user.uid}`));
        if (snapshot.exists() && snapshot.val().role === "userfb") {
          const token = await userCredential.user.getIdToken();
          document.cookie = `token=${token}; path=/;`;
          window.location.href = "/usersfb";
        } else {
          setMessage("คุณไม่มีสิทธิ์ใช้งาน User ครับ");
        }
      } catch (error) {
        setMessage(error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>{isSignup ? "ลงทะเบียน" : "เข้าสู่ระบบ"} ผู้ใช้บริการ</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={6}
        />
        <button type="submit">{isSignup ? "ลงทะเบียน" : "เข้าสู่ระบบ"}</button>
      </form>

      <button
        onClick={() => setIsSignup(!isSignup)}
        className={styles.toggle}
        style={{ marginTop: "1rem" }}
      >
        {isSignup
          ? "Already have an account? Sign In"
          : "Don't have an account? Sign Up"}
      </button>

      <p>{message}</p>
    </div>
  );
}
