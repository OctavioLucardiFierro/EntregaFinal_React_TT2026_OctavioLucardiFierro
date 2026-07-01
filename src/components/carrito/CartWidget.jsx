import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

// Icono de carrito con la cantidad total de unidades.
const CartWidget = () => {
  const { obtenerCantidadTotal } = useCart();
  const cantidad = obtenerCantidadTotal();

  return (
    <Link
      to="/carrito"
      className="position-relative text-reset d-inline-flex align-items-center"
      aria-label={`Ver carrito (${cantidad} productos)`}
    >
      <FaShoppingCart size={20} />
      {cantidad > 0 && (
        <Badge
          bg="primary"
          pill
          className="position-absolute top-0 start-100 translate-middle"
          style={{ fontSize: "10px" }}
        >
          {cantidad}
        </Badge>
      )}
    </Link>
  );
};

export default CartWidget;
