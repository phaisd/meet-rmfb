"use client";
import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { useRouter } from "next/navigation";
import { opreateMeets } from "./handle-form";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";

import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

pdfMake.vfs = pdfFonts.vfs;

// ✅ ฟังก์ชันแปลง "08:30 am" → "08:30"
function revertTimeFormat(timeStr) {
  if (!timeStr) return "";
  const [time] = timeStr.split(" ");
  return time;
}

function formatDateToThai(dateStr) {
  if (!dateStr) return "";
  const monthsThai = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];

  const [year, month, day] = dateStr.split("-");
  const thaiYear = parseInt(year) + 543;
  const thaiMonth = monthsThai[parseInt(month) - 1];

  return `${parseInt(day)} ${thaiMonth} ${thaiYear}`;
}

// ✅ ฟังก์ชันแปลง "27-July-2025" → "2025-07-27"
function revertDateFormat(dateStr) {
  if (!dateStr) return "";
  const [day, monthText, year] = dateStr.split("-");
  const months = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };
  const month = months[monthText];
  return `${year}-${month}-${day.padStart(2, "0")}`;
}

export default function AdminMeetsPage() {
  const [meetsList, setMeetsList] = useState([]);
  const [form, setForm] = useState({
    id: "",
    agencyUse: "",
    amountUse: "",
    beginTime: "",
    contactUse: "",
    dateUse: "",
    forUse: "",
    nameUse: "",
    resultText: "",
    serviceUse: [],
    subjectUse: "",
    statusUse: "",
    toTime: "",
    coordinator: "",
    approvedDate: "",
    operation: "",
    resultOperation: "",
    dateChange: "",
  });

  //router
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/check");
      if (!res.ok) {
        router.push("/auth"); // redirect ถ้าไม่ใช่ admin
      }
    }
    checkAuth();
  }, []);


  useEffect(() => {
    fetch("/api/meets")
      .then((res) => res.json())
      .then(setMeetsList);
  }, []);

  // ✅ จัดการ checkbox
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prevForm) => {
      const newServiceUse = checked
        ? [...prevForm.serviceUse, value]
        : prevForm.serviceUse.filter((item) => item !== value);
      return { ...prevForm, serviceUse: newServiceUse };
    });
  };

  // ✅ จัดการ input ทั่วไป
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // ✅ เมื่อกด Edit → เติมข้อมูลเข้า form
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      agencyUse: item.agencyUse || "",
      amountUse: item.amountUse || "",
      beginTime: revertTimeFormat(item.beginTime || ""),
      contactUse: item.contactUse || "",
      dateUse: revertDateFormat(item.dateUse || ""),
      forUse: item.forUse || "",
      nameUse: item.nameUse || "",
      resultText: item.resultText || "รอดำเนินการ",
      serviceUse: item.serviceUse || [],
      subjectUse: item.subjectUse || "",
      statusUse: item.statusUse || "",
      toTime: revertTimeFormat(item.toTime || ""),
      coordinator: item.coordinator || "",
      approvedDate: item.approvedDate || "",
      operation: item.operation || "",
      resultOperation: item.resultOperation || "",
      dateChange: item.dateChange || "",
    });
  };

  const clearForm = () => {
    setForm({
      id: "",
      agencyUse: "",
      amountUse: "",
      beginTime: "",
      contactUse: "",
      dateUse: "",
      forUse: "",
      nameUse: "",
      resultText: "",
      serviceUse: [],
      subjectUse: "",
      statusUse: "",
      toTime: "",
      coordinator: "",
      approvedDate: "",
      operation: "",
      resultOperation: "",
      dateChange: "",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ id: ${id}`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/meets/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-adminfb": "true",
        },
      });

      if (!res.ok) throw new Error("การลบไม่สำเร็จ");
      alert(`ลบ id: ${id}`);
      setMeetsList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบ:", error);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/admin/auth"); // กลับไปหน้า Login
  };
  //Pdf
  const exportToPDF = (item) => {
    const docDefinition = {
      content: [
        { text: "แบบฟอร์มจองห้องประชุม", style: "header" },
        { text: `ชื่อผู้ขอใช้: ${item.nameUse}` },
        { text: `ตำแหน่ง: ${item.statusUse}` },
        { text: `หน่วยงาน: ${item.agencyUse}` },
        { text: `วันที่ใช้: ${item.dateUse}` },
        { text: `เวลา: ${item.beginTime} - ${item.toTime}` },
        { text: `อุปกรณ์: ${Array.isArray(item.serviceUse) ? item.serviceUse.join(", ") : ""}` },
        { text: `ผลดำเนินการ: ${item.resultText}` },
      ],
      styles: {
        header: { fontSize: 18, bold: true, marginBottom: 10 },
      },
      defaultStyle: {
        font: "Roboto",
      },
      pageSize: "A4",
    };

    pdfMake.createPdf(docDefinition).download(`meet_${item.id || "data"}.pdf`);
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  //word
  const exportToWord = async (item) => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "แบบฟอร์มจองห้องประชุม", heading: "Heading1" }),
            new Paragraph(`วันที่รายงาน: ${formattedDate}`),
            new Paragraph(`ชื่อผู้ขอใช้: ${item.nameUse}`),
            new Paragraph(`ตำแหน่ง: ${item.statusUse}`),
            new Paragraph(`หน่วยงาน: ${item.agencyUse}`),
            new Paragraph(`สำหรับ: ${item.forUse}`),
            new Paragraph(`เรื่อง: ${item.subjectUse}`),
            new Paragraph(`อุปกรณ์: ${Array.isArray(item.serviceUse) ? item.serviceUse.join(", ") : ""}`),
            new Paragraph(`จำนวนผู้เข้าร่วม: ${item.amountUse}`),
            new Paragraph(`วันที่ใช้: ${formatDateToThai(item.dateChange)}`),
            new Paragraph(`เริ่มเวลา: ${item.beginTime} - ${item.toTime}`),
            new Paragraph(`ผู้ประสานงาน : ${item.coordinator}`),
            new Paragraph(`การติดต่อ : ${item.contactUse}`),
            new Paragraph(`การขอใช้ : ${item.resultText}`),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `meet_${item.id || "data"}.docx`);
  };


  return (
    <>
      <div>
        <div>แสดงข้อมูล Admin ที่นี่</div>
        <h1>
          Manage Meets{" "}
          {/* <a className={styles.signout} href="/api/auth/signout">
            Sign out
          </a> */}
          <button onClick={handleSignOut} className={styles.signout}>Sign Out</button>
        </h1>
        <form
          action={async (formData) => {
            await opreateMeets(formData);
            clearForm();
          }}
          // method="POST"
          className={styles.form}
        // encType="multipart/form-data"
        >
          <input type="hidden" name="id" value={form.id || ""} />

          <div className={styles.inlineField}>
            <label htmlFor="nameUse">ชื่อผู้ขอใช้ :</label>
            <input
              name="nameUse"
              placeholder="ชื่อผู้ขอใช้"
              value={form.nameUse}
              onChange={handleChange}
              required
            // disabled={!!form.id}  //ไม่่รู้วว่า ทำไม พออัดเดทแล้ว อินพุดที่นี้คำสั่งนี้ โดนลบหมด
            />
          </div>

          <div className={styles.inlineField}>
            <label htmlFor="statusUse">ตำแหน่ง :</label>
            <input
              name="statusUse"
              placeholder="ตำแหน่ง"
              value={form.statusUse}
              onChange={handleChange}
              required

            />
          </div>
          <div className={styles.inlineField}>
            <label htmlFor="agencyUse">หน่วยงาน :</label>
            <input
              name="agencyUse"
              placeholder="หน่วยงาน"
              value={form.agencyUse}
              onChange={handleChange}
              required
            // disabled={!!form.id}
            />
          </div>
          <div className={styles.inlineField}>
            <label htmlFor="contactUse">ติดต่อ :</label>
            <input
              name="contactUse"
              placeholder="ติดต่อ"
              value={form.contactUse}
              onChange={handleChange}
              required
            // disabled={!!form.id}
            />
          </div>
          <div className={styles.inlineField}>
            <label htmlFor="forUse">ใช้เพื่อ :</label>
            <input
              name="forUse"
              placeholder="ใช้เพื่อ"
              value={form.forUse}
              onChange={handleChange}
              required
            // disabled={!!form.id}
            />
          </div>
          <div className={styles.inlineField}>
            <label htmlFor="subjectUse">เรื่อง :</label>
            <input
              name="subjectUse"
              placeholder="เรื่อง"
              value={form.subjectUse}
              onChange={handleChange}
              required
            // disabled={!!form.id}
            />
          </div>
          <div className={styles.inlineField}>
            <label htmlFor="number">จำนวนผู้เข้าร่วม :</label>
            <input
              type="number"
              name="amountUse"
              placeholder="จำนวนผู้เข้าร่วม"
              value={form.amountUse}
              onChange={handleChange}
              required
            // disabled={!!form.id}
            />
          </div>

          {/* วันที่และเวลา */}
          <div className={styles.timeRow}>
            <label htmlFor="dateUse">
              วันที่ใช้:
              <input
                type="date"
                name="dateUse"
                value={form.dateUse}
                onChange={handleChange}
                required
              />
            </label>
            <label htmlFor="beginTime">
              เริ่มเวลา:
              <input
                id="beginTime"
                type="time"
                name="beginTime"
                value={form.beginTime}
                onChange={handleChange}
                required
              />
            </label>
            <label htmlFor="toTime">
              ถึงเวลา:
              <input
                id="toTime"
                type="time"
                name="toTime"
                value={form.toTime}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className={styles.inlineField}>
            <label htmlFor="coordinator">ผู้ประสานงาน :</label>
            <input
              name="coordinator"
              placeholder="ผู้ประสานงาน"
              value={form.coordinator}
              onChange={handleChange}
              required
            />
          </div>

          {/* Checkbox */}
          <fieldset>
            <legend>ขอบริการอุปกรณ์:</legend>
            {["All Device", "PC", "LCD", "Amplifier", "Only room"].map(
              (device) => (
                <label key={device}>
                  <input
                    type="checkbox"
                    name="serviceUse"
                    value={device}
                    checked={form.serviceUse.includes(device)}
                    onChange={handleCheckboxChange}
                  />
                  {device}
                </label>
              )
            )}
          </fieldset>

          <div>
            <label>ผลดำเนินการ:</label>
            {["รอดำเนินการ", "กำลังดำเนินการ", "อนุมัติ", "ไม่อนุมัติ", "ห้องไม่ว่าง", "ห้องว่าง"].map((option) => (
              <label key={option} style={{ marginRight: "1em" }}>
                <input
                  type="radio"
                  name="resultText"
                  value={option}
                  checked={form.resultText === option}
                  onChange={handleChange}
                  required
                />
                {option}
              </label>
            ))}
          </div>

          <div className={styles.inlineField}>
            <label htmlFor="approvedDate">วันที่อนุมัติ :</label>
            <input
              type="date"
              name="approvedDate"
              placeholder="วันที่อนุมัติ"
              value={form.approvedDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>การใช้ห้อง:</label>
            {["รอวันใช้งาน", "มาใช้บริการ", "ขอแต่ไม่ใช้", "ขอเปลี่ยนห้อง"].map((option) => (
              <label key={option} style={{ marginRight: "1em" }}>
                <input
                  type="radio"
                  name="operation"
                  value={option}
                  checked={form.operation === option}
                  onChange={handleChange}
                  required
                />
                {option}
              </label>
            ))}
          </div>

          <div>
            <label htmlFor="resultOperation">ผลบริการ:</label>
            {["ยังไม่ถึงวัน", "เรียบร้อยดี", "ห้องชำรุด", "อื่น ๆ"].map((option) => (
              <label key={option} style={{ marginRight: "1em" }} className="option-color">
                <input
                  type="radio"
                  name="resultOperation"
                  value={option}
                  checked={form.resultOperation === option}
                  onChange={handleChange}
                  required
                />
                {option}
              </label>
            ))}
          </div>
          <div className={styles.inlineField}>
            <label htmlFor="dateChange">เปลี่ยนรูปแบบวัน :</label>
            <input
              name="dateChange"
              placeholder="เปลี่ยนรูปแบบวัน"
              value={form.dateChange}
              onChange={handleChange}
              required
              disabled
            />
          </div>

          <button type="submit">{form.id ? "Update" : "Create"} Meets</button>
        </form >

        <ul className={styles.list}>
          {Array.isArray(meetsList) &&
            meetsList.map((item) => {
              const services = Array.isArray(item.serviceUse)
                ? item.serviceUse
                : typeof item.serviceUse === "string"
                  ? [item.serviceUse]
                  : [];

              return (
                <li key={item.id}>
                  <strong>{item.nameUse}</strong><br />
                  อุปกรณ์: [{services.join(", ")}] <br />
                  เวลาเริ่ม: {item.beginTime} <br />
                  วันที่ใช้: {item.dateUse} <br />
                  <div className={styles.buttonGroup}>
                    <button onClick={() => handleEdit(item)} className={`${styles.btn} ${styles.editBtn} `} >Edit</button>
                    <button onClick={() => handleDelete(item.id)} className={`${styles.btn} ${styles.deleteBtn}`}>Delete</button>
                    <button onClick={() => exportToPDF(item)} className={`${styles.btn} ${styles.pdfBtn}`}>Exp PDF</button>
                    <button onClick={() => exportToWord(item)} className={`${styles.btn} ${styles.wordBtn}`}>Exp Word</button>
                  </div>
                </li>
              );
            })}
        </ul>
      </div >
    </>
  );
}
