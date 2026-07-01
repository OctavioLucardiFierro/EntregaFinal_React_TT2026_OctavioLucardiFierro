import { Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useBusqueda } from "../../context/BusquedaContext";

// Barra de busqueda en tiempo real (Requerimiento #4).
// Actualiza el contexto y, si no estamos en el catalogo, navega hacia el.
const BarraBusqueda = () => {
  const { busqueda, setBusqueda } = useBusqueda();
  const navigate = useNavigate();
  const location = useLocation();

  const manejarCambio = (evento) => {
    setBusqueda(evento.target.value);
    if (location.pathname !== "/productos") {
      navigate("/productos");
    }
  };

  return (
    <Form className="m-0" role="search" onSubmit={(e) => e.preventDefault()}>
      <InputGroup size="sm">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          type="search"
          placeholder="Buscar juegos..."
          value={busqueda}
          onChange={manejarCambio}
          aria-label="Buscar juegos"
          style={{ minWidth: "180px" }}
        />
      </InputGroup>
    </Form>
  );
};

export default BarraBusqueda;
