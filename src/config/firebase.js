import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

const isPlaceholder =
  !firebaseConfig.apiKey ||
  firebaseConfig.apiKey === "your-api-key" ||
  firebaseConfig.projectId === "your-project-id";

let app, auth, googleProvider, db;
let initError = null;

function initializeFirebase() {
  if (isPlaceholder) {
    const msg =
      "Firebase is not configured. Copy .env.example to .env and add your Firebase project credentials. " +
      "See FIREBASE_SETUP.md for steps.";
    initError = new Error(msg);
    console.error(msg);
    throw initError;
  }

  if (app) return;

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    initError = error;
    throw error;
  }
}

if (!isPlaceholder) {
  initializeFirebase();
}

export const getAuthInstance = () => {
  if (!auth) initializeFirebase();
  if (initError) throw initError;
  return auth;
};

export const getGoogleProvider = () => {
  if (!googleProvider) initializeFirebase();
  if (initError) throw initError;
  return googleProvider;
};

export const getDb = () => {
  if (!db) initializeFirebase();
  if (initError) throw initError;
  return db;
};

export { auth, googleProvider, db };
export default app;
