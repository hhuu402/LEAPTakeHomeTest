import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAkNv__zpf1r2nN0PWz4JB_4n8KvRQJFX4",
    authDomain: "leap-activities.firebaseapp.com",
    projectId: "leap-activities",
    storageBucket: "leap-activities.appspot.com",
    messagingSenderId: "835952134921",
    appId: "1:835952134921:web:ebd3ffd9bf812eed5521d8",
    measurementId: "G-1J5HEX8WRJ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);