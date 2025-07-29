"use server";

import { ref, push, update } from "firebase/database";
import { db } from "@/lib/firebaseConfig";

export async function opreateMeets(formData) {
  const id = formData.get("id");

  const agencyUse = formData.get("agencyUse");
  const amountUse = formData.get("amountUse");
  const beginTime = formData.get("beginTime");
  const contactUse = formData.get("contactUse");
  const dateUse = formData.get("dateUse");
  const forUse = formData.get("forUse");
  const nameUse = formData.get("nameUse");
  const resultText = formData.get("resultText");
  const serviceUse = formData.getAll("serviceUse"); // รับค่าหลาย checkbox
  const subjectUse = formData.get("subjectUse");
  const statusUse = formData.get("statusUse");
  const toTime = formData.get("toTime");
  const coordinator = formData.get("coordinator");

  // แปลงเวลาให้เป็น 12 ชั่วโมง เช่น 08:00 → 08:00 AM
  const formatTime12h = (time24h) => {
    if (!time24h) return "";
    const [hour, minute] = time24h.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  // แปลง date → dd-MMMM-yyyy เช่น 2025-07-29 → 29-July-2025
  const formatDateString = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const newData = {
    agencyUse,
    amountUse,
    beginTime: formatTime12h(beginTime),
    contactUse,
    dateUse: formatDateString(dateUse),
    forUse,
    nameUse,
    resultText,
    serviceUse,
    subjectUse,
    statusUse,
    toTime: formatTime12h(toTime),
    coordinator,
    date: Date.now(), // timestamp number
  };

  if (id) {
    await update(ref(db, "Request_Meeting/" + id), newData);
  } else {
    await push(ref(db, "Request_Meeting"), newData);
  }

  return { success: true };
}
