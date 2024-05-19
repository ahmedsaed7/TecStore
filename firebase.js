import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "firebase/compat/storage";
import "firebase/compat/auth";
import "firebase/compat/firestore";import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyDYHj3--wU0PyqmTfIphvfbWzO1dKmvgX4",
  authDomain: "tecstore-fb555.firebaseapp.com",
  projectId: "tecstore-fb555",
  storageBucket: "tecstore-fb555.appspot.com",
  messagingSenderId: "650535664502",
  appId: "1:650535664502:web:b316b426cf61ddcfa85857",
  measurementId: "G-JPT4PY8321"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { app, db, auth };