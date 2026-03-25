import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrf75kfVMp9LIRboI_F7VsuIUP-oZ6TI",
  authDomain: "crud-project-dad17.firebaseapp.com",
  projectId: "crud-project-dad17",
  storageBucket: "crud-project-dad17.firebasestorage.app",
  messagingSenderId: "792795389680",
  appId: "1:792795389680:web:d1096e554326816a55ac35"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);