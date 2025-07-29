import { db } from "@/lib/firebaseConfig";
import { ref, get, query, orderByChild, limitToLast, push, update, remove } from "firebase/database";

export async function getAllMeets() {
  const snapshot = await get(ref(db, "Request_Meeting"));
  const data = snapshot.exists() ? snapshot.val() : {};
  // แปลง object → array พร้อม id
  return Object.entries(data).map(([id, value]) => ({ id, ...value }));
}

// export async function getMeetsItem(meetsId) {
//   const snapshot = await get(ref(db, `Request_Meeting/${meetsId}`));
//   if (!snapshot.exists()) return null;

//   return { id: meetsId, ...snapshot.val() };
// }

//03
export async function getLatestMeets() {
  try {
    const meetsRef = ref(db, "Request_Meeting");

    // Query: เรียงตาม dateUse และดึงล่าสุด 4 รายการ
    const meetsQuery = query(meetsRef, orderByChild("dateUse"), limitToLast(4));

    const snapshot = await get(meetsQuery);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();

    // แปลง object => array และจัดเรียงจากใหม่ -> เก่า
    const meetsArray = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));

    meetsArray.sort((a, b) => {
      const dateA = new Date(a.dateUse);
      const dateB = new Date(b.dateUse);
      return dateB - dateA;
    });

    return meetsArray;
  } catch (error) {
    console.error("getLatestMeets error:", error);
    return [];
  }
}

//
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