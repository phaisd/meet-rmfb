"use client";
import useConsent from "@/app/hooks/useConsent";

export default function ConsentGate({ allow, children }) {
  const { consent } = useConsent();
  return consent[allow] ? <>{children}</> : null;
}
