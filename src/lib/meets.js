import { db } from "@/lib/firebaseConfig";
import { ref, get, query, orderByChild, limitToLast } from "firebase/database";

// รายชื่อเดือนภาษาไทยแบบเรียงตามเลขเดือน (01–12)
const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

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

export async function getMeetsItem(meetsId) {
  const snapshot = await get(ref(db, `Request_Meeting/${meetsId}`));
  if (!snapshot.exists()) return null;

  return { id: meetsId, ...snapshot.val() };
}

export async function getLatestMeets() {
  const meetsRef = query(
    ref(db, "Request_Meeting"),
    orderByChild("dateUse"),
    limitToLast(3)
  );
  const snapshot = await get(meetsRef);
  if (!snapshot.exists()) return [];

  return Object.entries(snapshot.val())
    .map(([id, value]) => ({ id, ...value }))
    .reverse(); // Firebase orders oldest → newest
}

export async function getAvailableMeetsYears() {
  const snapshot = await get(ref(db, "Request_Meeting"));
  if (!snapshot.exists()) return [];

  const rawData = snapshot.val();
  const yearsSet = new Set();

  Object.values(rawData).forEach((item) => {
    if (item.date) {
      const year = item.date.substring(0, 4); // Extract year from "YYYY-MM-DD"
      yearsSet.add(year);
    }
  });
  return Array.from(yearsSet).sort();
}

export async function getAvailableMeetsMonths(year) {
  const snapshot = await get(ref(db, "Request_Meeting"));
  if (!snapshot.exists()) return [];

  const rawData = snapshot.val();
  const monthsSet = new Set();

  Object.values(rawData).forEach((item) => {
    if (item.date && item.date.startsWith(year)) {
      const month = item.date.substring(5, 7); // positions 5-6 = month in "YYYY-MM-DD"
      monthsSet.add(month);
    }
  });

  // return Array.from(monthsSet).sort(); // e.g. ["01", "03", "07"]
  // เรียงตามลำดับเดือน และแปลงเป็นชื่อเดือนภาษาไทย
  return Array.from(monthsSet)
    .sort((a, b) => a - b)
    .map((m) => thaiMonths[m - 1]); // index เริ่มที่ 0
}

export async function getMeetsForYear(year) {
  const snapshot = await get(ref(db, "Request_Meeting"));
  if (!snapshot.exists()) return [];

  const rawData = snapshot.val();

  const filtered = Object.entries(rawData)
    .filter(([_, value]) => value.date?.startsWith(year))
    .map(([id, value]) => ({ id, ...value }))
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // DESC by date

  return filtered;
}

export async function getMeetsForYearAndMonth(year, month) {
  const snapshot = await get(ref(db, "Request_Meeting"));
  if (!snapshot.exists()) return [];

  const rawData = snapshot.val();

  const filtered = Object.entries(rawData)
    .filter(([_, value]) => {
      const date = value.date;
      return typeof date === "string" && date.startsWith(`${year}-${month}`);
    })
    .map(([id, value]) => ({ id, ...value }))
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // DESC by date

  return filtered;
}

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
