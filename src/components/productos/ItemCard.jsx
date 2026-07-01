import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaCartPlus } from "react-icons/fa";
import { Boton, Etiqueta } from "../../styles/ui";
import { useCart } from "../../context/CartContext";

// Tarjeta de producto del catalogo, estilizada con styled-components.
// Dimensiones compactas pensadas para la grilla densa (ver ItemList.jsx).
const Tarjeta = styled.article`
  background-color: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-3px);
  }
`;

const Portada = styled(Link)`
  display: block;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background-color: #000;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }

  &:hover img {
    transform: scale(1.04);
  }
`;

const Cuerpo = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
`;

const Nombre = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.3;
`;

const Precio = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Acciones = styled.div`
  display: flex;
  gap: 6px;
  margin-top: auto;
`;

const ItemCard = ({ producto }) => {
  const { agregarACarrito, carrito } = useCart();
  const { id, nombre, precio, plataforma, imagen, stock } = producto;
  // Cantidad de este producto que ya esta en el carrito.
  const enCarrito = carrito.find((item) => item.id === id)?.cantidad ?? 0;
  const sinStock = stock <= 0;
  const topeAlcanzado = enCarrito >= stock; // ya agrego todo el stock disponible

  // Estilo compacto para que los dos botones entren en la tarjeta chica.
  const estiloBoton = { padding: "8px 10px", fontSize: "12px" };

  return (
    <Tarjeta>
      <Portada to={`/producto/${id}`} aria-label={`Ver ${nombre}`}>
        <img src={imagen} alt={nombre} loading="lazy" />
      </Portada>

      <Cuerpo>
        <div>
          <Etiqueta>{plataforma}</Etiqueta>
        </div>
        <Nombre>{nombre}</Nombre>
        <Precio>${Number(precio).toLocaleString("es-AR")}</Precio>

        <Acciones>
          <Boton
            as={Link}
            to={`/producto/${id}`}
            $variante="secundario"
            style={{ flex: 1, ...estiloBoton }}
          >
            Ver detalle
          </Boton>
          <Boton
            type="button"
            onClick={() => agregarACarrito(producto, 1)}
            disabled={sinStock || topeAlcanzado}
            style={estiloBoton}
            title={
              sinStock
                ? "Sin stock"
                : topeAlcanzado
                ? "Ya tenés el máximo disponible en el carrito"
                : "Agregar al carrito"
            }
            aria-label={`Agregar ${nombre} al carrito`}
          >
            <FaCartPlus />
          </Boton>
        </Acciones>
      </Cuerpo>
    </Tarjeta>
  );
};

export default ItemCard;
