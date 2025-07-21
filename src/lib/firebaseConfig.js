// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// function FirebaseConfig() {
const firebaseConfig = {
  apiKey: "AIzaSyBiIA1iwiMf-31bPgOjRBQnF1LWpggWHz4",
  authDomain: "crud-re-service-2025.firebaseapp.com",
  databaseURL: "https://crud-re-service-2025-default-rtdb.firebaseio.com",
  projectId: "crud-re-service-2025",
  storageBucket: "crud-re-service-2025.firebasestorage.app",
  messagingSenderId: "573147958898",
  appId: "1:573147958898:web:8dd2f42f26849c80da7ceb",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
// return getDatabase(app);
// }
// export default FirebaseConfig;

export const db = getDatabase(app);
