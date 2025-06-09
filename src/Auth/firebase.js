import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJ1sQqCPXYFIv-FM1En6UFJi5lpiGqoVg",
  authDomain: "cinefix-lab.firebaseapp.com",
  projectId: "cinefix-lab",
  storageBucket: "cinefix-lab.firebasestorage.app",
  messagingSenderId: "351399809714",
  appId: "1:351399809714:web:85558352ac7064bbf1efab",
  measurementId: "G-75XS6MN8S7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };