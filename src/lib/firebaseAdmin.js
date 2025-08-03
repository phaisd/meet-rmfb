import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

// ตรวจสอบว่าตัวแปรแวดล้อมครบหรือไม่ (เพิ่ม debug ง่าย ๆ)
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  throw new Error(
    "Firebase Admin SDK environment variables are missing! Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
  );
}

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // privateKey อาจมีปัญหา \n ใน string ต้องแปลงกลับเป็น newline
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
};

// initializeApp จะสร้าง instance เพียงครั้งเดียว (singleton)
const adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

const adminAuth = getAuth(adminApp);
const adminDb = getDatabase(adminApp);

/**
 * ฟังก์ชันตั้ง custom claim role เป็น "adminfb" ให้กับ user ตาม email
 * @param {string} email
 */
async function setAdminRoleByEmail(email) {
  try {
    const user = await adminAuth.getUserByEmail(email);
    await adminAuth.setCustomUserClaims(user.uid, { role: "adminfb" });
    console.log(`✅ Set role "adminfb" for user: ${email}`);
  } catch (error) {
    console.error("❌ Error setting admin role:", error);
    throw error; // throw เพิ่มเติมถ้าต้องการให้ caller รู้ว่ามี error
  }
}

export { adminApp, adminAuth, adminDb, setAdminRoleByEmail };
