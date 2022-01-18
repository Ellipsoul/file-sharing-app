import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAG8Ko9FLtoq9Tr6jq7wS0l90xBpR-G7Xo",
  authDomain: "file-sharing-app-769e7.firebaseapp.com",
  projectId: "file-sharing-app-769e7",
  storageBucket: "file-sharing-app-769e7.appspot.com",
  messagingSenderId: "79988541629",
  appId: "1:79988541629:web:70614c891ff3354e1a4fd4",
  measurementId: "G-W8S5YFD85G",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider(); // Google Sign In

export const storage = getStorage(app);
