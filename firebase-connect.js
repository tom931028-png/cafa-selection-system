// firebase-connect.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ★★★ 請確認這裡的設定是否為您「新 Firebase 專案」的設定 ★★★
const firebaseConfig = {
  // 請去 Firebase Console -> Project Settings -> General -> 下方 Your apps 複製這一段
  apiKey: "請填入新的API_KEY", 
  authDomain: "你的專案ID.firebaseapp.com",
  projectId: "你的專案ID",
  storageBucket: "你的專案ID.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};

// 初始化
let app, db;
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase 初始化成功");
} catch (e) {
    console.error("Firebase 初始化失敗:", e);
    alert("Firebase 設定有誤，請檢查 firebase-connect.js");
}

// 讀取 (單次)
export async function loadFromCloud(key) {
    try {
        const docRef = doc(db, "CAFA_System", key);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data().value : null;
    } catch (error) {
        console.error("讀取失敗:", error);
        // 不跳 alert 避免干擾，改為 console 顯示
        return null;
    }
}

// 寫入 (改良版：顯示詳細錯誤)
export async function saveToCloud(key, data) {
    try {
        await setDoc(doc(db, "CAFA_System", key), {
            value: data,
            lastUpdate: new Date().toLocaleString()
        });
        console.log(`[${key}] 儲存成功`);
    } catch (error) {
        console.error("儲存失敗詳細原因:", error);
        
        // 判斷錯誤類型並提示使用者
        let msg = "連線錯誤，資料未儲存。";
        if (error.code === 'permission-denied') {
            msg = "⛔ 權限不足！請檢查 Firestore Rules 是否已設為 'allow read, write: if true;'";
        } else if (error.code === 'unavailable') {
            msg = "📡 網路斷線或 Firebase 服務無法連接。";
        } else if (error.code === 'invalid-argument') {
            msg = "❌ 資料格式錯誤 (可能是 Excel 含有特殊符號或 undefined)。";
        } else if (error.message.includes("API key")) {
            msg = "🔑 API Key 無效，請檢查 firebase-connect.js 設定。";
        }
        
        alert(`上傳失敗！\n\n錯誤代碼: ${error.code}\n原因: ${msg}`);
    }
}

// 即時監聽
export function listenToCloud(key, callback) {
    try {
        const docRef = doc(db, "CAFA_System", key);
        return onSnapshot(docRef, (doc) => {
            const val = doc.exists() ? doc.data().value : null;
            callback(val);
        }, (error) => {
            console.error(`監聽 ${key} 失敗:`, error);
            if(error.code === 'permission-denied') {
                console.warn("⚠️ 監聽失敗：權限不足。請檢查 Firestore Rules。");
            }
        });
    } catch (e) {
        console.error("監聽設定錯誤:", e);
    }
}
