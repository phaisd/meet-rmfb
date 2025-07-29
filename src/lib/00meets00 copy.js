import { db } from "@/lib/firebaseConfig";
import { ref, get, query, orderByChild, limitToLast, push, update, remove } from "firebase/database";

// รายชื่อเดือนภาษาไทยแบบเรียงตามเลขเดือน (01–12)
// const thaiMonths = [
//   "มกราคม",
//   "กุมภาพันธ์",
//   "มีนาคม",
//   "เมษายน",
//   "พฤษภาคม",
//   "มิถุนายน",
//   "กรกฎาคม",
//   "สิงหาคม",
//   "กันยายน",
//   "ตุลาคม",
//   "พฤศจิกายน",
//   "ธันวาคม",
// ];

// // แผนที่ชื่อเดือนภาษาอังกฤษ → เลขเดือน 2 หลัก
// const monthOrder = {
//   January: "01",
//   February: "02",
//   March: "03",
//   April: "04",
//   May: "05",
//   June: "06",
//   July: "07",
//   August: "08",
//   September: "09",
//   October: "10",
//   November: "11",
//   December: "12",
// };

export async function getAllNews() {
  const meetsRef = ref(db, "Request_Meeting");
  const snapshot = await get(meetsRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();
  // Convert object to array
  const meetsArray = Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }));

  return meetsArray;
}

// export async function getMeetsItem(meetsId) {
//   const snapshot = await get(ref(db, `Request_Meeting/${meetsId}`));
//   if (!snapshot.exists()) return null;

//   return { id: meetsId, ...snapshot.val() };
// }

export async function getLatestMeets() {
  const meetsQuery = query(
    ref(db, "Request_Meeting"),
    orderByChild("dateUse"),
    limitToLast(4)
  );

  const snapshot = await get(meetsQuery);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  // Convert object to array and sort by date descending
  const meetsArray = Object.entries(data)
    .map(([id, value]) => ({
      id,
      ...value,
    }))
    .sort((a, b) => new Date(b.dateUse) - new Date(a.dateUse)); // เรียงจากใหม่ -> เก่า

  return meetsArray;
}

//12
// export async function getLatestMeets() {
//   const newsRef = query(
//     ref(db, "Request_Meeting"),
//     orderByChild("dateUse"),
//     limitToLast(3)
//   );
//   const snapshot = await get(newsRef);
//   if (!snapshot.exists()) return [];

//   // แปลงข้อมูลเป็น array และเรียงจากใหม่ไปเก่า
//   return Object.entries(snapshot.val())
//     .map(([id, value]) => ({ id, ...value }))
//     .sort((a, b) => new Date(b.dateUse) - new Date(a.dateUse));
// }


export async function getAvailableMeetsYears() {
  const snapshot = await get(ref(db, "Request_Meeting"));
  if (!snapshot.exists()) return [];

  const rawData = snapshot.val();
  const yearsSet = new Set();

  Object.values(rawData).forEach((item) => {
    if (item.dateUse) {
      // ตัวอย่าง dateUse: "23-July-2025"
      const parts = item.dateUse.split("-");
      if (parts.length === 3) {
        const year = parts[2]; // index 2 คือ year
        if (year.match(/^\d{4}$/)) {
          yearsSet.add(year);
        }
      }
    }
  });

  return Array.from(yearsSet).sort(); // เรียงปีจากน้อย → มาก
}

// ยังไม่ได้
export async function getAvailableMeetsMonths(year) {
  const snapshot = await get(ref(db, "Request_Meeting"));
  if (!snapshot.exists()) return [];

  const rawData = snapshot.val();
  const monthsSet = new Set();

  Object.values(rawData).forEach((item) => {
    if (item.dateUse) {
      const parts = item.dateUse.split("-"); // ["dd", "MMMM", "yyyy"]
      if (parts.length === 3) {
        const [day, monthName, yearStr] = parts;
        if (yearStr === year) {
          monthsSet.add(monthName);
        }
      }
    }
  });

  // เรียงลำดับเดือน (January → December)
  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // const thaiMonths = [
  //   "มกราคม",
  //   "กุมภาพันธ์",
  //   "มีนาคม",
  //   "เมษายน",
  //   "พฤษภาคม",
  //   "มิถุนายน",
  //   "กรกฎาคม",
  //   "สิงหาคม",
  //   "กันยายน",
  //   "ตุลาคม",
  //   "พฤศจิกายน",
  //   "ธันวาคม",
  // ];
  return Array.from(monthsSet)
    .sort
    ((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
  // (a, b) => thaiMonths.indexOf(a) - thaiMonths.indexOf(b)
  // ();
}

export async function getMeetsForYear(year) {
  const snapshot = await get(ref(db, "Request_Meeting"));
  if (!snapshot.exists()) return [];

  const rawData = snapshot.val();
  const newsArray = Object.entries(rawData).map(([id, value]) => ({
    id,
    ...value,
  }));

  const parseEnglishDate = (dateStr) => {
    // เช่น "23-July-2025"
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      // Convert to ISO format: yyyy-mm-dd
      const [day, monthName, yearStr] = parts;
      const monthOrder = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthIndex = monthOrder.indexOf(monthName);
      if (monthIndex !== -1) {
        // Pad month and day
        const mm = String(monthIndex + 1).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        return new Date(`${yearStr}-${mm}-${dd}`);
      }
    }
    return new Date(0); // fallback ถ้าแปลงไม่สำเร็จ
  };

  const filteredNews = newsArray
    .filter((item) => {
      if (!item.dateUse) return false;
      const parts = item.dateUse.split("-");
      return parts.length === 3 && parts[2] === year;
    })
    .sort((a, b) => parseEnglishDate(b.dateUse) - parseEnglishDate(a.dateUse));

  return filteredNews;
}

//ยังใช่ไม่ได้
export async function getMeetsForYearAndMonth(year, month) {
  const snapshot = await get(ref(db, "Request_Meeting"));
  if (!snapshot.exists()) return [];

  const rawData = snapshot.val();
  const newsArray = Object.entries(rawData).map(([id, value]) => ({
    id,
    ...value,
  }));

  // กรองข้อมูลตามปีและเดือน (month เป็นชื่อเต็มภาษาอังกฤษ เช่น "July")
  const filteredNews = newsArray
    .filter((item) => {
      if (!item.dateUse) return false;
      const parts = item.dateUse.split("-"); // ["dd", "MMMM", "yyyy"]
      if (parts.length !== 3) return false;

      const [day, monthName, yearStr] = parts;
      return yearStr === year && monthName === month;
    })
    .sort((a, b) => {
      // เรียงตามวันที่ใหม่ไปเก่า
      const dateA = new Date(a.dateUse);
      const dateB = new Date(b.dateUse);
      return dateB - dateA;
    });

  return filteredNews;
}

//โค๊ดเดิม
// export async function addNews(news, image) {
//   const { slug, title, content, date } = news;
//   const insert = db.prepare(
//     "INSERT INTO news (slug,title,content,date,image) VALUES(?,?,?,?,?)"
//   );

//   const result = insert.run(slug, title, content, date, "");
//   const id = result.lastInsertRowid;
//   const imageFile = `news-${id}.${image.name.split(".").pop()}`;

//   if (image) {
//     await fs.writeFile(
//       `@/../public/images/news/${imageFile}`,
//       Buffer.from(await image.arrayBuffer())
//     );
//     db.prepare("UPDATE news SET image = ? WHERE id = ?").run(imageFile, id);
//   }
//   return { id, slug, title, content, date, image: imageFile };
// }

// export async function updateNews(news, file) {
//   console.log(news);

//   const { id, slug, title, content, date } = news;
//   if (file.size > 0) {
//     let { image } = db.prepare("SELECT image FROM news WHERE id = ?").get(id);
//     await fs.unlink(`@/../public/images/news/${image}`).catch(() => {});
//     const imageFile = `news-${id}.${file.name.split(".").pop()}`;
//     await fs.writeFile(
//       `@/../public/images/news/${imageFile}`,
//       Buffer.from(await file.arrayBuffer())
//     );
//     db.prepare(
//       "UPDATE news SET slug = ?, title = ? , content = ?,date = ?,image = ? WHERE id = ?"
//     ).run(slug, title, content, date, imageFile, id);

//     return { ...news, image: imageFile };
//   } else {
//     db.prepare(
//       "UPDATE news SET slug = ?, title = ?, content = ?, date = ? WHERE id = ?"
//     ).run(slug, title, content, date, id);
//     return news;
//   }
// }

// export async function deleteNews(id) {
//   const { image } = db.prepare("SELECT * FROM news WHERE id = ?").get(id);
//   db.prepare("DELETE FROM news WHERE id = ?").run(id);
//   await fs.unlink(`@/../public/images/news/${image}`).catch(() => {});
// }

//addmeets01
// เพิ่มข้อมูลลง Firebase พร้อมสร้าง currentTime และ id อัตโนมัติ
export async function addMeets(meetsItem) {
  const currentTime = Date.now();

  const data = {
    ...meetsItem,
    currentTime,
  };

  try {
    const meetsRef = ref(db, "Request_Meeting");
    const newRef = await push(meetsRef, data);
    return { success: true, id: newRef.key };
  } catch (error) {
    console.error("Firebase Add Error:", error);
    return { success: false, error: error.message };
  }
}

//update02
export async function updateMeets(Id, meetData) {
  try {
    const meetRef = ref(db, `Request_Meeting/${Id}`);
    await update(meetRef, meetData);
    return { success: true };
  } catch (error) {
    console.error("Firebase update error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMeets(Id) {
  if (!Id) {
    return { success: false, error: "Missing ID" };
  }

  const meetRef = ref(db, `Request_Meeting/${Id}`);

  try {
    await remove(meetRef);
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: error.message };
  }
}