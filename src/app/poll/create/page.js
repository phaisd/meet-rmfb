"use client";
import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { ref, set } from "firebase/database";
import { useRouter } from "next/navigation";

export default function Create() {
  const [title, setTitle] = useState("");
  const [choices, setChoices] = useState("");
  const router = useRouter();

  const addChoice = () => setChoices([...choices, ""]);

  const createPoll = async () => {
    const pollId = Date.now().toString();
    const pollData = {
      title,
      choices: choices.map((choice) => ({ text: choice, count: 0 })),
      poll_submits: 0,
    };
    await set(ref(db, `polls/${pollId}`), pollData);
    //Redirect to the voting page
    router.push(`/poll/vote/${pollId}`);
  };

  return (
    <div className=" flex  flex-col p-12 mx-auto bg-black text-white max-w-xl gap-4">
      <h1 className="font-black text-center">Create a new Poll</h1>
      <input
        type="text"
        placeholder="Poll Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-black p-4 border-4"
      />
      {Array.isArray(choices) &&
        choices.map((choice, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder={`Choice ${index + 1}`}
              value={choice}
              onChange={(e) => {
                const updatedChoices = [...choices];
                updatedChoices[index] = e.target.value;
                setChoices(updatedChoices);
              }}
              className="text-black p-4 border-4 flex-grow"
            />
            <button
              type="button"
              onClick={() => {
                const updatedChoices = choices.filter((_, i) => i !== index);
                setChoices(updatedChoices);
              }}
              className="border-4 p-2"
            >
              Remove
            </button>
          </div>
        ))}

      <button className="btn border-4 p-4 " onClick={addChoice}>
        Add Choise
      </button>
      <br />
      <button className="border-4 p-4" onClick={createPoll}>
        Create Poll
      </button>
    </div>
  );
}
