"use client";
import { useState, useEffect } from "react";

const DEFAULT_CONSENT = {
  necessary: true,
  analytics: false,
};

export default function useConsent() {
  const [consent, setConsent] = useState(DEFAULT_CONSENT);

  useEffect(() => {
    const stored = localStorage.getItem("consent");
    if (stored) setConsent(JSON.parse(stored));
  }, []);

  const saveConsent = (newConsent) => {
    setConsent(newConsent);
    localStorage.setItem("consent", JSON.stringify(newConsent));
    localStorage.setItem("consent_set", "true");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "consent_update", consent: newConsent });
  };

  return { consent, setConsent, saveConsent };
}
