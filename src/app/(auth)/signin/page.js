"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useRouter } from "next/navigation";
import styles from "@/app/(auth)/authall.module.css"; // Assuming you have a CSS module for styles

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // อ่าน role จาก Realtime DB
      const snapshot = await get(ref(db, `adused/${uid}/role`));
      const role = snapshot.exists() ? snapshot.val() : null;

      if (role === "adminfb") {
        router.push("/admin");
      } else if (role === "userfb") {
        router.push("/usersfb");
      } else {
        setMessage("ไม่พบสิทธิ์การใช้งาน");
      }
    } catch (error) {
      console.error(error);
      setMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn} className={styles.form}>
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">เข้าสู่ระบบ</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
