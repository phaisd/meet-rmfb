"use client";
// import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import CreateRoom from "./room/create/page";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function Home() {
  const [polls, setPolls] = useState({});

  useEffect(() => {
    const pollRef = ref(db, "polls");

    onValue(pollRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPolls(data);
      } else {
        setPolls({});
      }
    });
  }, []);

  return (
    <div className="flex flex-col p-12 mx-auto bg-black text-white max-w-xl gap-4">
      <h1>HomePage</h1>
      {/* <Link href="/poll/create">Create Poll</Link>

      <div className="flex flex-col gap-2">
        {Object.keys(polls).length > 0 ? (
          Object.entries(polls).map(([id, poll]) => (
            <Link href={`/poll/vote/${id}`} key={id}>
              {poll.title}
            </Link>
          ))
        ) : (
          <p>No polls available. Create a new polls</p>
        )}
      </div> */}

      {/* <CreateRoom />; */}
    </div>
  );
}
