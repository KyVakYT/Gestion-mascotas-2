
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot,updateDoc, query, where, getDocs, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyC6nSIFqr4ej2d4IpGtQyfpk-RWZd8cvM4",
    authDomain: "clothing-store-467de.firebaseapp.com",
    projectId: "clothing-store-467de",
    storageBucket: "clothing-store-467de.appspot.com",
    messagingSenderId: "310254470773",
    appId: "1:310254470773:web:f9ae8f0bd9c4a6044cda3c",
    measurementId: "G-TF8829ZB8W"
  };


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const save = async (animal) => {
    try {
        await addDoc(collection(db, 'Mascotas'), animal);
    } catch (error) {
        console.error("Error saving document: ", error);
    }
};

export const getAll = (callback) => {
    try {
        return onSnapshot(collection(db, 'Mascotas'), callback);
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
};

export const remove = async (id) => {
    try {
        await deleteDoc(doc(db, 'Mascotas', id));
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};

export const selectOne = async (id) => {
    try {
        return await getDoc(doc(db, 'Mascotas', id));
    } catch (error) {
        console.error("Error selecting document: ", error);
    }
};

export const update = async (id, animal) => {
    try {
        await updateDoc(doc(db, 'Mascotas', id), animal);
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};
export const existencias = async (run, nommas) => {
    const q = query(collection(db, "Mascotas"), where("run", "==", run), where("nommas", "==", nommas));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
    
};