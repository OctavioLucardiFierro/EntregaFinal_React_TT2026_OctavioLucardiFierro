import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaRegCommentDots, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { db, firebaseConfigurado } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { Boton, TituloSeccion } from "../../styles/ui";
import Cargando from "../ui/Cargando";

// Seccion de comentarios del producto.
// Se guia por el proyecto de clase: coleccion en Firestore leida en tiempo real
// con onSnapshot, filtrada por productoId. Cualquiera puede ver los comentarios,
// pero solo los usuarios logueados pueden publicar.
const Seccion = styled.section`
  margin-top: 48px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 32px;
`;

const Tarjeta = styled.div`
  background-color: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 16px;

  & + & {
    margin-top: 12px;
  }
`;

const Autor = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;

  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Fecha = styled.span`
  margin-left: auto;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textDim};
`;

const Texto = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  white-space: pre-wrap;
`;

const Comentarios = ({ productoId }) => {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Lectura en tiempo real (igual que en el proyecto de clase).
  useEffect(() => {
    if (!firebaseConfigurado) {
      setCargando(false);
      return;
    }

    const consulta = query(
      collection(db, "comentarios"),
      where("productoId", "==", productoId)
    );

    const desuscribir = onSnapshot(
      consulta,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Ordenamos por fecha (mas nuevos primero) en el cliente,
        // asi evitamos tener que crear un indice compuesto en Firestore.
        data.sort((a, b) => (b.fecha?.seconds ?? 0) - (a.fecha?.seconds ?? 0));
        setComentarios(data);
        setCargando(false);
      },
      (e) => {
        console.error("Error al cargar comentarios:", e);
        setError("No se pudieron cargar los comentarios.");
        setCargando(false);
      }
    );

    return () => desuscribir();
  }, [productoId]);

  const enviar = async (evento) => {
    evento.preventDefault();
    if (!texto.trim()) return;

    setEnviando(true);
    setError(null);
    try {
      await addDoc(collection(db, "comentarios"), {
        productoId,
        autorUid: user.uid,
        autorNombre: user.nombre,
        comentario: texto.trim(),
        fecha: serverTimestamp(),
      });
      setTexto("");
    } catch (e) {
      console.error("Error al publicar comentario:", e);
      setError("No se pudo publicar tu comentario. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha?.seconds) return "";
    return new Date(fecha.seconds * 1000).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Seccion>
      <TituloSeccion>Comentarios</TituloSeccion>

      {user ? (
        <Form onSubmit={enviar} className="my-4">
          <Form.Group controlId="nuevoComentario">
            <Form.Label>Dejá tu comentario</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="¿Qué te pareció este juego?"
              maxLength={500}
            />
          </Form.Group>
          <div className="d-flex justify-content-end mt-2">
            <Boton type="submit" disabled={enviando || !texto.trim()}>
              <FaPaperPlane /> {enviando ? "Publicando..." : "Publicar"}
            </Boton>
          </div>
        </Form>
      ) : (
        <Alert variant="secondary" className="my-4">
          <Link to="/login">Iniciá sesión</Link> para dejar un comentario.
        </Alert>
      )}

      {error && <Alert variant="warning">{error}</Alert>}

      {cargando ? (
        <Cargando texto="Cargando comentarios..." />
      ) : comentarios.length === 0 ? (
        <p
          className="d-flex align-items-center gap-2"
          style={{ color: "var(--ps-text-muted)" }}
        >
          <FaRegCommentDots /> Todavía no hay comentarios. ¡Sé el primero!
        </p>
      ) : (
        comentarios.map((c) => (
          <Tarjeta key={c.id}>
            <Autor>
              <FaUserCircle /> {c.autorNombre}
              <Fecha>{formatearFecha(c.fecha)}</Fecha>
            </Autor>
            <Texto>{c.comentario}</Texto>
          </Tarjeta>
        ))
      )}
    </Seccion>
  );
};

export default Comentarios;
