"use client";
import { useEffect, useState } from "react";

export default function UseMeetsLayout({ meetsTable, meetsAll, meetsMonth }) {
  const pages = [meetsTable, meetsAll, meetsMonth];
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPageIndex((prev) => (prev + 1) % pages.length); // ✅ สลับ true/false ทุก 5 นาที
    }, 1 * 60 * 1000); // 5 นาที (5 x 60 x 1000 ms)

    return () => clearInterval(interval); // ✅ ล้างเมื่อ component ถูก unmount
  }, []);

  return <section>{pages[pageIndex]}</section>;
}
