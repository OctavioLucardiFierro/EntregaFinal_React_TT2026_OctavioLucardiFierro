import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Las credenciales se leen desde variables de entorno (.env).
// Vite solo expone al navegador las variables con prefijo VITE_.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Solo inicializamos Firebase si las credenciales minimas estan presentes.
// Asi la app no se rompe si todavia no se configuro el archivo .env.
export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app = null;
let db = null;
let auth = null;

if (firebaseConfigurado) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  // Aviso util para el desarrollador en la consola del navegador.
  console.warn(
    "[Firebase] No se encontraron las variables de entorno. " +
      "Copia el archivo .env.example a .env y completa tus credenciales " +
      "de Firebase. La interfaz funciona, pero las secciones que usan " +
      "la base de datos mostraran un aviso."
  );
}

export { app, db, auth };
