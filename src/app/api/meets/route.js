import { db } from "@/lib/firebaseConfig";
import { ref, get } from "firebase/database";
import { addMeets } from "@/lib/meets.js";

//แบบสั้น
// export async function GET() {
//   const snapshot = await get(ref(db, "Request_Meeting"));
//   const data = snapshot.exists() ? snapshot.val() : {};
//   return Response.json(data);
// }

////แก้ให้ดึงขึ้นเวป
export async function GET() {
  const snapshot = await get(ref(db, "Request_Meeting"));
  const data = snapshot.exists() ? snapshot.val() : {};

  // แปลง Object เป็น Array และแนบ id แต่ละรายการ
  const list = Object.entries(data).map(([id, item]) => ({
    id,
    ...item,
  }));

  return Response.json(list);
}

//addmeets อีกอันกันเสีย
export async function POST(request) {
  try {
    const body = await request.json();

    // ✅ แก้ตรงนี้ เพื่อกัน error
    if (!Array.isArray(body.serviceUse)) {
      if (typeof body.serviceUse === "string") {
        body.serviceUse = [body.serviceUse];
      } else {
        body.serviceUse = [];
      }
    }

    const requiredFields = [
      "agencyUse",
      "amountUse",
      "beginTime",
      "contactUse",
      "dateUse",
      "forUse",
      "nameUse",
      "resultText",
      "serviceUse",
      "subjectUse",
      "statusUse",
      "toTime",
      "coordinator",
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return Response.json(
        { error: `Missing fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await addMeets(body);

    if (result.success) {
      return Response.json(
        { message: "Meets added successfully", id: result.id },
        { status: 201 }
      );
    } else {
      return Response.json(
        { error: result.error || "Failed to add meeting" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("POST Error:", error);
    return Response.json(
      { error: "Internal Server Error", detail: error.message },
      { status: 500 }
    );
  }
}
