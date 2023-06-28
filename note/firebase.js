// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw7vj79LuS4VYNLMCH6oKU0Hfop9UPPNw",
  authDomain: "react-notes-fab6e.firebaseapp.com",
  projectId: "react-notes-fab6e",
  storageBucket: "react-notes-fab6e.appspot.com",
  messagingSenderId: "259731095429",
  appId: "1:259731095429:web:cad90f3d94233008f90eec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")