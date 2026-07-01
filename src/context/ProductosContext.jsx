import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, firebaseConfigurado } from "../firebase/config";

// Contexto de productos (Requerimientos #2 y #4).
// Carga el catalogo desde Firestore y expone las operaciones CRUD,
// junto con los estados de carga (cargando) y error.
const ProductosContext = createContext();

export const useProductos = () => {
  const ctx = useContext(ProductosContext);
  if (!ctx) throw new Error("useProductos debe usarse dentro de ProductosProvider");
  return ctx;
};

const ordenarPorNombre = (lista) =>
  [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarProductos = useCallback(async () => {
    if (!firebaseConfigurado) {
      setCargando(false);
      setError(
        "Firebase no esta configurado. Copia .env.example a .env, carga tus credenciales y ejecuta 'npm run seed' para llenar el catalogo."
      );
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const consulta = query(collection(db, "productos"), orderBy("nombre"));
      const snapshot = await getDocs(consulta);
      setProductos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Error al cargar productos:", e);
      setError("No se pudieron cargar los productos. Intenta nuevamente mas tarde.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // --- Operaciones CRUD (actualizan el estado local de forma optimista) ---
  const agregarProducto = async (datos) => {
    const ref = await addDoc(collection(db, "productos"), datos);
    setProductos((prev) => ordenarPorNombre([...prev, { id: ref.id, ...datos }]));
  };

  const editarProducto = async (id, datos) => {
    await updateDoc(doc(db, "productos", id), datos);
    setProductos((prev) =>
      ordenarPorNombre(prev.map((p) => (p.id === id ? { ...p, ...datos } : p)))
    );
  };

  const eliminarProducto = async (id) => {
    await deleteDoc(doc(db, "productos", id));
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductosContext.Provider
      value={{
        productos,
        cargando,
        error,
        cargarProductos,
        agregarProducto,
        editarProducto,
        eliminarProducto,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
};
