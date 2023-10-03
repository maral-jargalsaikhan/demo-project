import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage ,collection, getDoc } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB5Gq2GHje4HCOCQd9FBCs_J-6uRCD7x7I",
  authDomain: "next-auth-maral.firebaseapp.com",
  projectId: "next-auth-maral",
  storageBucket: "next-auth-maral.appspot.com",
  messagingSenderId: "534072543545",
  appId: "1:534072543545:web:d14f63eda7c7b6b86740e8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();