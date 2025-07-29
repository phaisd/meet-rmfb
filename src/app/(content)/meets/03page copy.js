"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import Image from "next/image";
import "./meetsroom.css";

export default function MeetsPage() {
  const [activeMeet, setActiveMeet] = useState(null);
  const [todayStr, setTodayStr] = useState("");

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const todayFormatted = `${yyyy}-${mm}-${dd}`;

    const displayDate = now.toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setTodayStr(displayDate);

    const meetsRef = ref(db, "Request_Meeting");

    const unsubscribe = onValue(meetsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setActiveMeet(null);
        return;
      }

      const allMeets = Object.entries(data)
        .map(([id, item]) => ({ id, ...item }))
        .filter((item) => item.dateChange === todayFormatted);

      // แปลงเวลา string เป็น timestamp (ms)
      const timeToMs = (timeStr) => {
        const [h, m] = timeStr.replace("am", "").replace("pm", "").split(":");
        let hour = parseInt(h);
        const minute = parseInt(m);

        if (timeStr.toLowerCase().includes("pm") && hour < 12) {
          hour += 12;
        }
        if (timeStr.toLowerCase().includes("am") && hour === 12) {
          hour = 0;
        }

        const d = new Date();
        d.setHours(hour, minute, 0, 0);
        return d.getTime();
      };

      const nowMs = Date.now();

      const upcomingMeets = allMeets.filter((item) => {
        const beginMs = timeToMs(item.beginTime);
        const toMs = timeToMs(item.toTime);

        const tenMinAfterEnd = toMs + 10 * 60 * 1000;
        const thirtyMinBeforeStart = beginMs - 30 * 60 * 1000;

        return (
          (nowMs >= thirtyMinBeforeStart && nowMs <= toMs) ||
          nowMs >= tenMinAfterEnd
        );
      });

      if (upcomingMeets.length > 0) {
        // เรียงตามเวลาเริ่มต้น
        upcomingMeets.sort(
          (a, b) => timeToMs(a.beginTime) - timeToMs(b.beginTime)
        );
        setActiveMeet(upcomingMeets[0]); // แสดงเฉพาะตัวแรกที่เข้าเงื่อนไข
      } else {
        setActiveMeet(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="carousel-container">
      <h1>ห้องประชุมวันนี้</h1>
      <p>วันนี้: {todayStr}</p>

      {activeMeet ? (
        <div className="card img">
          <Image
            src={`/images/meets/${activeMeet.forUse}.png`}
            alt={activeMeet.dateUse}
            width={300}
            height={200}
            onError={(e) => {
              e.target.src = "/images/meets/default.png";
            }}
            unoptimized
          />
          <div className="card-body">
            <h3 className="card-title-style">
              ส่วนงาน : {activeMeet.agencyUse}
            </h3>
            <h4 className="card-title-style">
              เรื่อง : {activeMeet.subjectUse || "ไม่มีหัวข้อ"}
            </h4>
            <span className="card-text-style">
              ผู้ใช้ : {activeMeet.amountUse || "11"} คน | เวลา :{" "}
              {activeMeet.beginTime} - {activeMeet.toTime}
            </span>
            <br />
            <span className="card-text-style">
              ห้อง: {activeMeet.resultText} | ใช้ห้อง: {activeMeet.operation}
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
              ผู้ประสานงาน : {activeMeet.coordinator || "ไม่มีข้อมูล"}
            </span>
          </div>
        </div>
      ) : (
        <h3>ขณะนี้ไม่มีรายการที่กำลังจะแสดง</h3>
      )}
    </div>
  );
}
