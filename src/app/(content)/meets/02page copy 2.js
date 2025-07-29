"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import "./meetsroom.css";

export default function MeetsPage() {
  const [todayMeets, setTodayMeets] = useState([]);
  const [todayStr, setTodayStr] = useState("");

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayFormatted = `${yyyy}-${mm}-${dd}`; // รูปแบบ YYYY-MM-DD

    const displayDate = today.toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setTodayStr(displayDate);

    const meetsRef = ref(db, "Request_Meeting");
    const unsubscribe = onValue(meetsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const meetsArray = Object.entries(data).map(([id, item]) => ({
          id,
          ...item,
        }));

        // กรองเฉพาะรายการที่ตรงกับวันปัจจุบัน
        const filtered = meetsArray.filter(
          (item) => item.dateUse === todayFormatted
        );
        setTodayMeets(filtered);
      } else {
        setTodayMeets([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="carousel-container">
      <h1>การใช้ห้องประชุมประจำวัน</h1>
      <p>วันนี้ : {todayStr}</p>

      <div className="carousel">
        <ul className="card-main">
          {todayMeets.length > 0 ? (
            todayMeets.map((meetsItem) => (
              <li key={meetsItem.id} className="card img">
                <Image
                  src={`/images/meets/${meetsItem.forUse}.png`}
                  alt={meetsItem.dateUse}
                  width={300}
                  height={200}
                  onError={(e) => {
                    e.target.src = "/images/meets/default.png";
                  }}
                  unoptimized
                />

                <div className="card-body" style={{ marginBottom: "2px" }}>
                  <h3
                    className="card-title-style"
                    style={{ marginBottom: "2px" }}
                  >
                    ส่วนงาน : {meetsItem.agencyUse}
                  </h3>
                  <h4
                    className="card-title-style"
                    style={{ marginBottom: "2px" }}
                  >
                    เรื่อง : {meetsItem.subjectUse || "ไม่มีหัวข้อ"}
                  </h4>
                  <span className="card-text-style">
                    จำนวนผู้ใช้ : {meetsItem.amountUse || "11"} รูป/คน | เวลา :{" "}
                    {meetsItem.beginTime} - {meetsItem.toTime}
                  </span>
                  <br />
                  <span className="card-text-style">
                    ห้อง: {meetsItem.resultText} | ใช้ห้อง:{" "}
                    {meetsItem.operation}
                  </span>
                  <br />
                  <span
                    className="card-text-style"
                    style={{
                      textAlign: "right",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    ผู้ประสานงาน :{" "}
                    {meetsItem.coordinator || "ไม่มีผู้ประสานงาน"}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <h2>วันนี้ : ไม่มีการใช้ห้องประชุม</h2>
          )}
        </ul>
      </div>
    </div>
  );
}
