import { Pagination } from "react-bootstrap";

// Paginador reutilizable. Calcula la cantidad de paginas a partir del total
// de items y de cuantos se muestran por pagina. Solo dibuja los controles;
// el estado de la pagina (y el "slice" de la lista) lo maneja la pantalla.
// Props: paginaActual, totalItems, porPagina (default 12), onCambiar.
const Paginador = ({ paginaActual, totalItems, porPagina = 12, onCambiar }) => {
  const totalPaginas = Math.ceil(totalItems / porPagina);
  if (totalPaginas <= 1) return null;

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <Pagination className="justify-content-center mt-4 mb-0">
      <Pagination.Prev
        disabled={paginaActual === 1}
        onClick={() => onCambiar(paginaActual - 1)}
      />
      {paginas.map((numero) => (
        <Pagination.Item
          key={numero}
          active={numero === paginaActual}
          onClick={() => onCambiar(numero)}
        >
          {numero}
        </Pagination.Item>
      ))}
      <Pagination.Next
        disabled={paginaActual === totalPaginas}
        onClick={() => onCambiar(paginaActual + 1)}
      />
    </Pagination>
  );
};

export default Paginador;
