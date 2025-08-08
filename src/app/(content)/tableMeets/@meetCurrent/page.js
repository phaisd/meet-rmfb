"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import "@/app/(content)/meets/meetsroom.css";

export default function MeetsCurrentPage() {
  const [todayMeets, setTodayMeets] = useState([]);
  const [todayStr, setTodayStr] = useState("");
  const [nextMeetInfo, setNextMeetInfo] = useState(null);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayFormatted = `${dd}-${today.toLocaleString("default", {
      month: "long",
    })}-${yyyy}`; // ex: 29-July-2025

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
        const allMeets = meetsArray.filter(
          (item) => item.dateUse === todayFormatted
        );

        // เรียงตามเวลาเริ่ม
        const sortedMeets = allMeets.sort(
          (a, b) => timeToMs(a.beginTime) - timeToMs(b.beginTime)
        );

        // เวลา ณ ปัจจุบัน (milliseconds)
        const now = new Date();
        const nowMs =
          now.getHours() * 3600000 +
          now.getMinutes() * 60000 +
          now.getSeconds() * 1000;

        // กรองรายการที่จะแสดงตามเวลา
        const upcomingMeets = sortedMeets.filter((item, index, arr) => {
          const beginMs = timeToMs(item.beginTime);
          const toMs = timeToMs(item.toTime);
          const tenMinAfterEnd = toMs + 10 * 60 * 1000;
          const thirtyMinBeforeStart = beginMs - 60 * 60 * 1000;

          // ✅ แสดงรายการแรกของวันตั้งแต่ต้นวัน
          if (index === 0) return true;

          // รายการถัดไป → เงื่อนไขตามเวลา
          return (
            (nowMs >= thirtyMinBeforeStart && nowMs <= toMs) ||
            nowMs >= tenMinAfterEnd
          );
        });

        setTodayMeets(upcomingMeets);

        // ✅ หา "วันถัดไป" ที่มีข้อมูลการจอง
        if (upcomingMeets.length === 0) {
          const futureMeets = meetsArray
            .filter((item) => {
              if (!item.dateUse || typeof item.dateUse !== "string")
                return false;
              const parts = item.dateUse.split("-");
              if (parts.length !== 3) return false;

              const itemDate = new Date(`${parts[1]} ${parts[0]}, ${parts[2]}`);
              return itemDate > today;
            })
            .sort((a, b) => {
              const [da, ma, ya] = a.dateUse?.split("-") || [];
              const [db, mb, yb] = b.dateUse?.split("-") || [];
              if (!(da && ma && ya && db && mb && yb)) return 0;

              return (
                new Date(`${ma} ${da}, ${ya}`) - new Date(`${mb} ${db}, ${yb}`)
              );
            });

          if (futureMeets.length > 0) {
            const nextMeet = futureMeets[0];
            const [day, month, year] = nextMeet.dateUse.split("-");
            const nextDate = new Date(`${month} ${day}, ${year}`);
            const diffDays = Math.ceil(
              (nextDate - today) / (1000 * 60 * 60 * 24)
            );
            setNextMeetInfo({
              days: diffDays,
              agency: nextMeet.agencyUse,
              date: nextMeet.dateUse,
            });
          } else {
            setNextMeetInfo(null);
          }
        } else {
          setNextMeetInfo(null);
        }
      } else {
        setTodayMeets([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="carousel-container">
      <h1 className="title-use">
        การใช้ห้องประชุมประจำคณะพุทธศาสตร์ แบบรายวัน
      </h1>
      <p className="content-use">วันนี้ : {todayStr}</p>

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
            <div>
              <h2 className="card-title-nomeet">
                วันนี้ : ไม่มีการใช้ห้องประชุมประจำคณะฯ
              </h2>
              {nextMeetInfo ? (
                <p className="card-title-nomeet">
                  🗓️ อีก {nextMeetInfo.days} วัน มีใช้ห้องประชุมโดย <br />{" "}
                  <strong>{nextMeetInfo.agency}</strong>
                  <br /> (วันที่: {nextMeetInfo.date})
                </p>
              ) : (
                <p className="card-title-nomeet">
                  📅 ยังไม่พบการใช้ห้องประชุมในวันถัดไป
                </p>
              )}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

// 🔧 ฟังก์ชันแปลงเวลา 8:30 am → เป็น milliseconds
function timeToMs(timeStr) {
  const [time, modifier] = timeStr.toLowerCase().split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "pm" && hours !== 12) hours += 12;
  if (modifier === "am" && hours === 12) hours = 0;

  return hours * 3600000 + minutes * 60000;
}
