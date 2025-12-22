import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCp6U3KGshdut1rvR_omci7aGJkeu7YuXg",
  authDomain: "dailyhustle-b51b8.firebaseapp.com",
  projectId: "dailyhustle-b51b8",
  storageBucket: "dailyhustle-b51b8.firebasestorage.app",
  messagingSenderId: "450245509434",
  appId: "1:450245509434:web:1a4f2c7e966598e6121003",
  measurementId: "G-2LS41MFJ7T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Function to handle Google Sign In
export const signInWithGoogle = async () => {
  try {
    const { signInWithPopup } = await import("firebase/auth");
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    throw error;
  }
};