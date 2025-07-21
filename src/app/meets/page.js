"use client";

import Link from "next/link";
import { db } from "@/lib/firebaseConfig";
import {
  ref,
  set,
  get,
  onValue,
  update,
  remove,
  child,
} from "firebase/database";
import { useEffect, useState } from "react";

export default function MeetsPage() {
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
      <div>
        <h1>Consoltation Room การใช้ห้องประชุม </h1>
        <ul className="meets-list">
          {Object.keys(meets).length > 0 ? (
            Object.entries(meets).map(([Id, meetsItem]) => (
              <li key={Id}>
                <Link href={`/meets/${Id}`}>
                  <img
                    src={`/images/meets/${meetsItem.forUse}.png`}
                    alt={meetsItem.forUse}
                  />
                  <span>{meetsItem.agencyUse}</span>
                  <span>
                    {meetsItem.dateUse} {meetsItem.toTime}-{meetsItem.toTime}
                  </span>
                  <span> : {meetsItem.resultText}</span>
                </Link>
              </li>
            ))
          ) : (
            <p>No Meeting available. Create a new Meet Room</p>
          )}
        </ul>
      </div>
    </>
  );
}
