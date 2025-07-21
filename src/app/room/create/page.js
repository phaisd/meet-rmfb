"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
// import styles from "./page.module.css";
import { db } from "@/lib/firebaseConfig";
import { ref, set, get, update, remove, child } from "firebase/database";
import "./create.css";

const database = db;

export default function CreateRoom() {
  const [agencyUse, setAgencyUse] = useState("");
  const [amountUse, setAmountUse] = useState("");
  const [beginTime, setBeginTime] = useState("");
  const [contactUse, setContactUse] = useState("");
  const [id, setId] = useState("");
  //   const [currentTime, setCurrentTime] = useState(
  //     new Date().toLocaleTimeString()
  //   );
  //   const [dateUse, setDateUse] = useState("");
  //   const [forUse, setForUse] = useState("");
  //   const [nameUser, setNameUser] = useState("");
  //   const [resultText, setResultText] = useState("");
  //   const [serviceUse, setSserviceUse] = useState("");
  //   const [statusUse, setStatusUse] = useState("");
  //   const [subjectUse, setSubjectUse] = useState("");
  //   const [startTime, setstartTime] = useState("");
  //   const [toTime, setToTime] = useState("");

  //   const [coordinator, useCoordinator] = useState("");
  //   const [operation, useOperation] = useState("");
  //   const [resultOperation, setresultOperation] = useState("");

  //   const [title, setTitle] = useState("");
  //   const [choices, setChoices] = useState([]);
  //   const router = useRouter;

  // let [username, setUsername] = useState("");
  // let [fullname, setFullname] = useState("");
  // let [phone, setPhone] = useState("");
  // let [dob, setDob] = useState("");

  // let isNullOrWhitespace = (value) => {
  //   value = value.toString();
  //   return value == null || value.replaceAll(" ", "").length < 1;
  // };

  // let InsertData = () => {
  //   if (
  //     isNullOrWhitespace(username) ||
  //     isNullOrWhitespace(fullname) ||
  //     isNullOrWhitespace(phone) ||
  //     isNullOrWhitespace(dob)
  //   ) {
  //     alert("Please fill in all fields.");
  //     return;
  //   }
  //   set(ref(database, "Customer/" + username), {
  //     fullname: fullname,
  //     phone: phone,
  //     dayofbirth: dob,
  //   })
  //     .then(() => {
  //       alert("Data inserted successfully.");
  //     })
  //     .catch((error) => {
  //       alert("Error inserting data: " + error.message);
  //     });
  // };

  let SelectData = () => {
    const dbRef = ref(database);
    // if (isNullOrWhitespace(id)) {
    //   alert("Please enter a username to retrieve data.");
    //   return;
    // }

    get(child(dbRef, "Request_Meeting/" + id))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // setFullname(data.fullname);
          // setPhone(data.phone);
          // setDob(data.dayofbirth);
          setId(data.id);
          setAgencyUse(data.agencyUse);
          setAmountUse(data.amountUse);
          setBeginTime(data.beginTime);
          setContactUse(data.contactUse);

          alert("Data retrieved successfully.");
        } else {
          alert("No data available for this username.");
        }
      })
      .catch((error) => {
        alert("Error retrieving data: " + error.message);
      });
  };

  let UpdateData = () => {
    // const dbRef = ref(database);
    if (
      isNullOrWhitespace(username) ||
      isNullOrWhitespace(fullname) ||
      isNullOrWhitespace(phone) ||
      isNullOrWhitespace(dob)
    ) {
      alert("Please fill in all fields.");
      return;
    }
    get(child(ref(database), "Customer/" + username))
      .then((snapshot) => {
        if (snapshot.exists()) {
          update(ref(database, "Customer/" + username), {
            fullname: fullname,
            phone: phone,
            dayofbirth: dob,
          })
            .then(() => {
              alert("Data updated successfully.");
            })
            .catch((error) => {
              alert("Error updating data: " + error.message);
            });
        } else {
          alert("No data available for this username to update.");
        }
      })
      .catch((error) => {
        alert("Error checking data: " + error.message);
      });
  };

  // let DeleteData = () => {
  //   // const dbRef = ref(database);
  //   if (isNullOrWhitespace(username)) {
  //     alert("Please enter a username to delete data.");
  //     return;
  //   }
  //   get(child(ref(database), "Customer/" + username))
  //     .then((snapshot) => {
  //       if (snapshot.exists()) {
  //         remove(ref(database, "Customer/" + username))
  //           .then(() => {
  //             alert("Data deleted successfully.");
  //             setFullname("");
  //             setPhone("");
  //             setDob("");
  //           })
  //           .catch((error) => {
  //             alert("Error deleting data: " + error.message);
  //           });
  //       } else {
  //         alert("No data available for this username to delete.");
  //       }
  //     })
  //     .catch((error) => {
  //       alert("Error checking data: " + error.message);
  //     });
  // };

  return (
    <div>
      <h1>Create Room</h1>
      {/* <form onSubmit={handleCreateRoom}> */}
      {/* <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <textarea
          placeholder="Room Description"
          value={roomDescription}
          onChange={(e) => setRoomDescription(e.target.value)}
          required
        />
        <button type="submit">Create Room</button> */}
      {/* </form> */}

      <label>Room ID</label>
      <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      <br />
      <label>Username</label>
      <input
        type="text"
        // value={username}
        // onChange={(e) => setUsername(e.target.value)}
        value={agencyUse}
        onChange={(e) => setAgencyUse(e.target.value)}
      />
      <br />
      <label>Fullname</label>
      <input
        type="text"
        // value={fullname}
        // onChange={(e) => setFullname(e.target.value)}
        value={beginTime}
        onChange={(e) => setBeginTime(e.target.value)}
      />
      <br />
      <label>Phone</label>
      <input
        type="text"
        // value={phone}
        // onChange={(e) => setPhone(e.target.value)}
        value={contactUse}
        onChange={(e) => setContactUse(e.target.value)}
      />
      <br />
      <label>Date of Birth</label>
      {/* <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /> */}
      <input
        type="text"
        value={amountUse}
        onChange={(e) => setAmountUse(e.target.value)}
      />

      <br />
      {/* <button onClick={InsertData}>Insert Data</button> */}
      <button onClick={UpdateData}>Update Data</button>
      {/* <button onClick={DeleteData}>Delete Data</button> */}
      <button onClick={SelectData}>Select Data</button>
    </div>
  );
}
