"use client";

import Link from "next/link";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import "@/app/(content)/meets/meetsroom.css"; // Import CSS for styling
import Image from "next/image";

const ITEMS_PER_PAGE = 4;
const AUTO_ADVANCE_INTERVAL = 10000; // 10 วินาที

export default function MeetsAllPage() {
  const [meetsList, setMeetsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // โหลดข้อมูล
  useEffect(() => {
    const meetsRef = ref(db, "Request_Meeting");
    const unsubscribe = onValue(meetsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sorted = Object.entries(data)
          .sort(([idA], [idB]) => idB.localeCompare(idA))
          .map(([id, item]) => ({ id, ...item }));
        setMeetsList(sorted);

        // เริ่มต้นที่หน้าสุดท้าย
        const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
        setCurrentPage(totalPages - 1);
      } else {
        setMeetsList([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // เลื่อนหน้าอัตโนมัติ
  useEffect(() => {
    if (!autoAdvance) return;
    const totalPages = Math.ceil(meetsList.length / ITEMS_PER_PAGE) || 1;
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, AUTO_ADVANCE_INTERVAL);

    return () => clearInterval(timer);
  }, [meetsList, autoAdvance]);

  const totalPages = Math.ceil(meetsList.length / ITEMS_PER_PAGE) || 1;
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = meetsList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setAutoAdvance(false);
  };

  return (
    <div className="carousel-container">
      <h1 className="title-use">Consoltation Room การใช้ห้องประชุม</h1>
      <p className="content-use">
        ระบบจองห้องประชุมออนไลน์
        สำหรับการใช้งานของคณาจารย์และบุคลากรของมหาวิทยาลัย
      </p>
      <div className="carousel">
        <ul className="meets-list">
          {currentItems.length > 0 ? (
            currentItems.map((meetsItem) => (
              <li key={meetsItem.id}>
                <Link href={`/meets/${meetsItem.id}`}>
                  <Image
                    src={`/images/meets/${meetsItem.forUse}.png`}
                    alt={meetsItem.dateUse}
                    width={150}
                    height={100}
                  />
                  <div className="card-body">
                    <span>ส่วนงาน : {meetsItem.agencyUse}</span>
                    <br />
                    <span>วันที่ : {meetsItem.dateUse}</span>
                    <br />
                    <span>
                      เวลา : {meetsItem.beginTime}-{meetsItem.toTime}
                    </span>
                    <br />
                    <span className={`status-badge ${meetsItem.resultText}`}>
                      ห้อง: {meetsItem.resultText}
                    </span>
                    <br />
                    <span
                      className={`re-operete-badge ${meetsItem.resultOperation}`}
                    >
                      ผลบริการ : {meetsItem.resultOperation}
                    </span>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <p>No Meeting available. Create a new Meet Room</p>
          )}
        </ul>
      </div>
      {/* Controls */}
      <div className="controls">
        <button
          onClick={() =>
            handlePageChange((currentPage - 1 + totalPages) % totalPages)
          }
        >
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

        <button
          onClick={() => handlePageChange((currentPage + 1) % totalPages)}
        >
          ▶
        </button>

        {/* Play / Pause toggle */}
        <button
          onClick={() => setAutoAdvance((prev) => !prev)}
          className="playpause"
        >
          {autoAdvance ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>
    </div>
  );
}
