import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function initializeFirebase() {
  if (getApps().length > 0) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  try {
    if (projectId && clientEmail && privateKey) {
      // 強力なクレンジング：引用符の除去、前後の空白削除、\nの復元
      const cleanKey = privateKey
        .trim()
        .replace(/^["']|["']$/g, '')
        .replace(/\\n/g, '\n');

      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: cleanKey,
        }),
      });
      console.log("Firebase initialized with Service Account");
    } else {
      // 環境変数が足りない場合は、ADC（環境のデフォルト権限）を試みる
      initializeApp();
      console.log("Firebase initialized with Default Credentials (ADC)");
    }
  } catch (error: any) {
    console.error("Firebase initialization failed, trying fallback:", error.message);
    // すでに初期化されている場合はスキップ、そうでなければ引数なしで初期化
    if (getApps().length === 0) {
      initializeApp();
    }
  }
}

initializeFirebase();

export const db = getFirestore();
