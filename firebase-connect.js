// firebase-connect.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBen0PabmY0yKG3Frc_fbun29LpTqXK-Fs",
  authDomain: "cafa-db.firebaseapp.com",
  projectId: "cafa-db",
  storageBucket: "cafa-db.firebasestorage.app",
  messagingSenderId: "829038645486",
  appId: "1:829038645486:web:ac2692236c6310d4eba3ff",
  measurementId: "G-75BMEDYHQR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function loadFromCloud(key) {
    try {
        const docRef = doc(db, "CAFA_System", key);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data().value : null;
    } catch (error) {
        console.error("讀取失敗:", error);
        return null;
    }
}

export async function saveToCloud(key, data) {
    try {
        await setDoc(doc(db, "CAFA_System", key), {
            value: data,
            lastUpdate: new Date().toLocaleString()
        });
        console.log(`儲存成功: ${key}`);
    } catch (error) {
        console.error("儲存失敗:", error);
    }
}
