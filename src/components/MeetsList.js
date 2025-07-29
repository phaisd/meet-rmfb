"use client";

import Link from "next/link";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import "@/app/(content)/meets/meetsroom.css"

export default function MeetsList() {
  const [meets, setMeets] = useState({});

  useEffect(() => {
    const meetsRef = ref(db, "Request_Meeting");

    onValue(meetsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMeets(data);
      } else {
        setMeets({});
      }
    });
  }, []);

  return (
    <>
      <ul className="meets-list">
        {Object.keys(meets).length > 0 ? (
          Object.entries(meets).map(([Id, meetsItem]) => (
            <li key={Id}>
              <Link href={`/meets/${Id}`}>
                <img
                  src={`/images/meets/${meetsItem.forUse}.png`}
                  alt={meetsItem.forUse}
                />
                <span>ส่วนงาน : {meetsItem.agencyUse}</span>
                <span>วันที่ : {meetsItem.dateUse}</span>
                <span>
                  เวลา : {meetsItem.beginTime}-{meetsItem.toTime}
                </span>

                {/* <p className={`status-badge ${meetsItem.resultText}`}>
                  ห้อง: {meetsItem.resultText}
                </p> */}
                <span className={`status-badge ${meetsItem.resultText}`}>
                  ขอห้อง: {meetsItem.resultText}
                </span>
                <span >
                  ใช้ห้อง: {meetsItem.operation} | ผลบริการ: {meetsItem.resultOperation}
                </span>
              </Link>
            </li>
          ))
        ) : (
          <p>No Meeting available. Create a new Meet Room</p>
        )}
      </ul>

    </>
  );
}
