import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Container, Row, Col, Form } from "react-bootstrap";
import { FaArrowLeft, FaCartPlus } from "react-icons/fa";
import { db, firebaseConfigurado } from "../firebase/config";
import { useCart } from "../context/CartContext";
import { Boton, Etiqueta } from "../styles/ui";
import Cargando from "../components/ui/Cargando";
import MensajeError from "../components/ui/MensajeError";
import Seo from "../components/ui/Seo";
import Comentarios from "../components/comentarios/Comentarios";

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarACarrito, carrito } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const cargar = async () => {
      if (!firebaseConfigurado) {
        setError("Firebase no está configurado. Revisá el archivo .env.");
        setCargando(false);
        return;
      }
      setCargando(true);
      setError(null);
      try {
        const snap = await getDoc(doc(db, "productos", id));
        if (snap.exists()) {
          setProducto({ id: snap.id, ...snap.data() });
        } else {
          setError("Producto no encontrado.");
        }
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el producto. Intentá nuevamente.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  const manejarAgregar = () => {
    const yaEnCarrito = carrito.find((item) => item.id === producto.id)?.cantidad ?? 0;
    const disponibles = producto.stock - yaEnCarrito;
    agregarACarrito(producto, Math.min(Number(cantidad), disponibles));
    navigate("/carrito");
  };

  if (cargando) return <Cargando texto="Cargando producto..." />;

  if (error) {
    return (
      <Container className="py-5">
        <MensajeError>{error}</MensajeError>
        <Boton as={Link} to="/productos" $variante="secundario">
          <FaArrowLeft /> Volver al catálogo
        </Boton>
      </Container>
    );
  }

  const sinStock = producto.stock <= 0;
  // Unidades de este producto que ya estan en el carrito y cuantas quedan.
  const enCarrito = carrito.find((item) => item.id === producto.id)?.cantidad ?? 0;
  const restante = producto.stock - enCarrito;
  const sinDisponibles = restante <= 0;

  return (
    <>
      <Seo titulo={producto.nombre} descripcion={producto.descripcion} />
      <Container className="py-4 py-md-5">
        <Boton as={Link} to="/productos" $variante="secundario" className="mb-4">
          <FaArrowLeft /> Volver al catálogo
        </Boton>

        <Row className="g-4 g-md-5 align-items-start">
          <Col xs={12} md={5}>
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded"
              style={{ border: "1px solid var(--ps-border)", width: "100%" }}
            />
          </Col>

          <Col xs={12} md={7}>
            <Etiqueta>{producto.plataforma}</Etiqueta>
            <h1 className="mt-3 mb-2" style={{ fontWeight: 700 }}>
              {producto.nombre}
            </h1>
            <p style={{ color: "var(--ps-text-muted)" }}>{producto.genero}</p>
            <p style={{ lineHeight: 1.6 , whiteSpace: "pre-line"}}>{producto.descripcion}</p>

            <p className="fs-3 fw-bold mb-1">
              ${Number(producto.precio).toLocaleString("es-AR")}
            </p>
            <p className="mb-4" style={{ color: sinStock || sinDisponibles ? "var(--bs-danger)" : "var(--ps-text-muted)" }}>
              {sinStock
                ? "Sin stock disponible"
                : sinDisponibles
                ? `Ya tenés las ${producto.stock} unidades en el carrito`
                : `Stock disponible: ${producto.stock}${enCarrito > 0 ? ` (${enCarrito} en tu carrito)` : ""}`}
            </p>

            <div className="d-flex align-items-end gap-3">
              <Form.Group controlId="cantidad" style={{ maxWidth: "100px" }}>
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={Math.max(restante, 1)}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  disabled={sinStock || sinDisponibles}
                />
              </Form.Group>
              <Boton onClick={manejarAgregar} disabled={sinStock || sinDisponibles}>
                <FaCartPlus /> Agregar al carrito
              </Boton>
            </div>
          </Col>
        </Row>

        <Comentarios productoId={producto.id} />
      </Container>
    </>
  );
};

export default DetalleProducto;
