import { Alert } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa";

// Mensaje de error reutilizable (Requerimiento #2).
const MensajeError = ({ children, variant = "danger" }) => (
  <Alert variant={variant} className="d-flex align-items-center gap-2">
    <FaExclamationCircle />
    <span>{children}</span>
  </Alert>
);

export default MensajeError;
