import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Alert } from "react-bootstrap";
import styled from "styled-components";
import { FaSignInAlt } from "react-icons/fa";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const { login, firebaseConfigurado } = useAuth();
  const navigate = useNavigate();

  const manejarSubmit = async (evento) => {
    evento.preventDefault();
    setError(null);
    setCargando(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Error de login:", err.code);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Las credenciales ingresadas son incorrectas.");
      } else if (err.code === "auth/invalid-email") {
        setError("El email no es válido.");
      } else {
        setError(err.message || "Ocurrió un error inesperado.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="py-5">
      <Seo titulo="Iniciar sesión" />
      <Wrapper>
        <h1 className="h4 mb-4 text-center">Iniciar sesión</h1>

        {!firebaseConfigurado && (
          <Alert variant="warning">
            Firebase no está configurado. Completá el archivo <code>.env</code> para
            poder iniciar sesión.
          </Alert>
        )}

        <Form onSubmit={manejarSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Boton type="submit" disabled={cargando} style={{ width: "100%" }}>
            <FaSignInAlt /> {cargando ? "Ingresando..." : "Ingresar"}
          </Boton>
        </Form>

        <p className="text-center mt-4 mb-0" style={{ fontSize: "14px" }}>
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </Wrapper>
    </Container>
  );
};

export default Login;
