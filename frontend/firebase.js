import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCV3z-v-blWjkpBKhOSkjnmtNGkYscIO_I",
  authDomain: "fingen-78bc4.firebaseapp.com",
  projectId: "fingen-78bc4",
  storageBucket: "fingen-78bc4.firebasestorage.app",
  messagingSenderId: "260373844448",
  appId: "1:260373844448:web:2ba81813b7c5572b8adb85"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);