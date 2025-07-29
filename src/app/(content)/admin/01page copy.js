"use client";
import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { redirect } from "next/navigation";
import { opreateMeets } from "./handle-form";

import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function AdminMeetsPage() {
  const [meetsList, setMeetsList] = useState([]);
  const [form, setForm] = useState({
    agencyUse: '',
    amountUse: '',
    beginTime: '',
    contactUse: '',
    dateUse: '',
    forUse: '',
    nameUse: '',
    resultText: '',
    serviceUse: '',
    subjectUse: '',
    statusUse: '',
    toTime: '',
    coordinator: '',
  });
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetch("/api/meets")
      .then((res) => res.json())
      .then(setMeetsList);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setPreview(`/images/meets/${item.image}`);
  };

  const handleDelete = (id) => {
    fetch(`/api/meets/${id}`, {
      method: "DELETE",
      headers: { "x-adminfb": true },
    }).then((res) => {
      if (res.ok) {
        redirect("/meets");
      }
    });
  };

  return (
    <>
      <h1>
        Manage Meets{" "}
        <a className={styles.signout} href="/api/auth/signout">
          Sign out
        </a>
      </h1>
      <form action={opreateMeets} className={styles.form}>
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

        <input
          name="forUse"
          placeholder="ใช้เพื่อ"
          value={form.forUse}
          onChange={handleChange}
          required
        />

        <input
          name="subjectUse"
          placeholder="เรื่อง"
          value={form.subjectUse}
          onChange={handleChange}
          required
        />
        <input
          name="amountUse"
          placeholder="จำนวน"
          value={form.amountUse}
          onChange={handleChange}
          required
        />
        <input
          name="dateUse"
          placeholder="วันที่ใช้"
          value={form.dateUse}
          onChange={handleChange}
          required
        />
        <input
          name="beginTime"
          placeholder="เริ่มเวลา"
          value={form.beginTime}
          onChange={handleChange}
          required
        />
        <input
          name="toTime"
          placeholder="ถึงเวลา"
          value={form.toTime}
          onChange={handleChange}
          required
        />
        <input
          name="coordinator"
          placeholder="ผู้ประสานงาน"
          value={form.coordinator}
          onChange={handleChange}
          required
        />
        <input
          name="serviceUse"
          placeholder="ขอบริการอุปกรณ์"
          value={form.serviceUse}
          onChange={handleChange}
          required
        />

        <input
          name="resultText"
          placeholder="ผลดำเนินการ"
          value={form.resultText}
          onChange={handleChange}
          required
        />


        {/* <select class="form-select form-select-sm" aria-label=".form-select-sm example">
          <option selected>เลือกใช้บริการอุปกรณ์</option>
          <option value="All Device | อุปกรณ์ทั้งหมด">All Device | อุปกรณ์ทั้งหมด</option>
          <option value="LCD & Amplifier |จอใหญ่,เครื่องขยายเสียง">LCD & Amplifier |จอใหญ่,เครื่องขยายเสียง</option>
          <option value="PC & LCD & Amplifier|คอมพิวเตอร์, จอใหญ่, เครื่องขยายเสียง">PC & LCD & Amplifier|คอมพิวเตอร์, จอใหญ่, เครื่องขยายเสียง</option>
          <option value="Amplifier|เครื่องขยายเสียง">PC & LCD & Amplifier|คอมพิวเตอร์, จอใหญ่, เครื่องขยายเสียง</option>
        </select> */}

        {/* <div class="form-check form-check-inline">
          <label class="form-check-label" type="text">เลือกใช้บริการอุปกรณ์</label>
          <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="All Device" />
          <label class="form-check-label" for="inlineCheckbox1">All Device</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="LCD" />
          <label class="form-check-label" for="inlineCheckbox2">LCD</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="PC" />
          <label class="form-check-label" for="inlineCheckbox3">PC </label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="Amplifier" />
          <label class="form-check-label" for="inlineCheckbox3">Amplifier </label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="Only Room" />
          <label class="form-check-label" for="inlineCheckbox3">Only Room </label>
        </div> */}

        {/* <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
        {preview && (
          <img src={preview} alt="preview" className={styles.preview} />
        )} */}
        <button type="submit">{form.id ? "Update" : "Create"} Meets</button>
      </form>

      {/* <ul className={styles.list}>
        {meetsList.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>({item.date})<br />
            <button onClick={() => handleEdit(item)}> Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul> */}
    </>
  );
}
