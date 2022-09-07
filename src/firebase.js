import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBNY5PixK947f9BMqNiAmiVYliMOolsO0k",
    authDomain: "leap-project-d3f7c.firebaseapp.com",
    projectId: "leap-project-d3f7c",
    storageBucket: "leap-project-d3f7c.appspot.com",
    messagingSenderId: "916591176978",
    appId: "1:916591176978:web:0d11c8d61fc36285ba97cb",
    measurementId: "G-SKG8GWB5H9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);