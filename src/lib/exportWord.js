import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";

function formatThaiDate(dateStr) {
  if (!dateStr) return "";
  const monthsThai = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];
  const [year, month, day] = dateStr.split("-");
  const thaiYear = parseInt(year) + 543;
  const thaiMonth = monthsThai[parseInt(month) - 1];
  return `วันที่ ${parseInt(day)} ${thaiMonth} ${thaiYear}`;
}

export async function exportToWord(item) {
  // โค้ดเต็มแบบที่ผมให้ด้านบน
  const exportToWord = async (item) => {
    const today = new Date();
    const printedDate = today.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // แปลงวันที่ใช้งานให้อยู่ในรูปแบบไทย
    const thaiDateUse = formatThaiDate(item.dateUse);

    // โหลดรูปโลโก้จาก public
    const imageRes = await fetch("/logo.png");
    const imageBlob = await imageRes.blob();
    const reader = new FileReader();
    const base64Image = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(imageBlob);
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // โลโก้
            new Paragraph({
              children: [
                new ImageRun({
                  data: Uint8Array.from(atob(base64Image), c => c.charCodeAt(0)),
                  transformation: { width: 80, height: 80 },
                }),
              ],
              alignment: "center",
            }),
            new Paragraph({
              text: "ใบขอใช้ห้องประชุมประจำคณะ",
              heading: "Heading1",
              alignment: "center",
            }),
            new Paragraph(`วันที่พิมพ์รายงาน: ${printedDate}`),
            new Paragraph(""),

            // ตาราง
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("ชื่อ")], width: { size: 20, type: "pct" } }),
                    new TableCell({ children: [new Paragraph(item.nameUse)] }),
                    new TableCell({ children: [new Paragraph("ตำแหน่ง")], width: { size: 20, type: "pct" } }),
                    new TableCell({ children: [new Paragraph(item.statusUse)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("ส่วนงาน")] }),
                    new TableCell({ children: [new Paragraph(item.agencyUse)] }),
                    new TableCell({ children: [new Paragraph("เบอร์ติดต่อ")] }),
                    new TableCell({ children: [new Paragraph(item.contactUse)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("อุปกรณ์ที่ใช้")] }),
                    new TableCell({
                      children: [
                        new Paragraph(Array.isArray(item.serviceUse) ? item.serviceUse.join(", ") : ""),
                      ],
                      columnSpan: 3,
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("เพื่อ")] }),
                    new TableCell({ children: [new Paragraph(item.forUse)], columnSpan: 3 }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("เรื่อง")] }),
                    new TableCell({ children: [new Paragraph(item.subjectUse)], columnSpan: 3 }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("จำนวนผู้เข้าร่วม")] }),
                    new TableCell({ children: [new Paragraph(`${item.amountUse} คน`)] }),
                    new TableCell({ children: [new Paragraph("วันที่ใช้")] }),
                    new TableCell({ children: [new Paragraph(thaiDateUse)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("เริ่มเวลา")] }),
                    new TableCell({ children: [new Paragraph(item.beginTime)] }),
                    new TableCell({ children: [new Paragraph("ถึงเวลา")] }),
                    new TableCell({ children: [new Paragraph(item.toTime)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("ผู้ประสานงาน")] }),
                    new TableCell({ children: [new Paragraph(item.coordinator)] }),
                    new TableCell({ children: [new Paragraph("ติดต่อ")] }),
                    new TableCell({ children: [new Paragraph(item.contactUse)] }),
                  ],
                }),
              ],
            }),

            new Paragraph(""),
            new Paragraph("ความเห็นเจ้าหน้าที่: ........................................................"),
            new Paragraph("ห้องว่าง ( )   ห้องไม่ว่าง ( )"),
            new Paragraph("(.....................................................)"),
            new Paragraph("(เจ้าหน้าที่ผู้ดำเนินงาน)"),
            new Paragraph("----------/--------------/--------------"),
            new Paragraph(""),
            new Paragraph("ความเห็นสมควร:"),
            new Paragraph("อนุมัติ ( )   ไม่อนุมัติ ( )"),
            new Paragraph("(.....................................................)"),
            new Paragraph("(เลขานุการสำนักงาน)"),
            new Paragraph("----------/--------------/--------------"),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `form_meeting_${item.id || "data"}.docx`);
  };

}
