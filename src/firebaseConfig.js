// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYIIWG_toBkmtrJYX8oyyPTCKTK86qmLM",
    authDomain: "registeragriedge.firebaseapp.com",
    databaseURL: "https://registeragriedge-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "registeragriedge",
    storageBucket: "registeragriedge.firebasestorage.app",
    messagingSenderId: "737540231442",
    appId: "1:737540231442:web:3a046e24e88424fb3a23cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;