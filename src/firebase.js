import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBFCsvzIs_TO26c9BXBEE-Z-XM2bCAzi9A",
    authDomain: "leap-project-12740.firebaseapp.com",
    projectId: "leap-project-12740",
    storageBucket: "leap-project-12740.appspot.com",
    messagingSenderId: "849175356722",
    appId: "1:849175356722:web:417fe8d44516dced59632b",
    measurementId: "G-64ZFZZVSXM"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);