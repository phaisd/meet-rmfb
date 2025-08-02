"use client";

import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import "@/app/(content)/tableMeets/tableModle.css"

export default function MonthlySummaryTable() {
  const [meetsList, setMeetsList] = useState([]);

  // แปลงเลขเดือน → เดือนภาษาไทย และปี ค.ศ. → พ.ศ.
  const thaiMonthNames = {
    "01": "มกราคม",
    "02": "กุมภาพันธ์",
    "03": "มีนาคม",
    "04": "เมษายน",
    "05": "พฤษภาคม",
    "06": "มิถุนายน",
    "07": "กรกฎาคม",
    "08": "สิงหาคม",
    "09": "กันยายน",
    "10": "ตุลาคม",
    "11": "พฤศจิกายน",
    "12": "ธันวาคม",
  };

  function formatMonthYear(month, year) {
    const thaiMonth = thaiMonthNames[month] || month;
    const thaiYear = (parseInt(year, 10) + 543).toString();
    return `${thaiMonth} ${thaiYear}`;
  }


  useEffect(() => {
    const meetsRef = ref(db, "Request_Meeting");
    const unsubscribe = onValue(meetsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const thaiMonths = {
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
        };

        const sorted = Object.entries(data)
          .map(([id, item]) => {
            let dateObj = new Date(0);
            if (item.dateUse) {
              const [day, monthName, year] = item.dateUse.split("-");
              const month = thaiMonths[monthName] || "01";
              dateObj = new Date(`${year}-${month}-${day}`);
            }

            return { id, ...item, _date: dateObj };
          })
          .sort((a, b) => b._date - a._date);

        setMeetsList(sorted);
      } else {
        setMeetsList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // สรุปเดือน + จำนวน
  const summary = meetsList.reduce((acc, item) => {
    const [day, month, year] = item.dateUse?.split("-") || [];
    const key = `${month}-${year}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // เรียงเดือนจากใหม่ → เก่า
  const sortedSummary = Object.entries(summary).sort((a, b) => {
    const [monthA, yearA] = a[0].split("-");
    const [monthB, yearB] = b[0].split("-");
    return yearB.localeCompare(yearA) || monthB.localeCompare(monthA);
  });

  return (
    <div className="carousel-container">
      <h1>สรุปการขอใช้ห้องประชุมแต่ละเดือน</h1>
      <p>ระบบจองห้องประชุมออนไลน์ สำหรับคณาจารย์และบุคลากรของมหาวิทยาลัย</p>

      <div style={{ marginBottom: "2rem" }}>
        <h3>สรุปรายเดือน:</h3>
        <table className="table-striped">
          <thead>
            <tr>
              <th>เดือน</th>
              <th>จำนวนการใช้ห้อง</th>
            </tr>
          </thead>
          <tbody>
            {sortedSummary.map(([monthYear, count]) => {
              const [month, year] = monthYear.split("-");
              return (
                <tr key={monthYear}>
                  <td>{formatMonthYear(month, year)}</td>
                  <td>{count} รายการ</td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>
    </div>
  );
}
