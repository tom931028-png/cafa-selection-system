// firebase-connect.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBen0PabmY0yKG3Frc_fbun29LpTqXK-Fs",
  authDomain: "cafa-db.firebaseapp.com",
  projectId: "cafa-db",
  storageBucket: "cafa-db.firebasestorage.app",
  messagingSenderId: "829038645486",
  appId: "1:829038645486:web:ac2692236c6310d4eba3ff",
  measurementId: "G-75BMEDYHQR"
};

let app, db, auth;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("✅ Firebase 連線成功");
} catch (e) {
    console.error("❌ Firebase 初始化失敗:", e);
}

export { app, db, auth };

// --- 共用功能 ---

export async function loadFromCloud(key) {
    try {
        if (!db) throw new Error("資料庫未連線");
        const docRef = doc(db, "CAFA_System", key);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data().value : null;
    } catch (error) {
        console.error(`[讀取失敗] ${key}:`, error);
        return null;
    }
}

export async function saveToCloud(key, data) {
    if (!db) { alert("⚠️ 資料庫未連線！"); return false; }
    try {
        const docRef = doc(db, "CAFA_System", key);
        await setDoc(docRef, { value: data, lastUpdate: new Date().toLocaleString() });
        console.log(`✅ [儲存成功] ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ [儲存失敗] ${key}:`, error);
        let msg = "存檔失敗，請檢查權限。";
        if(error.code === 'permission-denied') msg = "權限不足！請去 Firebase Console 開啟 Rules (設為 true)。";
        alert(msg);
        return false;
    }
}

export function listenToCloud(key, callback) {
    if (!db) return;
    return onSnapshot(doc(db, "CAFA_System", key), (doc) => {
        callback(doc.exists() ? doc.data().value : null);
    });
}
