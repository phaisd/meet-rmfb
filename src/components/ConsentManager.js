"use client";
import { useState, useEffect } from "react";
import useConsent from "@/app/hooks/useConsent";
import "./styles/consent.css";

export default function ConsentManager() {
  const { consent, setConsent } = useConsent();

  // ถ้ายังไม่มีการตอบรับ/ปฏิเสธ
  if (consent) return null;

  const handleAcceptAll = () => {
    setConsent({ accepted: true });
  };

  const handleReject = () => {
    setConsent({ accepted: false });
  };

  return (
    <>
      <div className="modal-backdrop"></div>
      <div className="modal-container">
        <p>
          เว็บไซต์นี้ใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ
          โดยการใช้งานเว็บไซต์นี้ ถือว่าคุณยอมรับ{" "}
          <a href="/privacy" className="modal-link" target="_blank">
            นโยบายความเป็นส่วนตัว
          </a>{" "}
          และ{" "}
          <a href="/cookies" className="modal-link" target="_blank">
            นโยบายคุกกี้
          </a>
        </p>

        <div className="modal-buttons">
          <button className="accept-all" onClick={handleAcceptAll}>
            ยอมรับทั้งหมด
          </button>
          <button className="reject" onClick={handleReject}>
            ปฏิเสธ
          </button>
        </div>
      </div>
    </>
  );
}
