import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "firebase/compat/storage";
import "firebase/compat/auth";
import "firebase/compat/firestore";import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyDhIYiRjT5bGzzlzPgfTIWZC6O557dORwo",
  authDomain: "user-db-9bd20.firebaseapp.com",
  projectId: "user-db-9bd20",
  storageBucket: "user-db-9bd20.appspot.com",
  messagingSenderId: "683126346057",
  appId: "1:683126346057:web:c7be9316c9011f2d7c0a98"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { app, db, auth };