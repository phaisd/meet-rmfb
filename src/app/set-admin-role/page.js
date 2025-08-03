"use client";

import { useState } from "react";

export default function SetAdminRolePage() {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("dev-secret-key"); // ปรับให้ตรงกับ .env
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/dev/set-admin-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, secret }),
    });

    const data = await res.json();
    setStatus(data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Set Admin Role</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Secret Key"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          required
        />
        <br />
        <button type="submit">Set Role</button>
      </form>
      {status && (
        <p style={{ color: status.ok ? "green" : "red" }}>
          {status.message || status.error}
        </p>
      )}
    </div>
  );
}
