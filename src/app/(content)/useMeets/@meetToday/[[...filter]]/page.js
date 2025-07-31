"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import "@/app/(content)/meets/meetsroom.css";

export default function MeetTodayPage() {
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
    <>
      <h1>Today Meeting Pages</h1>
      <p>วันนี้ : {todayStr}</p>

      <div className="carousel">
        <ul className="card-main">
          {todayMeets.length > 0 ? (
            todayMeets.map((meetsItem) => (
              <li key={meetsItem.id} className="card img">
                <Link href={`/meets/${meetsItem.id}`}>
                  <Image
                    src={`/images/meets/${meetsItem.forUse}.png`}
                    alt={meetsItem.dateUse}
                    width={300}
                    height={200}
                    onError={(e) => {
                      e.target.src = "/images/meets/default.png";
                    }}
                  />

                  <div className="card-body">
                    <h3>ส่วนงาน : {meetsItem.agencyUse}</h3>
                    <h4>เรื่อง : {meetsItem.subjectUse || "ไม่มีหัวข้อ"}</h4>
                    <br />
                    <span>
                      จำนวนผู้ใช้ : {meetsItem.amountUse || "11"} รูป/คน
                    </span>
                    <span>วันที่ : {meetsItem.dateUse}</span>
                    <span>
                      เวลา : {meetsItem.beginTime} - {meetsItem.toTime}
                    </span>
                    <br />
                    <p className={`status-badge ${meetsItem.resultText}`}>
                      ห้อง: {meetsItem.resultText}
                    </p>
                    <span className={`operate-badge ${meetsItem.operation}`}>
                      ใช้ห้อง: {meetsItem.operation}
                    </span>
                    <br />
                    <span>
                      ผู้ประสานงาน :
                      {meetsItem.coordinator || "ไม่มีผู้ประสานงาน"}
                    </span>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <h2 className="card-title-nomeet">
              วันนี้ : ไม่มีการใช้ห้องประชุม
            </h2>
          )}
        </ul>
      </div>
    </>
  );
}
