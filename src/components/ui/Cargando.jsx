import { Spinner } from "react-bootstrap";

// Indicador de carga reutilizable (Requerimiento #2).
const Cargando = ({ texto = "Cargando..." }) => (
  <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5 my-5">
    <Spinner animation="border" variant="primary" role="status">
      <span className="visually-hidden">{texto}</span>
    </Spinner>
    <span style={{ color: "var(--ps-text-muted)" }}>{texto}</span>
  </div>
);

export default Cargando;
