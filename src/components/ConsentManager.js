"use client";
import { useState, useEffect } from "react";
import useConsent from "@/app/hooks/useConsent";
import "./styles/consent.css";

export default function ConsentManager() {
  const { consent, saveConsent } = useConsent();
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(consent);

  useEffect(() => {
    setDraft(consent);
    if (!localStorage.getItem("consent_set")) setVisible(true);
  }, [consent]);

  const handleSave = () => {
    saveConsent(draft);
    setVisible(false);
  };

  const acceptAll = () => {
    const allGranted = { necessary: true, analytics: true, marketing: true };
    saveConsent(allGranted);
    setVisible(false);
  };

  const rejectAll = () => {
    const denied = { necessary: true, analytics: false, marketing: false };
    saveConsent(denied);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={handleSave}></div>
      <div className="modal-container">
        <p>เว็บไซต์นี้ใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งานของคุณ</p>

        <div className="modal-checkboxes">
          {["analytics", "marketing"].map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={draft[key]}
                onChange={(e) =>
                  setDraft({ ...draft, [key]: e.target.checked })
                }
              />{" "}
              {key}
            </label>
          ))}
        </div>

        <div className="modal-buttons">
          <button onClick={acceptAll} className="accept-all">
            ยอมรับทั้งหมด
          </button>
          <button onClick={handleSave} className="save">
            บันทึก
          </button>
          <button onClick={rejectAll} className="reject">
            ปฏิเสธ
          </button>
        </div>
      </div>
    </>
  );
}
