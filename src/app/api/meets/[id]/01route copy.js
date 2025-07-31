import { updateMeets, deleteMeets } from "@/lib/meets.js";
import { db } from "@/lib/firebaseConfig";
import { ref, get } from "firebase/database";

export async function GET(_, { params }) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Missing ID in params" }, { status: 400 });
  }

  const snapshot = await get(ref(db, `Request_Meeting/${id}`));

  if (!snapshot.exists()) {
    return Response.json(
      { error: `No meeting found with ID ${id}` },
      { status: 404 }
    );
  }

  const data = snapshot.val();
  return Response.json(data, { status: 200 });
}

// ฟังก์ชัน PUT สำหรับอัปเดตข้อมูล
export async function PUT(request, { params }) {
  // console.log("Params:", params); // 🔍 ตรวจดูใน terminal หรือ console

  try {
    const body = await request.json();
    const { id } = await params;

    // ตรวจสอบ field ว่าครบไหม
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
      "beginTime",
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

    // ✅ แปลง dateUse: "27-May-2025" -> "2025-05-27"
    const convertToISODate = (inputDate) => {
      const parsed = new Date(inputDate);
      if (isNaN(parsed)) return null;

      const yyyy = parsed.getFullYear();
      const mm = String(parsed.getMonth() + 1).padStart(2, "0");
      const dd = String(parsed.getDate()).padStart(2, "0");

      return `${yyyy}-${mm}-${dd}`;
    };

    const formattedDateUse = convertToISODate(body.dateUse);
    if (!formattedDateUse) {
      return Response.json(
        { error: "Invalid date format for dateUse" },
        { status: 400 }
      );
    }

    // เพิ่ม approvedDate เป็นวันปัจจุบัน
    const approvedDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const updatedData = {
      ...body,
      approvedDate,
      resultText: body.resultText || "กำลังดำเนินการ",
      operation: body.operation || "ไม่ถึงวันขอใช้", // กำหนด default ถ้าไม่มี
      resultOperation: body.resultOperation || "ยังไม่ให้บริการ", // เช่น "สำเร็จ" หรือ "ล้มเหลว"
      dateChange: formattedDateUse, //  แทนที่ค่าที่แปลงแล้ว
    };

    const result = await updateMeets(id, updatedData);

    if (result.success) {
      return Response.json({ message: `Meets ${id} updated successfully.` });
    } else {
      return Response.json(
        { error: result.error || "Update failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("PUT Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//Delete
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing ID" }), {
        status: 400,
      });
    }

    const result = await deleteMeets(id);

    if (result.success) {
      return new Response(null, { status: 204 }); // ลบสำเร็จ ไม่มีเนื้อหา
    } else {
      return new Response(
        JSON.stringify({ error: result.error || "Deletion failed" }),
        { status: 500 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error", detail: error.message }),
      { status: 500 }
    );
  }
}
