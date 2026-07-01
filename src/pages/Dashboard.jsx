import { useState } from "react";
import { Container, Table, Modal, Image } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useProductos } from "../context/ProductosContext";
import FormProducto from "../components/productos/FormProducto";
import ModalConfirmacion from "../components/ui/ModalConfirmacion";
import Cargando from "../components/ui/Cargando";
import MensajeError from "../components/ui/MensajeError";
import { Boton, TituloSeccion } from "../styles/ui";
import Seo from "../components/ui/Seo";
import Paginador from "../components/ui/Paginador";

// Cantidad de productos por pagina en la tabla de gestion.
const POR_PAGINA = 6;

const Dashboard = () => {
  const {
    productos,
    cargando,
    error,
    agregarProducto,
    editarProducto,
    eliminarProducto,
  } = useProductos();

  // Estado del modal de alta/edicion
  const [modalForm, setModalForm] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Estado del modal de confirmacion de borrado
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const [errorAccion, setErrorAccion] = useState(null);
  const [pagina, setPagina] = useState(1);

  const abrirAgregar = () => {
    setProductoEditar(null);
    setErrorAccion(null);
    setModalForm(true);
  };

  const abrirEditar = (producto) => {
    setProductoEditar(producto);
    setErrorAccion(null);
    setModalForm(true);
  };

  const cerrarForm = () => {
    setModalForm(false);
    setProductoEditar(null);
  };

  const guardar = async (datos) => {
    setGuardando(true);
    setErrorAccion(null);
    try {
      if (productoEditar) {
        await editarProducto(productoEditar.id, datos);
      } else {
        await agregarProducto(datos);
      }
      cerrarForm();
    } catch (e) {
      console.error(e);
      setErrorAccion("No se pudo guardar el producto. Revisá tu conexión con Firebase.");
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = async () => {
    setEliminando(true);
    setErrorAccion(null);
    try {
      await eliminarProducto(aEliminar.id);
      setAEliminar(null);
    } catch (e) {
      console.error(e);
      setErrorAccion("No se pudo eliminar el producto.");
    } finally {
      setEliminando(false);
    }
  };

  if (cargando) return <Cargando texto="Cargando inventario..." />;

  // Paginacion de la tabla: como maximo POR_PAGINA productos por pagina.
  const totalPaginas = Math.max(1, Math.ceil(productos.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = productos.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  );

  return (
    <Container className="py-4 py-md-5">
      <Seo titulo="Panel de gestión" />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <TituloSeccion>Panel de gestión</TituloSeccion>
          <p className="mb-0" style={{ color: "var(--ps-text-muted)" }}>
            {productos.length} productos en el catálogo
          </p>
        </div>
        <Boton type="button" onClick={abrirAgregar}>
          <FaPlus /> Agregar producto
        </Boton>
      </div>

      {error && <MensajeError variant="warning">{error}</MensajeError>}
      {errorAccion && <MensajeError>{errorAccion}</MensajeError>}

      {!error && productos.length > 0 && (
        <Table responsive hover className="align-middle">
          <thead>
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Plataforma</th>
              <th>Precio</th>
              <th>Stock</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.id}>
                <td style={{ width: "56px" }}>
                  <Image
                    src={p.imagen}
                    alt={p.nombre}
                    width={40}
                    height={52}
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                  />
                </td>
                <td>{p.nombre}</td>
                <td>{p.plataforma}</td>
                <td>${Number(p.precio).toLocaleString("es-AR")}</td>
                <td>{p.stock}</td>
                <td className="text-end">
                  <div className="d-inline-flex gap-2">
                    <Boton
                      type="button"
                      $variante="secundario"
                      onClick={() => abrirEditar(p)}
                      aria-label={`Editar ${p.nombre}`}
                    >
                      <FaEdit />
                    </Boton>
                    <Boton
                      type="button"
                      $variante="peligro"
                      onClick={() => setAEliminar(p)}
                      aria-label={`Eliminar ${p.nombre}`}
                    >
                      <FaTrash />
                    </Boton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {!error && (
        <Paginador
          paginaActual={paginaActual}
          totalItems={productos.length}
          porPagina={POR_PAGINA}
          onCambiar={setPagina}
        />
      )}

      {/* Modal de alta / edicion con el formulario controlado */}
      <Modal show={modalForm} onHide={cerrarForm} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">
            {productoEditar ? "Editar producto" : "Agregar producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorAccion && <MensajeError>{errorAccion}</MensajeError>}
          <FormProducto
            productoInicial={productoEditar}
            onGuardar={guardar}
            onCancelar={cerrarForm}
            guardando={guardando}
          />
        </Modal.Body>
      </Modal>

      {/* Modal de confirmacion antes de eliminar */}
      <ModalConfirmacion
        show={!!aEliminar}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
        cargando={eliminando}
        mensaje={
          aEliminar
            ? `¿Seguro que querés eliminar "${aEliminar.nombre}"? Esta acción no se puede deshacer.`
            : ""
        }
      />
    </Container>
  );
};

export default Dashboard;
