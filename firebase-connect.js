// firebase-connect.js
// 使用 ES Module 的 CDN 方式引入，適合直接在瀏覽器運作
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ★★★ Firebase 設定檔 ★★★
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
    // 1. 初始化 Firebase App
    app = initializeApp(firebaseConfig);
    
    // 2. 初始化 Firestore 資料庫
    db = getFirestore(app);
    
    // 3. 初始化 Authentication (預留未來升級使用)
    auth = getAuth(app);
    
    console.log("✅ Firebase 初始化成功 (Hosting/CDN Mode)");
} catch (e) {
    console.error("❌ Firebase 初始化失敗:", e);
    // 這裡不跳 alert，避免在某些網路環境一開啟就卡住
}

// ★★★ 匯出實體與功能 ★★★
// 這樣其他檔案可以用 import { db, auth } ... 取得原始物件
export { app, db, auth };


// --- Helper Functions (封裝常用功能) ---

// 1. 從雲端讀取資料 (一次性)
export async function loadFromCloud(key) {
    try {
        if (!db) throw new Error("Firebase 未連線");
        
        // 你的資料結構是放在 "CAFA_System" 這個 Collection 下
        const docRef = doc(db, "CAFA_System", key);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data().value;
        } else {
            console.warn(`[${key}] 資料不存在，回傳 null`);
            return null;
        }
    } catch (error) {
        console.error(`[${key}] 讀取失敗:`, error);
        return null;
    }
}

// 2. 寫入資料到雲端 (回傳 true/false 代表成功與否)
export async function saveToCloud(key, data) {
    if (!db) {
        alert("⚠️ Firebase 未連線，無法儲存！\n請檢查網路或 API Key 設定。");
        return false;
    }

    try {
        const docRef = doc(db, "CAFA_System", key);
        
        // 使用 setDoc 覆寫整份文件
        await setDoc(docRef, {
            value: data,
            lastUpdate: new Date().toLocaleString()
        });
        
        console.log(`✅ [${key}] 儲存成功`);
        return true;
        
    } catch (error) {
        console.error(`❌ [${key}] 儲存失敗:`, error);
        
        let msg = "連線錯誤，資料未儲存。";
        if (error.code === 'permission-denied') {
            msg = "⛔ 權限不足！請到 Firebase Console -> Firestore Database -> Rules\n將規則暫時設為: allow read, write: if true;";
        } else if (error.code === 'unavailable') {
            msg = "📡 網路斷線或 Firebase 服務無法連接。";
        }
        
        alert(`上傳失敗！\n\n原因: ${msg}`);
        return false;
    }
}

// 3. 即時監聽雲端資料 (當資料庫變動時，自動觸發 callback)
export function listenToCloud(key, callback) {
    if (!db) return;
    
    try {
        const docRef = doc(db, "CAFA_System", key);
        
        // onSnapshot 會回傳一個 unsubscribe 函數，呼叫它可停止監聽
        const unsubscribe = onSnapshot(docRef, (doc) => {
            const val = doc.exists() ? doc.data().value : null;
            callback(val);
        }, (error) => {
            console.warn(`⚠️ 監聽中斷 [${key}]:`, error.message);
        });

        return unsubscribe; // 讓外部可以停止監聽
    } catch (e) {
        console.error("監聽設定錯誤:", e);
    }
}
