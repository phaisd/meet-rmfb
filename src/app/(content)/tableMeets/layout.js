"use client";
import { useEffect, useState } from "react";

export default function TableMeetsLayout({ tableMeetAll, tableMeetResult }) {
  const [showToday, setShowToday] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowToday((prev) => !prev); // ✅ สลับ true/false ทุก 5 นาที
    }, 1 * 60 * 1000); // 5 นาที (5 x 60 x 1000 ms)

    return () => clearInterval(interval); // ✅ ล้างเมื่อ component ถูก unmount
  }, []);

  return (
    <>
      {showToday ? (
        <section >
          {tableMeetAll}
        </section>
      ) : (
        <section >{tableMeetResult}</section>
      )}
    </>
  );
}
