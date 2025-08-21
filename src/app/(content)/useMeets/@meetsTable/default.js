"use client";

import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import "@/app/(content)/tableMeets/tableModle.css";

export default function TableMeetsAllPage() {
  const [meetsList, setMeetsList] = useState([]);

  // โหลดข้อมูล
  useEffect(() => {
    const meetsRef = ref(db, "Request_Meeting");
    const unsubscribe = onValue(meetsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const toThaiDateString = (dateObj) => {
          if (!dateObj || isNaN(dateObj)) return "-";
          const thaiMonths = [
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
          const day = dateObj.getDate();
          const month = thaiMonths[dateObj.getMonth()];
          const year = dateObj.getFullYear();
          return `${day} ${month} ${year}`;
        };

        const sorted = Object.entries(data)
          .map(([id, item]) => {
            let dateObj = new Date(0);
            if (item.dateUse) {
              const [day, monthName, year] = item.dateUse.split("-");
              const thaiToNumMonth = {
                มกราคม: "01",
                กุมภาพันธ์: "02",
                มีนาคม: "03",
                เมษายน: "04",
                พฤษภาคม: "05",
                มิถุนายน: "06",
                กรกฎาคม: "07",
                สิงหาคม: "08",
                กันยายน: "09",
                ตุลาคม: "10",
                พฤศจิกายน: "11",
                ธันวาคม: "12",
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
              const month = thaiToNumMonth[monthName] || "01";
              dateObj = new Date(`${year}-${month}-${day}`);
            }
            return {
              id,
              ...item,
              _date: dateObj,
              dateChange: toThaiDateString(dateObj),
            };
          })
          .sort((a, b) => b._date - a._date) // ✅ ใหม่ → เก่า
          .slice(0, 5); // ✅ เอาแค่ 5 รายการล่าสุด

        setMeetsList(sorted);
      } else {
        setMeetsList([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="carousel-container">
      <h1 className="title-meet">ตารางการขอใช้ห้องประชุมประจำคณะพุทธศาสตร์</h1>

      {/* ตารางแสดงข้อมูล */}
      <div className="table-container">
        {meetsList.length > 0 ? (
          <table className="table-striped">
            <thead>
              <tr>
                <th>วันเดือนปี ที่ใช้</th>
                <th>เวลา</th>
                <th>เรื่อง</th>
                <th>จำนวน</th>
                <th>ผล</th>
                <th>การบริการ</th>
                <th>ผู้ประสานงาน</th>
              </tr>
            </thead>
            <tbody>
              {meetsList.map((item) => (
                <tr key={item.id}>
                  <td style={{ width: "160px" }}>{item.dateChange}</td>
                  <td style={{ width: "140px" }}>
                    {item.beginTime} - {item.toTime}
                  </td>
                  <td className="subject-cell">{item.subjectUse}</td>
                  <td style={{ textAlign: "center" }}>{item.amountUse}</td>
                  <td style={{ textAlign: "center" }}>
                    <span className={`status-badge ${item.resultText}`}>
                      {item.resultText}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className={`status-badge ${item.operation}`}>
                      {item.operation}
                    </span>
                  </td>
                  <td style={{ textAlign: "start", maxWidth: 180 }}>
                    {item.coordinator}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>ไม่พบรายการการใช้ห้อง</p>
        )}
      </div>
    </div>
  );
}
