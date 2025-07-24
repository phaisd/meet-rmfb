import { db } from "@/lib/firebaseConfig";
import { ref, get } from "firebase/database";
import { notFound } from "next/navigation";
import MeetsNotFound from "./not-found";

export default async function MeetRoomPage({ params }) {
  const { meetsId } = await params;

  const snapshot = await get(ref(db, `Request_Meeting/${meetsId}`));
  if (!snapshot.exists()) {
    MeetsNotFound();
  }
  const meetItem = snapshot.val();

  if (!meetItem) {
    notFound();
  }

  return (
    <div>
      <h1 hidden>{meetsId}</h1>
      <h2>รายละเอียดของการใช้ห้องประชุม : </h2>
      <article className="meets-article">
        <header>
          <img
            src={`/images/meets/${meetItem.forUse}.png`}
            alt={meetItem.forUse}
          />
          <h2>เรื่อง :</h2>
          <h1>{meetItem.subjectUse || "ไม่มีหัวข้อ"}</h1>
          <p>ผู้ใช้ : {meetItem.nameUse}</p>
          <p>ตำแหน่ง : {meetItem.statusUse}</p>
          <p>หน่วยงานที่ใช้ : {meetItem.agencyUse}</p>
          <p>จำนวนผู้ใช้ : {meetItem.amountUse || "11"} รูป/คน</p>
          {/* <p>เบอร์ติดต่อ : XXX-xxx-xxxx</p> */}
          <p>วันที่ใช้ : {meetItem.dateUse}</p>
          <p>
            เวลาเริ่มใช้ : {meetItem.beginTime} | เวลาสิ้นสุด :{" "}
            {meetItem.toTime}
          </p>
          <p>ขอใช้บริการ : {meetItem.serviceUse} </p>
          <p>ผู้ประสานงาน : {meetItem.coordinator || "ไม่มีผู้ประสานงาน"} </p>
          <p>การขอใช้ห้อง : {meetItem.resultText}</p>
          <p>การดำเนินการ : {meetItem.operation || "ไม่ใช้งานในวันที่ขอใช้"}</p>
          <p>ผลการดำเนินการ : {meetItem.resultOperation || "เรียบร้อย"}</p>
          <p>ผู้อนุมัติ : </p>
        </header>
      </article>
    </div>
  );
}
