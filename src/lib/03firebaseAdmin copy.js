import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
};

const adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

const adminAuth = getAuth(adminApp);
const adminDb = getDatabase(adminApp);

async function setAdminRoleByEmail(email) {
  try {
    const user = await adminAuth.getUserByEmail(email);
    await adminAuth.setCustomUserClaims(user.uid, { role: "adminfb" });
    console.log(`✅ Set role "adminfb" for user: ${email}`);
  } catch (error) {
    console.error("❌ Error setting admin role:", error);
  }
}

export { adminApp, adminAuth, adminDb, setAdminRoleByEmail };

