import { Modal, Button } from "react-bootstrap";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";

// Modal de confirmacion antes de eliminar (Requerimiento #2, mejora de UX).
const ModalConfirmacion = ({
  show,
  onConfirmar,
  onCancelar,
  titulo = "Confirmar eliminación",
  mensaje,
  cargando = false,
}) => (
  <Modal show={show} onHide={onCancelar} centered>
    <Modal.Header closeButton>
      <Modal.Title className="d-flex align-items-center gap-2 fs-5">
        <FaExclamationTriangle className="text-warning" /> {titulo}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>{mensaje}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancelar} disabled={cargando}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={onConfirmar} disabled={cargando}>
        <FaTrash className="me-1" />
        {cargando ? "Eliminando..." : "Eliminar"}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ModalConfirmacion;
