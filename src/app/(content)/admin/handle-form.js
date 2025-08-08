"use server";

import { ref, push, update } from "firebase/database";
import { db } from "@/lib/firebaseConfig";

// ✅ ฟังก์ชันแปลงเวลา 24h เป็น 12h + am/pm
const formatTime24hWithPM = (time24h) => {
  if (!time24h) return "";
  const [hour, minute] = time24h.split(":");
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? "pm" : "am";
  const displayHour = (h % 12 || 12).toString().padStart(2, "0");
  return `${displayHour}:${minute} ${suffix}`;
};

// ✅ แปลงวันที่ yyyy-MM-dd → dd-MMMM-yyyy
const formatDateString = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// ✅ คืนค่าวันที่วันนี้ ในรูปแบบ dd-MMMM-yyyy
const getTodayFormatted = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

export async function opreateMeets(formData) {
  if (!formData || typeof formData.get !== "function") {
    throw new Error("Invalid form data");
  }

  const id = formData.get("id");

  const agencyUse = formData.get("agencyUse") || "";
  const amountUse = formData.get("amountUse") || "";
  const beginTime = formData.get("beginTime") || "";
  const contactUse = formData.get("contactUse") || "";
  const dateUse = formData.get("dateUse") || "";
  const forUse = formData.get("forUse") || "";
  const nameUse = formData.get("nameUse") || "";
  const resultText = formData.get("resultText") || "";
  const serviceUse = formData.getAll("serviceUse") || [];
  const subjectUse = formData.get("subjectUse") || "";
  const statusUse = formData.get("statusUse") || "";
  const toTime = formData.get("toTime") || "";
  const coordinator = formData.get("coordinator") || "";
  const operation = formData.get("operation") || "";
  const resultOperation = formData.get("resultOperation") || "";
  const dateChange = formData.get("dateChange") || "";
  const approvedDate = formData.get("approvedDate") || ""; // âœ… à¸£à¸±à¸šà¸ˆà¸²à¸à¸Ÿà¸­à¸£à¹Œà¸¡à¹‚à¸”à¸¢à¸•à¸£à¸‡

  const data = {
    agencyUse,
    amountUse,
    beginTime,
    toTime,
    contactUse,
    forUse,
    nameUse,
    serviceUse,
    subjectUse,
    statusUse,
    coordinator,
    operation,
    resultText,
    resultOperation,
    dateChange,
    approvedDate,
    dateUse: formatDateString(dateUse),
    beginTimeDisplay: formatTime24hWithPM(beginTime),
    toTimeDisplay: formatTime24hWithPM(toTime),
    dateUseDisplay: formatDateString(dateUse),
    date: Date.now(), // timestamp
  };

  try {
    if (id) {
      // 🟢 เพิ่มวันที่วันนี้ตอนอัปเดต
      // data.approvedDate = getTodayFormatted();

      const updates = {};
      updates[`Request_Meeting/${id}`] = data;
      await update(ref(db), updates);
    } else {
      // 🟡 เพิ่มใหม่
      data.resultText = "รอดำเนินการ";
      // data.approvedDate = ""; // หรือใส่ getTodayFormatted() ถ้าต้องการ
      const newRef = ref(db, "Request_Meeting");
      await push(newRef, data);
    }
  } catch (err) {
    console.error("เกิดข้อผิดพลาดขณะบันทึกข้อมูล:", err);
    throw err;
  }
}
