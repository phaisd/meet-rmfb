import { google } from "googleapis";

export async function POST(req) {
  try {
    const body = await req.json();
    const { data } = body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    const range = "Sheet1!A1";

    const values = [
      [
        "วันเดือนปี",
        "เวลา",
        "สำหรับ",
        "เรื่อง",
        "จำนวน",
        "ผล",
        "ใช้ห้อง",
        "บริการ",
        "ชื่อผู้ใช้",
        "หน่วยงาน",
        "ผู้ประสานงาน",
      ],
      ...data.map((item) => [
        item.dateChange,
        `${item.beginTime} - ${item.toTime}`,
        item.forUse,
        item.subjectUse,
        item.amountUse,
        item.resultText,
        item.operation,
        item.resultOperation,
        item.nameUse,
        item.agencyUse,
        item.coordinator,
      ]),
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    return new Response(
      JSON.stringify({ message: "ส่งออกข้อมูลไป Google Sheets สำเร็จ" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error exporting to Google Sheets:", error);
    return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาด" }), {
      status: 500,
    });
  }
}
