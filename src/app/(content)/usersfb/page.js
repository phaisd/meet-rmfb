"use client";
import { useEffect, useState } from "react";
import styles from "./user.module.css";
import { opreateMeets } from "./handle-form";
import { useRouter } from "next/navigation";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/lib/firebaseConfig"; // ✅ import firebase app

export default function UsersFbMeetsPage() {
  const [meetsList, setMeetsList] = useState([]);
  const router = useRouter(); // ✅ ประกาศบนสุดของ Component
  const [userEmail, setUserEmail] = useState(null); // ✅ state สำหรับเก็บอีเมล
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

  // ✅ ตรวจสอบ user ที่ล็อกอิน
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // ✅ set email
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ logout function
  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      setUserEmail(null);
      router.push("/"); // กลับไปหน้าแรกหลัง logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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

  return (
    <>
      <div className="container">
        {/* ✅ แสดง email ด้านบนขวา
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          {userEmail ? (
            <span style={{ fontWeight: "bold", color: "blue" }}>
              {userEmail}
            </span>
          ) : (
            <span style={{ color: "red" }}>ยังไม่ได้ล็อกอิน</span>
          )}
        </div> */}

        {/* ✅ Header แสดง email + logout */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "10px",
            padding: "8px 16px",
            gap: "10px",
          }}
        >
          {userEmail ? (
            <>
              <span
                style={{
                  backgroundColor: "#e0f2fe", // ฟ้าอ่อน
                  color: "#0369a1", // ฟ้าเข้ม
                  padding: "6px 12px",
                  borderRadius: "9999px", // pill shape
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                {userEmail}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#2563eb", // ฟ้าเข้ม
                  color: "white",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background 0.3s",
                }}
                onMouseOver={(e) => (e.target.style.background = "#1e40af")}
                onMouseOut={(e) => (e.target.style.background = "#2563eb")}
              >
                Logout
              </button>
            </>
          ) : (
            <span style={{ color: "red" }}>ยังไม่ได้ล็อกอิน</span>
          )}
        </div>

        <h1>ขอใช้ห้องประชุมและอุปกรณ์ ภายในคณะพุทธ</h1>
        <form
          action={async (formData) => {
            await opreateMeets(formData);
            clearForm();
            router.push("/useMeets"); // ✅ ใช้ router.push เพื่อเปลี่ยนหน้า
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
            />
            <br />
            <span style={{ color: "red" }}>
              **ไม่จำเป็นต้องใช้ที่ติดต่อจริงเช่น 095-xxx-xxxx
              เพียงแค่3ตัวแรกตามตัวอย่าง
            </span>
          </div>
          <div className={styles.inlineField}>
            <label>ใช้เพื่อ :</label>
            <div className={styles.radioGroup}>
              {[
                "ประชุม",
                "ประชุมคณะ",
                "ประชุมภาค",
                "ประชุมย่อย",
                "สัมมนา",
                "บรรยายพิเศษ",
                "กิจกรรม",
                "ชมรม",
                "อื่นๆ",
              ].map((option) => (
                <label key={option} className={styles.radioOption}>
                  <input
                    type="radio"
                    name="forUse"
                    value={option}
                    checked={form.forUse === option}
                    onChange={handleChange}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.inlineField}>
            <label htmlFor="subjectUse">เรื่อง :</label>
            <input
              name="subjectUse"
              placeholder="เรื่อง"
              value={form.subjectUse}
              onChange={handleChange}
              required
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
            {[
              "คอมพิวเตอร์",
              "LED_Display",
              "เครื่องขยายเสียง",
              "บ้นทึกประชุม",
              "SmartTv",
              "เฉพาะห้อง",
            ].map((device) => (
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
            ))}
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

          <button type="submit">ยืนยันขอใช้ห้อง</button>
        </form>
      </div>
    </>
  );
}
