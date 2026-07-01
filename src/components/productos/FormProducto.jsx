import { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { FaSave, FaTimes } from "react-icons/fa";
import { Boton } from "../../styles/ui";

// API key de ImgBB leida desde el .env (VITE_IMGBB_KEY).
const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY;

const PLATAFORMAS = ["PS5", "PS4", "PS5 / PS4"];
const GENEROS = [
  "Acción-Aventura",
  "RPG de Acción",
  "Aventura de Supervivencia",
  "Simulación de Carreras",
  "Plataformas-Acción",
  "Shooter",
  "Deportes",
  "Terror",
  "Survival Horror",
  "Otros",
];

const ESTADO_INICIAL = {
  nombre: "",
  precio: "",
  descripcion: "",
  plataforma: "",
  genero: "",
  stock: "",
};

// Formulario controlado para agregar/editar productos (Requerimiento #2),
// con validaciones (nombre obligatorio, precio > 0, etc.).
// La imagen se sube a ImgBB y se guarda la URL resultante.
const FormProducto = ({ productoInicial = null, onGuardar, onCancelar, guardando = false }) => {
  const [datos, setDatos] = useState(() =>
    productoInicial
      ? {
          nombre: productoInicial.nombre ?? "",
          precio: productoInicial.precio ?? "",
          descripcion: productoInicial.descripcion ?? "",
          plataforma: productoInicial.plataforma ?? "",
          genero: productoInicial.genero ?? "",
          stock: productoInicial.stock ?? "",
        }
      : ESTADO_INICIAL
  );
  const [imagenFile, setImagenFile] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [errores, setErrores] = useState({});

  const modo = productoInicial ? "editar" : "agregar";

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  // Sube el archivo a ImgBB y devuelve la URL alojada.
  const subirImagen = async (archivo) => {
    if (!IMGBB_KEY) {
      throw new Error("Falta configurar VITE_IMGBB_KEY en el archivo .env.");
    }
    const form = new FormData();
    form.append("image", archivo);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
      method: "POST",
      body: form,
    });

    const json = await res.json();
    if (!json.success) throw new Error("No se pudo subir la imagen a ImgBB.");
    return json.data.url;
  };

  const validar = () => {
    const nuevos = {};
    if (!datos.nombre.trim()) nuevos.nombre = "El nombre es obligatorio.";
    if (datos.precio === "" || Number(datos.precio) <= 0)
      nuevos.precio = "El precio debe ser mayor a 0.";
    if (datos.stock === "" || Number(datos.stock) < 0)
      nuevos.stock = "El stock no puede ser negativo.";
    if (!datos.plataforma) nuevos.plataforma = "Seleccioná una plataforma.";
    if (!datos.genero) nuevos.genero = "Seleccioná un género.";
    // En alta la imagen es obligatoria; en edición es opcional (se mantiene la actual).
    if (!productoInicial && !imagenFile) nuevos.imagen = "La imagen es obligatoria.";
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (!validar()) return;

    try {
      setSubiendo(true);
      // Si hay archivo nuevo lo subimos; si no (modo editar), mantenemos la imagen actual.
      let urlImagen = productoInicial?.imagen ?? "";
      if (imagenFile) urlImagen = await subirImagen(imagenFile);

      await onGuardar({
        nombre: datos.nombre.trim(),
        precio: Number(datos.precio),
        descripcion: datos.descripcion.trim(),
        plataforma: datos.plataforma,
        genero: datos.genero,
        imagen: urlImagen,
        stock: Number(datos.stock),
      });
    } catch (e) {
      console.error(e);
      setErrores((prev) => ({
        ...prev,
        imagen: e.message || "No se pudo subir la imagen.",
      }));
    } finally {
      setSubiendo(false);
    }
  };

  const procesando = guardando || subiendo;

  return (
    <Form onSubmit={manejarEnvio} noValidate>
      <Form.Group className="mb-3" controlId="nombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          name="nombre"
          value={datos.nombre}
          onChange={manejarCambio}
          placeholder="Ej. God of War Ragnarök"
          isInvalid={!!errores.nombre}
        />
        <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="descripcion">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="descripcion"
          value={datos.descripcion}
          onChange={manejarCambio}
          placeholder="Breve descripción del juego..."
        />
      </Form.Group>

      <Row>
        <Col xs={6}>
          <Form.Group className="mb-3" controlId="precio">
            <Form.Label>Precio (ARS)</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={datos.precio}
              onChange={manejarCambio}
              placeholder="0"
              min="0"
              isInvalid={!!errores.precio}
            />
            <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group className="mb-3" controlId="stock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={datos.stock}
              onChange={manejarCambio}
              placeholder="0"
              min="0"
              isInvalid={!!errores.stock}
            />
            <Form.Control.Feedback type="invalid">{errores.stock}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col xs={12} sm={6}>
          <Form.Group className="mb-3" controlId="plataforma">
            <Form.Label>Plataforma</Form.Label>
            <Form.Select
              name="plataforma"
              value={datos.plataforma}
              onChange={manejarCambio}
              isInvalid={!!errores.plataforma}
            >
              <option value="">Seleccionar...</option>
              {PLATAFORMAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errores.plataforma}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col xs={12} sm={6}>
          <Form.Group className="mb-3" controlId="genero">
            <Form.Label>Género</Form.Label>
            <Form.Select
              name="genero"
              value={datos.genero}
              onChange={manejarCambio}
              isInvalid={!!errores.genero}
            >
              <option value="">Seleccionar...</option>
              {GENEROS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.genero}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4" controlId="imagen">
        <Form.Label>
          {modo === "editar" ? "Nueva imagen (opcional)" : "Imagen (portada)"}
        </Form.Label>

        {modo === "editar" && productoInicial.imagen && !imagenFile && (
          <div className="mb-2">
            <img
              src={productoInicial.imagen}
              alt="Imagen actual"
              style={{
                height: "64px",
                borderRadius: "4px",
                border: "1px solid var(--ps-border)",
              }}
            />
          </div>
        )}

        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => setImagenFile(e.target.files[0] ?? null)}
          isInvalid={!!errores.imagen}
        />
        <Form.Control.Feedback type="invalid">{errores.imagen}</Form.Control.Feedback>
        <Form.Text className="text-muted">
          {modo === "editar"
            ? "Si no elegís una imagen nueva, se mantiene la actual."
            : "Se sube a ImgBB y se guarda la URL resultante."}
        </Form.Text>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Boton type="button" $variante="secundario" onClick={onCancelar} disabled={procesando}>
          <FaTimes /> Cancelar
        </Boton>
        <Boton type="submit" disabled={procesando}>
          <FaSave />
          {subiendo
            ? "Subiendo imagen..."
            : guardando
            ? "Guardando..."
            : modo === "editar"
            ? "Guardar cambios"
            : "Agregar producto"}
        </Boton>
      </div>
    </Form>
  );
};

export default FormProducto;
