// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdRU8N4-v2rcbKrnEFrESPWLRy91OMAU0",
  authDomain: "vconnect-8de17.firebaseapp.com",
  projectId: "vconnect-8de17",
  storageBucket: "vconnect-8de17.firebasestorage.app",
  messagingSenderId: "505939014385",
  appId: "1:505939014385:web:36e5b5118622857d7d6f50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
