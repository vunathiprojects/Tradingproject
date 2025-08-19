// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
// import { getAuth } from "firebase/auth";
// const firebaseConfig = {
//   apiKey: "AIzaSyAGLKy-2I2-qi3UrJUU7KmrN663wYLjh9w",
//   authDomain: "traderapp-7e61b.firebaseapp.com",
//   databaseURL: "https://traderapp-7e61b-default-rtdb.firebaseio.com/",
//   projectId: "traderapp-7e61b",
//   storageBucket: "traderapp-7e61b.appspot.com",
//   messagingSenderId: "122732936809",
//   appId: "1:122732936809:web:6e514da168467d5291acf8"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);
// export const auth = getAuth(app);

// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGLKy-2I2-qi3UrJUU7KmrN663wYLjh9w",
  authDomain: "traderapp-7e61b.firebaseapp.com",
  databaseURL: "https://traderapp-7e61b-default-rtdb.firebaseio.com/",
  projectId: "traderapp-7e61b",
  storageBucket: "traderapp-7e61b.appspot.com",
  messagingSenderId: "122732936809",
  appId: "1:122732936809:web:6e514da168467d5291acf8"
};

// ✅ Initialize app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Firebase services
export const db = getDatabase(app);
export const auth = getAuth(app);
