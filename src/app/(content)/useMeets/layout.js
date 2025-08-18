"use client";
import { useEffect, useState } from "react";

export default function UseMeetsLayout({ meetToday, meetsAll }) {
  const [showToday, setShowToday] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowToday((prev) => !prev); // ✅ สลับ true/false ทุก 5 นาที
    }, 2 * 60 * 1000); // 5 นาที (5 x 60 x 1000 ms)

    return () => clearInterval(interval); // ✅ ล้างเมื่อ component ถูก unmount
  }, []);

  return (
    <>
      {/* {showToday ? (
        <section id="archive-filter">{meetToday}</section>
      ) : ( */}
      <section id="archive-latest">{meetsAll}</section>
      {/* )} */}
    </>
  );
}
