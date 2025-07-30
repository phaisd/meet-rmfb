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

  // แปลงเวลา 24 ชั่วโมง เช่น 14:30 → 14:30 PM หรือ 08:00 → 08:00 AM
  const formatTime24hWithPM = (time24h) => {
    if (!time24h) return "";
    const [hour, minute] = time24h.split(":");
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? "pm" : "am";
    return `${hour.padStart(2, "0")}:${minute} ${suffix}`;
  };

  const formatDateString = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "long" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const newData = {
    agencyUse,
    amountUse,
    beginTime: formatTime24hWithPM(beginTime),
    contactUse,
    dateUse: formatDateString(dateUse),
    forUse,
    nameUse,
    resultText: "รอดำเนินการ",
    serviceUse,
    subjectUse,
    statusUse,
    toTime: formatTime24hWithPM(toTime),
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
