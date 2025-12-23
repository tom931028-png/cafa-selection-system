// firebase-connect.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- 舊的讀取 (保留以備不時之需，但主要改用監聽) ---
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

// --- 新增：即時監聽 (Real-time Listener) ---
export function listenToCloud(key, callback) {
    const docRef = doc(db, "CAFA_System", key);
    // onSnapshot 會建立一個長連線，當資料庫變動時，自動觸發 callback
    return onSnapshot(docRef, (doc) => {
        const val = doc.exists() ? doc.data().value : [];
        callback(val);
    });
}

export async function saveToCloud(key, data) {
    try {
        await setDoc(doc(db, "CAFA_System", key), {
            value: data,
            lastUpdate: new Date().toLocaleString()
        });
        // 這裡不需要 alert，因為監聽器會自動更新畫面
    } catch (error) {
        console.error("儲存失敗:", error);
        alert("連線錯誤，資料未儲存");
    }
}
