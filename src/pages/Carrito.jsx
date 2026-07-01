import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";
import styled from "styled-components";
import {
  FaTrash,
  FaShoppingCart,
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaCheckCircle,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Boton } from "../styles/ui";
import Seo from "../components/ui/Seo";
import Paginador from "../components/ui/Paginador";

const Item = styled.li`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  img {
    width: 64px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;

  h4 {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 6px;
  }

  span {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Cantidad = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;

  button {
    background: ${({ theme }) => theme.colors.bgCard};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    width: 28px;
    height: 28px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  strong {
    min-width: 22px;
    text-align: center;
  }
`;

const Subtotal = styled.p`
  font-weight: 700;
  font-size: 16px;
  margin: 0;
  white-space: nowrap;
`;

// Cantidad de productos del carrito que se muestran por pagina.
const POR_PAGINA = 6;

const Carrito = () => {
  const {
    carrito,
    eliminarDelCarrito,
    vaciarCarrito,
    incrementarCantidad,
    decrementarCantidad,
    obtenerTotalPrecio,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [compraOk, setCompraOk] = useState(false);
  const [pagina, setPagina] = useState(1);

  const finalizarCompra = () => {
    // El checkout requiere estar autenticado (Requerimiento #1).
    if (!user) {
      navigate("/login");
      return;
    }
    setCompraOk(true);
    vaciarCarrito();
  };

  if (compraOk) {
    return (
      <Container className="py-5 text-center">
        <Seo titulo="Compra realizada" />
        <FaCheckCircle size={48} color="#30a46c" className="mb-3" />
        <h1 className="h3">¡Gracias por tu compra!</h1>
        <p style={{ color: "var(--ps-text-muted)" }}>
          Tu pedido fue registrado correctamente.
        </p>
        <Boton as={Link} to="/productos">
          Seguir comprando
        </Boton>
      </Container>
    );
  }

  if (carrito.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Seo titulo="Carrito" />
        <FaShoppingCart size={48} className="mb-3" style={{ color: "var(--ps-text-muted)" }} />
        <h1 className="h3">Tu carrito está vacío</h1>
        <p style={{ color: "var(--ps-text-muted)" }}>
          Explorá el catálogo y agregá tus juegos favoritos.
        </p>
        <Boton as={Link} to="/productos">
          <FaArrowLeft /> Ver catálogo
        </Boton>
      </Container>
    );
  }

  // Paginacion del carrito: mostramos como maximo POR_PAGINA items por pagina.
  const totalPaginas = Math.max(1, Math.ceil(carrito.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = carrito.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  );

  return (
    <Container className="py-4 py-md-5" style={{ maxWidth: "820px" }}>
      <Seo titulo="Carrito" />
      <h1 className="h3 mb-4">Carrito de compras</h1>

      {!user && (
        <Alert variant="info">
          Vas a necesitar <Link to="/login">iniciar sesión</Link> para finalizar la compra.
        </Alert>
      )}

      <ul className="list-unstyled m-0">
        {visibles.map((item) => (
          <Item key={item.id}>
            <img src={item.imagen} alt={item.nombre} />
            <Info>
              <h4>{item.nombre}</h4>
              <span>${Number(item.precio).toLocaleString("es-AR")} c/u</span>
              <Cantidad>
                <button
                  onClick={() => decrementarCantidad(item.id)}
                  aria-label="Restar uno"
                >
                  <FaMinus size={11} />
                </button>
                <strong>{item.cantidad}</strong>
                <button
                  onClick={() => incrementarCantidad(item.id)}
                  disabled={item.stock && item.cantidad >= item.stock}
                  aria-label="Sumar uno"
                >
                  <FaPlus size={11} />
                </button>
              </Cantidad>
            </Info>
            <Subtotal>
              ${(item.precio * item.cantidad).toLocaleString("es-AR")}
            </Subtotal>
            <Boton
              type="button"
              $variante="peligro"
              onClick={() => eliminarDelCarrito(item.id)}
              aria-label={`Eliminar ${item.nombre}`}
            >
              <FaTrash />
            </Boton>
          </Item>
        ))}
      </ul>

      <Paginador
        paginaActual={paginaActual}
        totalItems={carrito.length}
        porPagina={POR_PAGINA}
        onCambiar={setPagina}
      />

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-4">
        <Boton type="button" $variante="secundario" onClick={vaciarCarrito}>
          <FaTrash /> Vaciar carrito
        </Boton>
        <div className="text-sm-end">
          <p className="mb-2 fs-5">
            Total:{" "}
            <strong>${obtenerTotalPrecio().toLocaleString("es-AR")}</strong>
          </p>
          <Boton type="button" onClick={finalizarCompra}>
            <FaCheckCircle /> Finalizar compra
          </Boton>
        </div>
      </div>
    </Container>
  );
};

export default Carrito;
