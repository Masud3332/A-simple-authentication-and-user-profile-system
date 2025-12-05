import admin from "firebase-admin";
import serviceAccount from "../firebase/serviceAccountKey.json" with { type: "json" };

const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "fir-d1036.appspot.com",

      });

      console.log("🔥 Firebase Admin Initialized");
    } else {
      console.log("⚡ Firebase already initialized");
    }

    return {
      admin,
      db: admin.firestore(),
      auth: admin.auth(),
      bucket: admin.storage().bucket(),
    };

  } catch (error) {
    console.error("❌ Firebase Initialization Error:", error);
    throw error;
  }
};

const firebase = initializeFirebase();

export const adminApp = firebase.admin;
export const db = firebase.db;
export const auth = firebase.auth;
export const bucket = firebase.bucket;
