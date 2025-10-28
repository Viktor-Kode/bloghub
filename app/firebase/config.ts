// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDccmyx96ZvkUKjN3OvN_m4X2G118jQMyQ",
  authDomain: "bloggy-89821.firebaseapp.com",
  projectId: "bloggy-89821",
  storageBucket: "bloggy-89821.firebasestorage.app",
  messagingSenderId: "1048278102803",
  appId: "1:1048278102803:web:bb392e52357c6a3d1ee0e6",
  measurementId: "G-E3E7S8Q6XP"
};

// Initialize Firebase
const app = !getApps().length? initializeApp(firebaseConfig):getApp();
const auth = getAuth(app);
const db = getFirestore(app)

export {app, auth, db}