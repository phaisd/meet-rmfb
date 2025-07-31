"use client";
import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { redirect } from "next/navigation";
import { opreateMeets } from "./handle-form";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
// import {
//   // getAllMeets,
//   parseDateUseToInput,
//   parseTimeToInput,
// } from "@/lib/meest";

// ✅ ฟังก์ชันแปลง "08:30 am" → "08:30"
function revertTimeFormat(timeStr) {
  if (!timeStr) return "";
  const [time] = timeStr.split(" ");
  return time;
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

  // const formattedData = rawData.map((item) => ({
  //   ...item,
  //   dateUseInput: parseDateUseToInput(item.dateUse),
  //   beginTimeInput: parseTimeToInput(item.beginTime),
  //   toTimeInput: parseTimeToInput(item.toTime),
  // }));

  return (
    <>
      <div>
        <h1>
          Manage Meets{" "}
          <a className={styles.signout} href="/api/auth/signout">
            Sign out
          </a>
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
          <input
            name="nameUse"
            placeholder="ชื่อผู้ขอใช้"
            value={form.nameUse}
            onChange={handleChange}
            required
            disabled={!!form.id}
          />
          <input
            name="statusUse"
            placeholder="ตำแหน่ง"
            value={form.statusUse}
            onChange={handleChange}
            required
            disabled={!!form.id}
          />
          <input
            name="agencyUse"
            placeholder="หน่วยงาน"
            value={form.agencyUse}
            onChange={handleChange}
            required
            disabled={!!form.id}
          />
          <input
            name="contactUse"
            placeholder="ติดต่อ"
            value={form.contactUse}
            onChange={handleChange}
            required
            disabled={!!form.id}
          />
          <input
            name="forUse"
            placeholder="ใช้เพื่อ"
            value={form.forUse}
            onChange={handleChange}
            required
            disabled={!!form.id}
          />
          <input
            name="subjectUse"
            placeholder="เรื่อง"
            value={form.subjectUse}
            onChange={handleChange}
            required
            disabled={!!form.id}
          />
          <input
            type="number"
            name="amountUse"
            placeholder="จำนวนผู้เข้าร่วม"
            value={form.amountUse}
            onChange={handleChange}
            required
            disabled={!!form.id}
          />

          {/* วันที่และเวลา */}
          {/* <input type="date" defaultValue={item.dateUseInput} /> */}
          <label>
            วันที่ใช้:
            <input
              type="date"
              name="dateUse"
              value={form.dateUse}
              onChange={handleChange}
              required
              disabled={!!form.id}
            />
          </label>
          {/* <input type="time" defaultValue={item.beginTimeInput} /> */}
          <label>
            เริ่มเวลา:
            <input
              type="time"
              name="beginTime"
              value={form.beginTime}
              onChange={handleChange}
              required
              disabled={!!form.id}
            />
          </label>
          {/* <input type="time" defaultValue={item.toTimeInput} /> */}
          <label>
            ถึงเวลา:
            <input
              type="time"
              name="toTime"
              value={form.toTime}
              onChange={handleChange}
              required
              disabled={!!form.id}
            />
          </label>

          <input
            name="coordinator"
            placeholder="ผู้ประสานงาน"
            value={form.coordinator}
            onChange={handleChange}
            required
          />

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
          />
          <input
            type="date"
            name="approvedDate"
            placeholder="วันที่อนุมัติ"
            value={form.approvedDate}
            onChange={handleChange}
            required
          />
          <input
            name="operation"
            placeholder="การใช้ห้อง"
            value={form.operation}
            onChange={handleChange}
            required
          />
          <input
            name="resultOperation"
            placeholder="ผลบริการ"
            value={form.resultOperation}
            onChange={handleChange}
            required
          />
          <input
            name="dateChange"
            placeholder="เปลี่ยนรูปแบบวัน"
            value={form.dateChange}
            onChange={handleChange}
            required
          />

          <button type="submit">{form.id ? "Update" : "Create"} Meets</button>
        </form>

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
                  <strong>{item.nameUse}</strong>
                  <br />
                  อุปกรณ์: [{services.join(", ")}] <br />
                  เวลาเริ่ม: {item.beginTime} <br />
                  วันที่ใช้: {item.dateUse} <br />
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
