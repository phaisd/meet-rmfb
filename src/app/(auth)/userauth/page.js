"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import styles from "@/app/(auth)/authall.module.css";
import socialStyles from "@/app/(auth)/socialButtons.module.css";
import Image from "next/image"; // ✅ ไฟล์ CSS ใหม่

export default function AuthUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  // Email / Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (isSignup) {
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

  // Provider Login
  const handleProviderLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const snapshot = await get(ref(db, `adweb/${user.uid}`));
      if (!snapshot.exists()) {
        await set(ref(db, `adweb/${user.uid}`), {
          email: user.email,
          role: "userfb",
          uid: user.uid,
        });
      }

      const token = await user.getIdToken();
      document.cookie = `token=${token}; path=/;`;
      window.location.href = "/usersfb";
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    handleProviderLogin(googleProvider);
  };

  return (
    <div className={styles.container}>
      <h1>{isSignup ? "ลงทะเบียน" : "เข้าสู่ระบบ"} ผู้ใช้บริการ</h1>
      <h3>
        ขอใช้บริการห้องประชุมประจำคณะพุทธศาสตร์ อาคารสมเด็จพระพุฒาจารย์ โซน D
      </h3>

      {/* Email / Password Form */}
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

      {/* Toggle Signup/Login */}
      <button
        onClick={() => setIsSignup(!isSignup)}
        className={styles.toggle}
        style={{ marginTop: "1rem" }}
      >
        {isSignup
          ? "Already have an account? Sign In"
          : "Don't have an account? Sign Up"}
      </button>

      {/* Social Login Buttons */}
      <div className={socialStyles.socialContainer}>
        <button onClick={loginWithGoogle} className={socialStyles.googleBtn}>
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width="20"
            height="20"
          />
          เข้าสู่ระบบด้วย Google
        </button>
      </div>

      <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>
    </div>
  );
}
