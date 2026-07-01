import { createContext, useContext, useState, useEffect } from "react";

// Contexto del carrito de compras (Requerimiento #1).
// Permite agregar, eliminar y vaciar el carrito, ademas de ajustar cantidades.
// El estado se persiste en localStorage para sobrevivir recargas.
const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CarritoProvider");
  return ctx;
};

const CLAVE_STORAGE = "ps-store-carrito";

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(carrito));
  }, [carrito]);

  // Agrega un producto; si ya existe, suma la cantidad.
  // Nunca supera el stock disponible del producto.
  const agregarACarrito = (producto, cantidad = 1) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      const tope = producto.stock ?? Infinity;
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + cantidad, tope) }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: Math.min(cantidad, tope) }];
    });
  };

  // Elimina por completo una linea del carrito.
  const eliminarDelCarrito = (id) =>
    setCarrito((prev) => prev.filter((item) => item.id !== id));

  // Vacia el carrito entero.
  const vaciarCarrito = () => setCarrito([]);

  const incrementarCantidad = (id) =>
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.min(item.cantidad + 1, item.stock ?? Infinity) }
          : item
      )
    );

  const decrementarCantidad = (id) =>
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );

  const obtenerCantidadTotal = () =>
    carrito.reduce((acum, item) => acum + item.cantidad, 0);

  const obtenerTotalPrecio = () =>
    carrito.reduce((acum, item) => acum + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarACarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        incrementarCantidad,
        decrementarCantidad,
        obtenerCantidadTotal,
        obtenerTotalPrecio,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
