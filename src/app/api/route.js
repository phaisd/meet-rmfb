//Api
import { db } from "@/lib/firebaseConfig";
import { ref, get, push, set, update, remove } from "firebase/database";

// //แบบสั้น
// export async function GET() {
//   const snapshot = await get(ref(db, "Request_Meeting"));
//   const data = snapshot.exists() ? snapshot.val() : {};
//   return Response.json(data);
// }

//แบบยาว
// export async function GET(request) {
//   try {
//     const dataRef = ref(db, "Request_Meeting");
//     const snapshot = await get(dataRef);

//     if (snapshot.exists()) {
//       const data = snapshot.val();
//       return new Response(JSON.stringify(data), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//     } else {
//       return new Response(JSON.stringify({ message: "No data found" }), {
//         status: 404,
//       });
//     }
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

//post currentTime :"" และสร้างไอดีฮัตโนมัติ
// export async function POST(request) {
//   try {
//     const body = await request.json();

//     // เพิ่ม currentTime เป็น timestamp ปัจจุบัน (รูปแบบตัวเลข)
//     const newData = {
//       ...body,
//       currentTime: Date.now(), // ตัวอย่าง: 1753081614284
//     };

//     // สร้าง ID อัตโนมัติใน path "Request_Meeting"
//     const result = await push(ref(db, "Request_Meeting"), newData);

//     return Response.json({
//       message: "Data saved",
//       key: result.key, // Firebase auto-generated ID
//       timestamp: newData.currentTime,
//     });
//   } catch (error) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }

// put
export async function PUT(request, { params }) {
  const body = await request.json();
  await set(ref(db, `Request_Meeting/${params.id}`), body); // Replace all fields
  return Response.json({ message: "Data replaced" });
}

//patch เพิ่มเติมข้อมูลจากของเก่า
export async function PATCH(request, { params }) {
  const body = await request.json();
  await update(ref(db, `Request_Meeting/${params.id}`), body); // Update only given fields
  return Response.json({ message: "Data updated" });
}

//ลบข้อมูลออก
export async function DELETE(_, { params }) {
  await remove(ref(db, `Request_Meeting/${params.id}`));
  return Response.json({ message: "Data deleted" });
}

//ชุดตัวอย่างเดิม
// export function GET(request) {
//   console.log('GET request reciived:', request.method);
//   return new Response("Hello From GET!");
// }

// export async function POST(request) {
//   const body = await request.json();
//   console.log('POST data:', body);

//   return Response.json({ message: 'Data received', data: body });
// }

// export async function PUT(request) {
//   const body = await request.json();
//   console.log('PUT data:', body);
//   return Response.json({ message: 'Data updated', data: body });
// }

// export async function PATCH(request) {
//   const body = await request.json();
//   console.log("PATCH data:", body);
//   return Response.json({ message: 'Data pathed', data: body });
// }

// export function DELETE(request) {
//   console.log('DELETE request received');
//   return new Response(null, { status: 204 });
// }
