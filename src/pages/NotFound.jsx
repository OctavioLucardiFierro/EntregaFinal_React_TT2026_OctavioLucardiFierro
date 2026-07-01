import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { Boton } from "../styles/ui";
import Seo from "../components/ui/Seo";

const NotFound = () => (
  <Container className="py-5 text-center">
    <Seo titulo="Página no encontrada" />
    <h1 style={{ fontSize: "72px", fontWeight: 700, color: "var(--ps-accent)" }}>
      404
    </h1>
    <p className="fs-5 mb-4" style={{ color: "var(--ps-text-muted)" }}>
      La página que buscás no existe o fue movida.
    </p>
    <Boton as={Link} to="/">
      <FaArrowLeft /> Volver al inicio
    </Boton>
  </Container>
);

export default NotFound;
