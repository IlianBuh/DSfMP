import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9rtMyF00MF5mkwZBpqGtSBOBbsGEOH-I",
  authDomain: "mobilki-bc0eb.firebaseapp.com",
  projectId: "mobilki-bc0eb",
  storageBucket: "mobilki-bc0eb.firebasestorage.app",
  messagingSenderId: "436502124365",
  appId: "1:436502124365:web:6f179a47e59e2d55384904"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);