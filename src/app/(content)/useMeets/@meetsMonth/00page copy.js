"use client";

import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import "@/app/(content)/meets/meetsroom.css"; // ✅ css แยก
import "@/app/(content)/useMeets/usemeetModule.css";

export default function MeetsMonthPage() {
  const [meetsList, setMeetsList] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear, setCurrentYear] = useState("");

  // 🟢 ฟังก์ชันแปลงเดือนเป็นภาษาไทย + ปี พ.ศ.
  const formatThaiMonthYear = (dateString) => {
    const date = new Date(dateString);
    const monthsThai = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const month = monthsThai[date.getMonth()];
    const year = date.getFullYear() + 543; // แปลง ค.ศ. → พ.ศ.
    return `${month} ${year}`;
  };

  // โหลดข้อมูล
  useEffect(() => {
    const meetsRef = ref(db, "Request_Meeting");
    const unsubscribe = onValue(meetsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const now = new Date();
        const monthNow = now.toLocaleString("default", { month: "long" });
        const yearNow = now.getFullYear();

        setCurrentMonth(monthNow);
        setCurrentYear(yearNow);

        const filtered = Object.entries(data)
          .map(([id, item]) => ({ id, ...item }))
          .filter((item) => {
            const parts = item.dateUse.split("-");
            if (parts.length !== 3) return false;
            const [day, month, year] = parts;
            return (
              month.toLowerCase() === monthNow.toLowerCase() &&
              parseInt(year) === yearNow
            );
          })
          .sort((a, b) => {
            const parseDate = (d) => {
              const [day, month, year] = d.dateUse.split("-");
              return new Date(`${month} ${day}, ${year}`);
            };
            return parseDate(a) - parseDate(b); // เรียงวันน้อย → มาก
          });

        setMeetsList(filtered);
      } else {
        setMeetsList([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // ฟังก์ชันเลือกสีพื้นหลังตาม forUse
  const getForUseClass = (forUse) => {
    switch (forUse) {
      case "ประชุม":
        return "foruse-meeting";
      case "ประชุมคณะ":
        return "foruse-faculty";
      case "ประชุมภาค":
        return "foruse-department";
      case "ประชุมย่อย":
        return "foruse-submeeting";
      case "สัมมนา":
        return "foruse-seminar";
      case "บรรยายพิเศษ":
        return "foruse-lecture";
      case "อบรม":
        return "foruse-training";
      default:
        return "";
    }
  };

  return (
    <div className="carousel-container">
      <h1 className="title-use">
        Consoltation Room การขอใช้ห้องประชุมประจำคณะพุทธ
      </h1>
      <p className="content-use">
        ระบบจองห้องประชุมประจำคณะพุทธศาสตร์ ออนไลน์
        สำหรับการใช้งานการให้บริการแก่คณาจารย์และบุคลากรของมหาวิทยาลัย
      </p>

      {/* 🟢 ตรงนี้คือหัวเดือนที่แสดงเป็นภาษาไทย */}
      <div className="month-label">
        {meetsList.length > 0
          ? formatThaiMonthYear(meetsList[0].dateChange || meetsList[0].dateUse)
          : ""}
      </div>

      <div className="meets-grid">
        {meetsList.length > 0 ? (
          meetsList.map((meetsItem) => {
            const day = meetsItem.dateUse.split("-")[0];
            return (
              <div
                key={meetsItem.id}
                className={`meet-card ${getForUseClass(meetsItem.forUse)}`}
              >
                {/* Row ซ้าย */}
                <div className="left-date">
                  <div className="date-box">{day}</div>
                </div>
                {/* Row ขวา */}
                <div className="right-info">
                  <div className="info-text">{meetsItem.forUse}</div>
                  <div className="info-text">{meetsItem.agencyUse}</div>
                  <div className="info-text">{meetsItem.beginTime}</div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No Meeting available this month.</p>
        )}
      </div>
    </div>
  );
}
