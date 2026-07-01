import { Link } from "react-router-dom";
import { Container, Badge } from "react-bootstrap";
import styled from "styled-components";
import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Boton } from "../styles/ui";
import Seo from "../components/ui/Seo";

const Tarjeta = styled.div`
  max-width: 460px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 32px;
  text-align: center;
`;

const Dato = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;

  span:first-child {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Perfil = () => {
  const { user, logout } = useAuth();

  return (
    <Container className="py-5">
      <Seo titulo="Mi perfil" />
      <Tarjeta>
        <FaUserCircle size={56} color="#3390ff" className="mb-3" />
        <h1 className="h4 mb-1">{user.nombre}</h1>
        <Badge bg={user.rol === "admin" ? "primary" : "secondary"} className="mb-4">
          {user.rol === "admin" ? "Administrador" : "Usuario"}
        </Badge>

        <div className="text-start mb-4">
          <Dato>
            <span>Nombre</span>
            <strong>{user.nombre}</strong>
          </Dato>
          <Dato>
            <span>Email</span>
            <strong>{user.email}</strong>
          </Dato>
          <Dato>
            <span>Rol</span>
            <strong>{user.rol}</strong>
          </Dato>
        </div>

        <div className="d-flex flex-column gap-2">
          {user.rol === "admin" && (
            <Boton as={Link} to="/dashboard" $variante="secundario">
              <FaCog /> Panel de gestión
            </Boton>
          )}
          <Boton type="button" $variante="peligro" onClick={logout}>
            <FaSignOutAlt /> Cerrar sesión
          </Boton>
        </div>
      </Tarjeta>
    </Container>
  );
};

export default Perfil;
