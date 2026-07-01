import { useMemo, useState, useEffect } from "react";
import { Container, Alert } from "react-bootstrap";
import { useProductos } from "../../context/ProductosContext";
import { useBusqueda } from "../../context/BusquedaContext";
import ItemList from "./ItemList";
import Paginador from "../ui/Paginador";
import Cargando from "../ui/Cargando";
import MensajeError from "../ui/MensajeError";
import { TituloSeccion, TextoApagado } from "../../styles/ui";

// >>> Cantidad de juegos por pagina ANTES de mostrar el paginador (Req #4).
//     Cambiar este numero ajusta cuantas tarjetas se ven por pagina.
const POR_PAGINA = 12;

// Contenedor del catalogo: aplica busqueda en tiempo real (Req #4),
// paginacion (Req #4) y maneja los estados de carga/error (Req #2).
const ItemListContainer = () => {
  const { productos, cargando, error } = useProductos();
  const { busqueda } = useBusqueda();
  const [pagina, setPagina] = useState(1);

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return productos;
    return productos.filter((p) => p.nombre.toLowerCase().includes(termino));
  }, [productos, busqueda]);

  // Al cambiar la busqueda volvemos a la primera pagina.
  useEffect(() => {
    setPagina(1);
  }, [busqueda]);

  const inicio = (pagina - 1) * POR_PAGINA;
  const visibles = filtrados.slice(inicio, inicio + POR_PAGINA);

  if (cargando) return <Cargando texto="Cargando catálogo..." />;

  return (
    <Container className="py-4 py-md-5">
      <div className="mb-4">
        <TituloSeccion>Catálogo de juegos</TituloSeccion>
        <TextoApagado>
          {busqueda
            ? `Resultados para "${busqueda}" (${filtrados.length})`
            : `${productos.length} juegos disponibles`}
        </TextoApagado>
      </div>

      {error ? (
        <MensajeError variant="warning">{error}</MensajeError>
      ) : filtrados.length === 0 ? (
        <Alert variant="secondary">
          No se encontraron juegos que coincidan con tu búsqueda.
        </Alert>
      ) : (
        <>
          <ItemList productos={visibles} />
          <Paginador
            paginaActual={pagina}
            totalItems={filtrados.length}
            porPagina={POR_PAGINA}
            onCambiar={setPagina}
          />
        </>
      )}
    </Container>
  );
};

export default ItemListContainer;
