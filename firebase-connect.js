// firebase-connect.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ★★★ 請務必確認這裡填入的是您「新專案」的設定 ★★★
const firebaseConfig = {
  apiKey: "AIzaSyBen0PabmY0yKG3Frc_fbun29LpTqXK-Fs",
  authDomain: "cafa-db.firebaseapp.com",
  projectId: "cafa-db",
  storageBucket: "cafa-db.firebasestorage.app",
  messagingSenderId: "829038645486",
  appId: "1:829038645486:web:ac2692236c6310d4eba3ff",
  measurementId: "G-75BMEDYHQR"
};

let app, db;
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase 初始化成功");
} catch (e) {
    console.error("Firebase 初始化失敗:", e);
    // 這裡不跳 alert，避免一開啟就狂跳視窗
}

// 讀取
export async function loadFromCloud(key) {
    try {
        if (!db) return null;
        const docRef = doc(db, "CAFA_System", key);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data().value : null;
    } catch (error) {
        console.error("讀取失敗:", error);
        return null;
    }
}

// 寫入 (修正版：回傳布林值 true/false)
export async function saveToCloud(key, data) {
    if (!db) {
        alert("Firebase 未連線，無法儲存！\n請檢查 firebase-connect.js 的設定。");
        return false;
    }
    try {
        await setDoc(doc(db, "CAFA_System", key), {
            value: data,
            lastUpdate: new Date().toLocaleString()
        });
        console.log(`[${key}] 儲存成功`);
        return true; // ★ 成功回傳 true
    } catch (error) {
        console.error("儲存失敗詳細原因:", error);
        
        let msg = "連線錯誤，資料未儲存。";
        if (error.code === 'permission-denied') {
            msg = "⛔ 權限不足！請到 Firebase Console -> Firestore Database -> Rules 將規則設為 allow read, write: if true;";
        } else if (error.code === 'unavailable') {
            msg = "📡 網路斷線或 Firebase 服務無法連接。";
        } else if (error.message && error.message.includes("API key")) {
            msg = "🔑 API Key 無效，請檢查設定。";
        }
        
        alert(`上傳失敗！\n\n錯誤代碼: ${error.code}\n原因: ${msg}`);
        return false; // ★ 失敗回傳 false
    }
}

// 監聽
export function listenToCloud(key, callback) {
    if (!db) return;
    try {
        const docRef = doc(db, "CAFA_System", key);
        return onSnapshot(docRef, (doc) => {
            const val = doc.exists() ? doc.data().value : null;
            callback(val);
        }, (error) => {
            console.warn(`監聽 ${key} 失敗:`, error.code);
        });
    } catch (e) {
        console.error("監聽設定錯誤:", e);
    }
}
