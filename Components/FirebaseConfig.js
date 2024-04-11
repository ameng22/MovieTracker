import { initializeApp } from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyARxZlY5uSdiJ8L_AosqMXmzHXSGtYjnA4",
  authDomain: "info6132-1c541.firebaseapp.com",
  databaseURL: "https://info6132-1c541-default-rtdb.firebaseio.com",
  projectId: "info6132-1c541",
  storageBucket: "info6132-1c541.appspot.com",
  messagingSenderId: "59809252879",
  appId: "1:59809252879:web:e95c63dff2ab55d748057a"
};

const app = initializeApp(firebaseConfig);

export default app;