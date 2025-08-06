"use client";
import { useEffect, useState } from "react";
import styles from "./user.module.css";
import { redirect } from "next/navigation";
import { opreateMeets } from "./handle-form";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import Link from "next/link";
import { useRouter } from "next/navigation";

// import {
//   // getAllMeets,
//   parseDateUseToInput,
//   parseTimeToInput,
// } from "@/lib/meest";

// ✅ ฟังก์ชันแปลง "08:30 am" → "08:30"
// function revertTimeFormat(timeStr) {
//   if (!timeStr) return "";
//   const [time] = timeStr.split(" ");
//   return time;
// }

// ✅ ฟังก์ชันแปลง "27-July-2025" → "2025-07-27"
// function revertDateFormat(dateStr) {
//   if (!dateStr) return "";
//   const [day, monthText, year] = dateStr.split("-");
//   const months = {
//     January: "01",
//     February: "02",
//     March: "03",
//     April: "04",
//     May: "05",
//     June: "06",
//     July: "07",
//     August: "08",
//     September: "09",
//     October: "10",
//     November: "11",
//     December: "12",
//   };
//   const month = months[monthText];
//   return `${year}-${month}-${day.padStart(2, "0")}`;
// }

export default function UsersFbMeetsPage() {
  const [meetsList, setMeetsList] = useState([]);
  const router = useRouter(); // ✅ ประกาศบนสุดของ Component
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

  // const formattedData = rawData.map((item) => ({
  //   ...item,
  //   dateUseInput: parseDateUseToInput(item.dateUse),
  //   beginTimeInput: parseTimeToInput(item.beginTime),
  //   toTimeInput: parseTimeToInput(item.toTime),
  // }));

  return (
    <>
      <div className="container">
        <h1>ขอใช้ห้องประชุมและอุปกรณ์ ภายในคณะพุทธ</h1>
        <form
          action={async (formData) => {
            await opreateMeets(formData);
            clearForm();
            router.push("/");
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

          <input
            name="resultText"
            placeholder="ผลดำเนินการ"
            value={form.resultText}
            onChange={handleChange}
            required
            disabled
            hidden
          />
          <input
            type="date"
            name="approvedDate"
            placeholder="วันที่อนุมัติ"
            value={form.approvedDate}
            onChange={handleChange}
            required
            disabled
            hidden
          />
          <input
            name="operation"
            placeholder="การใช้ห้อง"
            value={form.operation}
            onChange={handleChange}
            required
            disabled
            hidden
          />
          <input
            name="resultOperation"
            placeholder="ผลบริการ"
            value={form.resultOperation}
            onChange={handleChange}
            required
            disabled
            hidden
          />
          <input
            name="dateChange"
            placeholder="เปลี่ยนรูปแบบวัน"
            value={form.dateChange}
            onChange={handleChange}
            required
            disabled
            hidden
          />

          <button type="submit">
            {form.id ? "Update" : "Create"} ขอใช้ห้อง
          </button>
        </form>
      </div>
    </>
  );
}
