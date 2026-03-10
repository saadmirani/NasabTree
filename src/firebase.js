import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyBLbsZS7BTRuEBXfum8ReOCZP56iUijlao",
   authDomain: "nasabtree-49659.firebaseapp.com",
   projectId: "nasabtree-49659",
   storageBucket: "nasabtree-49659.firebasestorage.app",
   messagingSenderId: "378679921590",
   appId: "1:378679921590:web:d028222aac39bd10e74f17",
   measurementId: "G-KDM5G3JMP7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);