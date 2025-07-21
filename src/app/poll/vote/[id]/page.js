"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue, increment, update } from "firebase/database";
import { useParams } from "next/navigation";

export default function Vote() {
  // interface Poll {
  //   title: string,
  //   choices: { text: string, count: number },

  // }

  const [poll, setPoll] = useState("");
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const pollRef = ref(db, `polls/${id}`);
    onValue(pollRef, (snapshot) => setPoll(snapshot.val()));
  }, [id]);

  const vote = async (index, number) => {
    const choiceRef = ref(db, `polls/${id}/choices/${index}`);
    const pollSubmitsRef = ref(db, `polls/${id}`);

    await update(choiceRef, { count: increment(1) });
    await update(pollSubmitsRef, { poll_submits: increment(1) });
  };
  if (!poll) return <p>Loading...</p>;

  return (
    <div className="flex gap-4 flex-col p-12 max-w-xl mx-auto">
      <h1 className="font-black text-center">Voting</h1>
      <h2>{poll?.title}</h2>
      {poll?.choices?.map((choice, index) => (
        <div key={index} className="border-4 flex flex-row p-4 items-center">
          {" "}
          <button
            onClick={() => vote(index)}
            className="border-4 p-4 flex-row p-4 items-center"
          >
            +
          </button>
          <p className="font-bold">{choice.text}</p>
          <p className="ml-auto p-4 text-green-500">{choice.count} vote</p>
        </div>
      ))}
    </div>
  );
}
