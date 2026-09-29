import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPGsD_ZZpkzWVDh_Vz4Wy9LovIXYdSrGw",
  authDomain: "interact-ai-89a55.firebaseapp.com",
  projectId: "interact-ai-89a55",
  storageBucket: "interact-ai-89a55.firebasestorage.app",
  messagingSenderId: "518478872969",
  appId: "1:518478872969:web:aa67823d7b670354d92158",
  measurementId: "G-ZS5JMVJ1CE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { data: { user: result.user }, error: null };
  } catch (error) {
    console.error('Google OAuth Error:', error.message);
    return { data: null, error };
  }
};

export const signInWithGitHub = async () => {
  console.warn('GitHub Auth not yet implemented in Firebase');
  return { data: null, error: new Error('Not implemented') };
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { data: { user: result.user }, error: null };
  } catch (error) {
    console.error('Email Login Error:', error.message);
    return { data: null, error };
  }
};

export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { data: { user: result.user }, error: null };
  } catch (error) {
    console.error('Email Signup Error:', error.message);
    return { data: null, error };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Logout Error:', error.message);
    return { error };
  }
};
