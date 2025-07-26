import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9kPOTeZDp6FfbU2fxUVdbvd4yXSsayLg",
  authDomain: "scanbudget-4bfea.firebaseapp.com",
  projectId: "scanbudget-4bfea",
  storageBucket: "scanbudget-4bfea.firebasestorage.app",
  messagingSenderId: "1097734502752",
  appId: "1:1097734502752:web:45acd4f934f2c0f9980605",
  measurementId: "G-VNM9B04316"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Funções de serviço de autenticação
export const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);