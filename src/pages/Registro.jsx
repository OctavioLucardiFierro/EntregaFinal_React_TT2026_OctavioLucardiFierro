import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Alert } from "react-bootstrap";
import styled from "styled-components";
import { FaUserPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Boton } from "../styles/ui";
import Seo from "../components/ui/Seo";

const Wrapper = styled.div`
  max-width: 420px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 32px;
`;

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const { registrar, firebaseConfigurado } = useAuth();
  const navigate = useNavigate();

  const manejarSubmit = async (evento) => {
    evento.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    try {
      await registrar(nombre, email, password);
      navigate("/");
    } catch (err) {
      console.error("Error de registro:", err.code);
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado. Probá iniciar sesión.");
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (err.code === "auth/invalid-email") {
        setError("El email no es válido.");
      } else {
        setError(err.message || "Ocurrió un error al registrarse.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="py-5">
      <Seo titulo="Crear cuenta" />
      <Wrapper>
        <h1 className="h4 mb-4 text-center">Crear cuenta</h1>

        {!firebaseConfigurado && (
          <Alert variant="warning">
            Firebase no está configurado. Completá el archivo <code>.env</code> para
            poder registrarte.
          </Alert>
        )}

        <Form onSubmit={manejarSubmit}>
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="emailRegistro">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="passwordRegistro">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Boton type="submit" disabled={cargando} style={{ width: "100%" }}>
            <FaUserPlus /> {cargando ? "Creando cuenta..." : "Registrarse"}
          </Boton>
        </Form>

        <p className="text-center mt-4 mb-0" style={{ fontSize: "14px" }}>
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </Wrapper>
    </Container>
  );
};

export default Registro;
