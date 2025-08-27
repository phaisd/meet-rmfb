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

    // =========================
    // 1) ส่งข้อมูลทั้งหมดไป Sheet1
    // =========================
    const valuesMain = [
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
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: { values: valuesMain },
    });

    // =========================
    // 2) แยก forUse ออกมาเป็น unique
    // =========================
    const forUseGroups = [...new Set(data.map((item) => item.forUse))];

    // =========================
    // 3) โหลดข้อมูล sheet ปัจจุบัน
    // =========================
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = spreadsheet.data.sheets.map(
      (s) => s.properties.title
    );

    // =========================
    // 4) วนสร้าง / เขียนข้อมูลแต่ละ forUse
    // =========================
    for (const use of forUseGroups) {
      const sheetName = use.trim();

      // ถ้าไม่มี sheet นี้ → สร้างใหม่
      if (!existingSheets.includes(sheetName)) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });
      }

      // กรองข้อมูลที่ตรงกับ forUse นี้
      const filteredData = data.filter((item) => item.forUse === use);

      const valuesFiltered = [
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
        ...filteredData.map((item) => [
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

      // เขียนข้อมูลลง sheet ที่กรองแล้ว
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: "RAW",
        requestBody: { values: valuesFiltered },
      });
    }

    return new Response(
      JSON.stringify({
        message: "ส่งออกข้อมูลไป Google Sheets สำเร็จ (แยกตาม forUse)",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error exporting to Google Sheets:", error);
    return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาด" }), {
      status: 500,
    });
  }
}
