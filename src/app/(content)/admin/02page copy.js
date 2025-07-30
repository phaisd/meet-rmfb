"use client";
import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { redirect } from "next/navigation";
import { opreateMeets } from "./handle-form";

import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { headers } from "next/headers";

export default function AdminMeetsPage() {
  const [meetsList, setMeetsList] = useState([]);
  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    fetch("/api/meets")
      .then((res) => res.json())
      .then(setMeetsList);
  }, []);

  // ฟังก์ชันจัดการ checkbox
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prevForm) => {
      const newServiceUse = checked
        ? [...prevForm.serviceUse, value]
        : prevForm.serviceUse.filter((item) => item !== value);
      return { ...prevForm, serviceUse: newServiceUse };
    });
  };

  // ฟังก์ชันจัดการ text input ทั่วไป
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // จำลองฟังก์ชัน handleEdit และ handleDelete
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      agencyUse: item.agencyUse,
      amountUse: item.amountUse,
      beginTime: item.beginTime || "",
      contactUse: item.contactUse,
      dateUse: item.dateUse || "",
      forUse: item.forUse,
      nameUse: item.nameUse,
      resultText: item.resultText || "รอดำเนินการ",
      serviceUse: item.serviceUse || [],
      subjectUse: item.subjectUse,
      statusUse: item.statusUse,
      toTime: item.toTime || "",
      coordinator: item.coordinator || "(-o)",
    });
  };

  const handleDelete = async (id) => {
    // คุณสามารถเรียก API หรือลบจาก Firebase ได้ที่นี่
    const confirmDelete = confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ id: ${id}`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/meets/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-adminfb": "true", // ต้องเป็น string
        },
      });

      if (!res.ok) {
        throw new Error("การลบไม่สำเร็จ");
      }

      alert(`ลบ id: ${id}`);

      // อัปเดตรายการใหม่หลังลบ
      setMeetsList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบ:", error);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  return (
    <>
      <div className="container">
        <h1>
          Manage Meets{" "}
          <a className={styles.signout} href="/api/auth/signout">
            Sign out
          </a>
        </h1>
        <form action={opreateMeets} method="POST" className={styles.form}>
          <input type="hidden" name="id" value={form.id} />

          <input
            name="nameUse"
            placeholder="ชื่อผู้ขอใช้"
            value={form.nameUse}
            onChange={handleChange}
            required
          />
          <input
            name="statusUse"
            placeholder="ตำแหน่ง"
            value={form.statusUse}
            onChange={handleChange}
            required
          />
          <input
            name="agencyUse"
            placeholder="หน่วยงาน"
            value={form.agencyUse}
            onChange={handleChange}
            required
          />

          <input
            name="contactUse"
            placeholder="ติดต่อ"
            value={form.contactUse}
            onChange={handleChange}
            required
          />
          <small style={{ color: "red" }}>
            แนะนำ 091231xxxx or Emails ไม่บังคับแต่ต้องกรอก
          </small>

          <input
            name="forUse"
            placeholder="ใช้เพื่อ"
            value={form.forUse}
            onChange={handleChange}
            required
          />
          <small style={{ color: "red" }}>
            ประชุม, ประชุมคณะ, ประชุมย่อย, สัมมนา, อบรม, กิจกรรม
          </small>
          <input
            name="subjectUse"
            placeholder="เรื่อง"
            value={form.subjectUse}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            min="0"
            max="100"
            name="amountUse"
            placeholder="จำนวนผู้เข้าร่วม "
            value={form.amountUse}
            onChange={handleChange}
            required
          />
          <small style={{ color: "red" }}>
            ห้องมีที่นั่ง ไม่เกิน 70 รูป/คน
          </small>
          {/* วันที่ใช้ */}
          <label>
            วันที่ใช้:
            <input
              type="date"
              name="dateUse"
              value={form.dateUse}
              onChange={handleChange}
              required
            />
          </label>
          {/* เวลาเริ่มต้น */}
          <label>
            เริ่มเวลา:
            <input
              type="time"
              name="beginTime"
              value={form.beginTime}
              onChange={handleChange}
              required
            />
          </label>

          {/*  ถึงเวลา */}
          <label>
            ถึงเวลา:
            <input
              type="time"
              name="toTime"
              value={form.toTime}
              onChange={handleChange}
              required
            />
          </label>

          <input
            name="coordinator"
            placeholder="ผู้ประสานงาน"
            value={form.coordinator}
            onChange={handleChange}
            required
          />
          <fieldset>
            <legend>ขอบริการอุปกรณ์:</legend>
            {["All Device", "PC", "LCD", "Amplifier", "Only room"].map(
              (device) => (
                <label key={device} style={{ display: "block" }}>
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

          <input
            name="resultText"
            placeholder="ผลดำเนินการ"
            value={form.resultText}
            onChange={handleChange}
            required
            disabled
          />

          <button type="submit">{form.id ? "Update" : "Create"} Meets</button>
        </form>

        <ul className={styles.list}>
          {Array.isArray(meetsList) &&
            meetsList.map((item) => (
              <li key={item.id}>
                <strong>{item.nameUse}</strong>
                <br />
                อุปกรณ์: [{(item.serviceUse || []).join(", ")}] <br />
                เวลาเริ่ม: {item.beginTime}
                <br />
                วันที่ใช้: {item.dateUse}
                <br />
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
