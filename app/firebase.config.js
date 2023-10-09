import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3J1OAMWtYwoVLzl_1ZKg4UHBayexX38M",
  authDomain: "fir-test-d5e7d.firebaseapp.com",
  projectId: "fir-test-d5e7d",
  storageBucket: "fir-test-d5e7d.appspot.com",
  messagingSenderId: "1025370731761",
  appId: "1:1025370731761:web:0604387608d0a042f4a550",

  // apiKey: "AIzaSyB5Gq2GHje4HCOCQd9FBCs_J-6uRCD7x7I",
  // authDomain: "next-auth-maral.firebaseapp.com",
  // projectId: "next-auth-maral",
  // storageBucket: "next-auth-maral.appspot.com",
  // messagingSenderId: "534072543545",
  // appId: "1:534072543545:web:d14f63eda7c7b6b86740e8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
