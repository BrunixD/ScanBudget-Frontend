// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Importamos as funções que vamos usar
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Função para registar um novo utilizador
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Utilizador registado com sucesso:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Erro no registo:", error.message);
    // Lançamos o erro para que o nosso formulário o possa apanhar e mostrar ao utilizador
    throw error;
  }
};

// Função para fazer login de um utilizador existente
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login bem-sucedido:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Erro no login:", error.message);
    throw error;
  }
};

// Função para fazer logout
export const logout = () => {
  signOut(auth);
};