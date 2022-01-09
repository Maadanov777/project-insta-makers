import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAyR5DQYybmyqHXPUYpli3bWCVYZ7VqEpE",
  authDomain: "instagram-861d6.firebaseapp.com",
  projectId: "instagram-861d6",
  storageBucket: "instagram-861d6.appspot.com",
  messagingSenderId: "65055650692",
  appId: "1:65055650692:web:8666fac8b8dd1e24a4a3d1",
  measurementId: "G-D191FKHV4V"
};

export const fire = initializeApp(firebaseConfig);
export const db = getFirestore(fire);