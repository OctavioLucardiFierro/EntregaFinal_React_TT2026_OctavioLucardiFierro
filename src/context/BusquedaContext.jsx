import { createContext, useContext, useState } from "react";

// Contexto que mantiene el termino de busqueda global, compartido entre
// la barra de busqueda (Navbar) y el catalogo de productos.
const BusquedaContext = createContext();

export const useBusqueda = () => {
  const ctx = useContext(BusquedaContext);
  if (!ctx) throw new Error("useBusqueda debe usarse dentro de BusquedaProvider");
  return ctx;
};

export const BusquedaProvider = ({ children }) => {
  const [busqueda, setBusqueda] = useState("");

  const limpiarBusqueda = () => setBusqueda("");

  return (
    <BusquedaContext.Provider value={{ busqueda, setBusqueda, limpiarBusqueda }}>
      {children}
    </BusquedaContext.Provider>
  );
};
