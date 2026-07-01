import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, firebaseConfigurado } from "../firebase/config";

// Contexto de autenticacion (Requerimiento #1).
// Maneja el estado de usuario logueado/no logueado contra Firebase Auth
// y carga el rol del usuario desde la coleccion "usuarios" de Firestore.
const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si Firebase no esta configurado, no hay sesion que escuchar.
    if (!firebaseConfigurado) {
      setLoading(false);
      return;
    }

    const desuscribir = onAuthStateChanged(auth, async (usuarioActual) => {
      try {
        if (usuarioActual) {
          // Buscamos el perfil (nombre y rol) en Firestore usando el UID.
          const ref = doc(db, "usuarios", usuarioActual.uid);
          const snap = await getDoc(ref);
          const datos = snap.exists() ? snap.data() : {};
          setUser({
            uid: usuarioActual.uid,
            email: usuarioActual.email,
            nombre: datos.nombre || "Usuario",
            rol: datos.rol || "user",
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => desuscribir();
  }, []);

  // Registro: crea el usuario en Auth y su documento de perfil en Firestore.
  const registrar = async (nombre, email, password) => {
    if (!firebaseConfigurado) throw new Error("Firebase no esta configurado.");
    const credencial = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "usuarios", credencial.user.uid), {
      nombre,
      email,
      rol: "user", // por defecto, todo registro web es usuario comun
    });
    return credencial;
  };

  const login = (email, password) => {
    if (!firebaseConfigurado) throw new Error("Firebase no esta configurado.");
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (firebaseConfigurado) signOut(auth);
    setUser(null);
  };

  const informacion = {
    user,
    loading,
    registrar,
    login,
    logout,
    firebaseConfigurado,
  };

  return (
    <AuthContext.Provider value={informacion}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
