import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  TabStopType,
  ImageRun,
  UnderlineType,
} from "docx";
import { saveAs } from "file-saver";

function formatThaiDate(dateInput) {
  if (!dateInput) return "";

  let dateStr = dateInput;
  if (dateInput instanceof Date) {
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, "0");
    const day = String(dateInput.getDate()).padStart(2, "0");
    dateStr = `${year}-${month}-${day}`;
  } else {
    dateStr = String(dateInput); // กันไว้ถ้าเป็น number หรืออื่น ๆ
  }

  if (!dateStr) return "";
  const monthsMap = {
    January: "มกราคม",
    February: "กุมภาพันธ์",
    March: "มีนาคม",
    April: "เมษายน",
    May: "พฤษภาคม",
    June: "มิถุนายน",
    July: "กรกฎาคม",
    August: "สิงหาคม",
    September: "กันยายน",
    October: "ตุลาคม",
    November: "พฤศจิกายน",
    December: "ธันวาคม",
  };

  let day, month, year;

  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (isNaN(parts[0])) {
      return dateStr;
    } else if (isNaN(parts[1])) {
      day = parseInt(parts[0]);
      month = monthsMap[parts[1]];
      year = parseInt(parts[2]) + 543;
    } else {
      year = parseInt(parts[0]);
      month = monthsMap[Object.keys(monthsMap)[parseInt(parts[1]) - 1]] || "";
      day = parseInt(parts[2]);
    }
  }

  return `${day} ${month} ${year}`;
}

// Create a two-column comment box
function createCommentBoxTwoColumn(
  titleLeft,
  linesLeft,
  titleRight,
  linesRight
) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          //คอลัมน์ซ้าย
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
            },
            verticalAlign: "center", //กึ่งกลางแนวตั้ง
            children: [
              //หัวข้อตัวหน้า
              new Paragraph({
                children: [new TextRun({ text: titleLeft, bold: true })],
                alignment: AlignmentType.CENTER, //กึ่งกลางแนวนอน
              }),
              //เนื้อหาด้านใน
              ...linesLeft.map(
                (line) =>
                  new Paragraph({
                    children: [new TextRun(line)],
                    alignment: AlignmentType.CENTER,
                    tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
                  })
              ),
            ],
          }),
          //คอลัมน์ขวา
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
            },
            verticalAlign: "center", //กึ่งกลางแนวตั้ง
            children: [
              //หัวข้อตัวหน้า
              new Paragraph({
                children: [new TextRun({ text: titleRight, bold: true })],
                alignment: AlignmentType.CENTER, //กึ่งกลางแนวนอน
              }),
              //เนื้อหาด้านใน
              ...linesRight.map(
                (line) =>
                  new Paragraph({
                    children: [new TextRun(line)],
                    alignment: AlignmentType.CENTER,
                    // tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
                  })
              ),
            ],
          }),
        ],
      }),
    ],
  });
}

export async function exportToWord(item) {
  const today = new Date();
  const printedDate = formatThaiDate(today);

  const thaiDateUse = formatThaiDate(item.dateUse);

  // const imageRes = await fetch("/logo.png");

  const imageRes = await fetch(`${window.location.origin}/logo.jpg`);

  const imageBlob = await imageRes.blob();
  const reader = new FileReader();
  const base64Image = await new Promise((resolve) => {
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(imageBlob);
  });

  const doc = new Document({
    sections: [
      {
        children: [
          // โลโก้
          new Paragraph({
            children: [
              new ImageRun({
                data: Uint8Array.from(atob(base64Image), (c) =>
                  c.charCodeAt(0)
                ),
                transformation: { width: 85, height: 85 },
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph({
            text: "ใบขอใช้ห้องประชุมประจำคณะพุทธศาสตร์",
            heading: "Heading1",
            bold: true,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "อาคารสมเด็จพระพุฒาจารย์ (เกี่ยว อุปเสนมหาเถระ) โซน D อาคารเรียนรวม",
            text: "มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย ตำบลลำไทย อำเภอวังน้อย จังหวัดพระนครศรีอยุธยา",
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph({
            text: `วันที่พิมพ์: ${printedDate}`,
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun("เรียน\tเลขานุการสำนักงานคณบดีคณะพุทธศาสตร์"),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),
          new Paragraph(""),

          //จัดให้ชิดซ้ายชิดขวา
          // ✅ ใช้ Tab
          new Paragraph({
            children: [
              new TextRun("\tชื่อผู้ขอใช้: "),
              new TextRun({
                text: item.nameUse || ".............",
                bold: true,
                underline: UnderlineType.DOTDASH, // ขีดเส้นใต้แบบจุดและขีด
              }),
              new TextRun(" \t\t ตำแหน่ง: "),
              new TextRun({
                text: `${item.statusUse}`,
                bold: true,
                underline: UnderlineType.DOTDASH, // ขีดเส้นใต้แบบจุดและขีด
              }),
            ],
            tabStops: [{ type: TabStopType.CENTER, position: 1000 }],
          }),

          new Paragraph({
            children: [
              new TextRun("ส่วนงาน/หน่วยงาน : "),
              new TextRun({
                text: `${item.agencyUse}`,
                bold: true,
                underline: UnderlineType.DOTDASH,
              }),
              new TextRun(" \t เบอร์ติดต่อ: ............."),
              // new TextRun(item.contactUse|| "............."),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),
          new Paragraph({
            children: [
              new TextRun(
                "มีความประสงค์จะใช้ห้องประชุมคณะพุทธศาสตร์ (รองรับจำนวนได้ 70 รูป/คน)"
              ),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),
          new Paragraph({
            children: [
              new TextRun(
                "อาคารสมเด็จพระพุฒาจารย์ (เกี่ยว อุปเสนมหาเถระ) โซน D อาคารเรียนรวม "
              ),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),
          new Paragraph({
            children: [
              new TextRun("\tเพื่อ: "),
              new TextRun({
                text: `${item.forUse}`,
                bold: true,
                underline: UnderlineType.DOTDASH,
              }),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),
          new Paragraph({
            children: [
              new TextRun("\tเรื่อง:"),
              new TextRun({
                text: `${item.subjectUse}`,
                bold: true,
                underline: UnderlineType.DOTDASH,
              }),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),

          new Paragraph({
            children: [
              new TextRun("วันที่ใช้: "),
              new TextRun({
                text: `${formatThaiDate(item.dateUse)}`,
                bold: true,
                underline: UnderlineType.DOTDASH,
              }),
              new TextRun("\tเวลา: "),
              new TextRun({
                text: `${item.beginTime} น. - ${item.toTime} น.`,
                bold: true,
                underline: UnderlineType.DOTDASH,
              }),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),

          new Paragraph({
            children: [
              new TextRun("มีจำนวนผู้เข้าใช้ห้องประชุม ประมาณ: "),
              new TextRun(`${item.amountUse} รูป/คน`),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),
          new Paragraph({
            children: [
              new TextRun("ต้องการใช้อุปกรณ์ ดังนี้ : "),
              new TextRun(
                Array.isArray(item.serviceUse) ? item.serviceUse.join(", ") : ""
              ),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `\t\t\tลงชื่อ..${item.nameUse}..ผู้ยืม`,
                alignment: AlignmentType.CENTER,
              }),
            ],
            tabStops: [{ type: TabStopType.CENTER, position: 3600 }],
          }),

          new Paragraph({
            children: [
              new TextRun("\tผู้ประสานงาน:"),
              new TextRun(item.coordinator),
              new TextRun(" \t เบอร์ติดต่อ: ............."),
              // new TextRun(item.contactUse),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),

          new Paragraph(""),

          createCommentBoxTwoColumn(
            "ความเห็นเจ้าหน้าที่: ",
            [
              "................................",
              "ห้องว่าง ( )   ห้องไม่ว่าง ( )",
              new Paragraph(""),
              "(.....................................................)",
              "(เจ้าหน้าที่ผู้ดำเนินงาน)",
              "----------/--------------/--------------",
            ],
            "ความเห็นสมควร:",
            [
              "อนุมัติ ( )   ไม่อนุมัติ ( )",
              new Paragraph(""),
              new Paragraph(""),
              "(.....................................................)",

              "(พระครูปลัดสมเกียรติ  กิตฺติญาโณ",
              "(เลขานุการสำนักงานคณะพุทธศาสตร์)",
              "----------/--------------/--------------",
            ]
          ),
          new Paragraph({
            children: [
              new TextRun("หมายเหตุ: "),
              new TextRun(
                "\t 1.ผู้ยืม(หน่วยงานที่ขอใช้ห้องประชุม)ต้องดูแดการใช้ห้องประชุมให้เป็นที่เรียบร้อย เมื่อใช้ห้องเสร็จแล้วให้แจ้งเจ้าหน้าที่เพื่อปิดระบบภายใน้ห้องประชุม"
              ),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),
          new Paragraph({
            children: [
              new TextRun("หมายเหตุ: "),
              new TextRun(
                "\t 2.ผู้ยืม(หน่วยงานที่ขอใช้ห้องประชุม)เมื่อใช้ห้องเสร็จเรียบรัอยแล้ว ให้แจ้งเจ้าหน้าที่เพื่อปิดระบบภายในห้องประชุม เพื่อปัองกันระบบขัดข้องในวันถัดไป"
              ),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),
          new Paragraph({
            children: [
              new TextRun(
                "\t 3.ผู้ยืม(หน่วยงานที่ขอใช้ห้องประชุม)ต้องติดต่อขอใช้ห้องก่อน อย่างน้อย 2 วัน"
              ),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `form_meeting_${item.id || "data"}.docx`);
}
