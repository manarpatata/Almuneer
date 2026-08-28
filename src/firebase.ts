// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIfeaRYILuSaw0xhhY1YnT9_ZAEI0eLd0",
  authDomain: "al-muneer-7a876.firebaseapp.com",
  projectId: "al-muneer-7a876",
  storageBucket: "al-muneer-7a876.firebasestorage.app",
  messagingSenderId: "902950051134",
  appId: "1:902950051134:web:0dd5f18a3bd9314134a06f",
  measurementId: "G-8Y7255VB2M"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();