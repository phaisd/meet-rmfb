"use client";

import Link from "next/link";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import "@/app/(content)/tableMeets/tableModle.css";

const ITEMS_PER_PAGE = 8;
const AUTO_ADVANCE_INTERVAL = 10000;

export default function TableMeetsAllPage() {
  const [meetsList, setMeetsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");

  // โหลดข้อมูล
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

  // หารายการที่กำลังจะถึง
  const today = new Date();
  const upcomingItem = meetsList.find(item => item._date >= today);

  const getDaysDiff = (targetDate) => {
    const oneDay = 1000 * 60 * 60 * 24;
    const diff = Math.ceil((targetDate - today) / oneDay);
    return diff;
  };

  const upcomingDays = upcomingItem ? getDaysDiff(upcomingItem._date) : null;


  // กรองตามเดือน
  useEffect(() => {
    if (!selectedMonth) {
      setFilteredList(meetsList);
    } else {
      const filtered = meetsList.filter((item) => {
        const [day, month, year] = item.dateUse?.split("-") || [];
        const monthKey = `${month}-${year}`;
        return monthKey === selectedMonth;
      });
      setFilteredList(filtered);
    }
    setCurrentPage(0);
  }, [meetsList, selectedMonth]);

  // เลื่อนหน้าอัตโนมัติ
  useEffect(() => {
    if (!autoAdvance) return;
    const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, AUTO_ADVANCE_INTERVAL);
    return () => clearInterval(timer);
  }, [filteredList, autoAdvance]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const monthOptions = Array.from(
    new Set(
      meetsList.map((item) => {
        const [day, month, year] = item.dateUse?.split("-") || [];
        return `${month}-${year}`;
      })
    )
  ).sort((a, b) => b.localeCompare(a));

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setAutoAdvance(false);
  };

  return (
    <div className="carousel-container">
      <h1>ตารางการขอใช้ห้องประชุม</h1>
      <p>ระบบจองห้องประชุมออนไลน์ สำหรับคณาจารย์และบุคลากรของมหาวิทยาลัย</p>

      {/* แสดงข้อความรายการถัดไป */}
      <div style={{ marginBottom: "1rem" }}>
        {upcomingItem && (
          <p style={{ color: "green", fontWeight: "bold", marginBottom: "1rem" }}>
            จะมีรายการอีกครั้งในวันที่ {upcomingItem.dateUse}
            {upcomingDays > 0 && ` (อีก ${upcomingDays} วัน)`}
            {upcomingDays === 0 && ` (วันนี้)`}
          </p>
        )}
      </div>

      {/* เลือกเดือน */}
      <div style={{ marginBottom: "1rem" }}>
        <label>เลือกเดือน: </label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">ทั้งหมด</option>
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* ตารางแสดงข้อมูล */}
      <div className="table-container">
        {currentItems.length > 0 ? (
          <table className="table-striped">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>วันเดิอนปี ที่ใช้</th>
                <th>เวลา</th>
                <th>ส่วนงาน</th>
                <th>จำนวน/คน</th>
                <th>สถานะห้อง</th>
                <th>การใช้ห้อง</th>
                <th>ผลบริการ</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className={item.id === upcomingItem?.id ? "highlight-row" : ""}
                >
                  <td>
                    <Link href={`/meets/${item.id}`}>{item.dateUse}</Link>
                  </td>
                  <td>{item.dateChange}</td>
                  <td>
                    {item.beginTime} - {item.toTime}
                  </td>
                  <td>{item.agencyUse}</td>
                  <td>{item.amountUse}</td>
                  <td>
                    <span className={`status-badge ${item.resultText}`}>
                      {item.resultText}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${item.operation}`}>
                      {item.operation}
                    </span>
                  </td>
                  <td>
                    <span className={`re-operete-badge ${item.resultOperation}`}>
                      {item.resultOperation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>ไม่พบรายการการใช้ห้อง</p>
        )}
      </div>

      {/* ปุ่มควบคุม */}
      <div className="controls">
        <button onClick={() => handlePageChange((currentPage - 1 + totalPages) % totalPages)}>
          ◀
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={i === currentPage ? "active" : ""}
            onClick={() => handlePageChange(i)}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange((currentPage + 1) % totalPages)}>
          ▶
        </button>
        <button onClick={() => setAutoAdvance((prev) => !prev)} className="playpause">
          {autoAdvance ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>
    </div>
  );
}
