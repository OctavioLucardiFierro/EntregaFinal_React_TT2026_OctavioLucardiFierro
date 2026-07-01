// ----------------------------------------------------------------------------
// Script para cargar el catalogo inicial de juegos en Firestore.
// Uso:  npm run seed   (requiere el archivo .env ya configurado)
// ----------------------------------------------------------------------------
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { juegosIniciales } from "../src/data/juegos.js";

// Cargamos las variables de entorno desde .env (Node 20.12+)
try {
  process.loadEnvFile(".env");
} catch {
  console.error(
    "No se encontro el archivo .env. Copialo desde .env.example y completalo con tus credenciales."
  );
  process.exit(1);
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Faltan credenciales de Firebase en el archivo .env.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seed = async () => {
  const ref = collection(db, "productos");

  // Evitamos duplicar datos si la coleccion ya tiene productos.
  const existentes = await getDocs(ref);
  if (!existentes.empty) {
    console.log(
      `La coleccion "productos" ya tiene ${existentes.size} documentos. No se cargo nada.`
    );
    process.exit(0);
  }

  console.log(`Cargando ${juegosIniciales.length} juegos en Firestore...`);
  for (const juego of juegosIniciales) {
    await addDoc(ref, juego);
    console.log(`  + ${juego.nombre}`);
  }
  console.log("\nListo. Catalogo inicial cargado correctamente.");
  process.exit(0);
};

seed().catch((error) => {
  console.error("\nError al cargar el catalogo:", error.message);
  console.error(
    "Verifica que las reglas de seguridad de Firestore permitan escritura."
  );
  process.exit(1);
});
