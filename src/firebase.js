import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyC2_P_WBfMeX9uYOXDE14qWCK9IM0uicPQ",
  authDomain: "gratisbooksapi.firebaseapp.com",
  projectId: "gratisbooksapi",
  storageBucket: "gratisbooksapi.appspot.com",
  messagingSenderId: "305296327953",
  appId: "1:305296327953:web:62e06ef2db510115f0b8b0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
