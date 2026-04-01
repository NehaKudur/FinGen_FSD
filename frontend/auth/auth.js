import { auth, db } from "../firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Returns current user data from Firestore
export async function getCurrentUser() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          resolve({ uid: user.uid, ...docSnap.data() });
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
}

// Call this on any page to redirect to login if not logged in
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/frontend/auth/login.html";
  }
  return user;
}

// Logout function
export async function logoutUser() {
  await auth.signOut();
  window.location.href = "/frontend/auth/login.html";
}