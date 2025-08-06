"use client";
import { useEffect, useState } from "react";

export default function TableMeetsLayout({
  meetsTotle,
  meetCurrent,
  tableMeetAll,
  tableMeetResult,
}) {
  const pages = [tableMeetAll, tableMeetResult, meetsTotle, meetCurrent];
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPageIndex((prevIndex) => (prevIndex + 1) % pages.length);
    }, 2 * 60 * 1000); // ⏱ เปลี่ยนเป็น 5 * 60 * 1000 เพื่อหมุนทุก 5 นาที

    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  return <section>{pages[pageIndex]}</section>;
}
