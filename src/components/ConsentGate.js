"use client";
import { useState, useEffect } from "react";
import useConsent from "@/app/hooks/useConsent";
import "@/components/styles/consent.css";

export default function ConsentManager() {
  const { consent, saveConsent } = useConsent();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(consent);

  useEffect(() => {
    const consentSet = localStorage.getItem("consent_set");
    if (!consentSet) setOpen(true);
  }, []);

  const handleAcceptAll = () => {
    const newConsent = { ...draft, analytics: true };
    saveConsent(newConsent);
    setOpen(false);
  };

  const handleSave = () => {
    saveConsent(draft);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>การใช้คุกกี้</h2>
        <p>
          เว็บไซต์นี้ใช้คุกกี้เพื่อพัฒนาประสบการณ์ใช้งานของคุณ โปรดอ่าน{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            นโยบายความเป็นส่วนตัว
          </a>{" "}
          และ{" "}
          <a href="/cookies" target="_blank" rel="noopener noreferrer">
            นโยบายการใช้คุกกี้
          </a>
        </p>

        <div className="modal-checkboxes">
          <label>
            <input type="checkbox" checked disabled /> คุกกี้ที่จำเป็น
            (จำเป็นต้องเปิด)
          </label>
          <label>
            <input
              type="checkbox"
              checked={draft.analytics}
              onChange={(e) =>
                setDraft({ ...draft, analytics: e.target.checked })
              }
            />{" "}
            คุกกี้วิเคราะห์การใช้งาน
          </label>
        </div>

        <div className="modal-actions">
          <button onClick={handleAcceptAll} className="btn-accept">
            ยอมรับทั้งหมด
          </button>
          <button onClick={handleSave} className="btn-save">
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
}
