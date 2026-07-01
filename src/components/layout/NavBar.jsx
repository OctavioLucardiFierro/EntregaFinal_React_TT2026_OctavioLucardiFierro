import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import {
  FaPlaystation,
  FaUserCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaCog,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import BarraBusqueda from "../busqueda/BarraBusqueda";
import CartWidget from "../carrito/CartWidget";

const estiloNav = {
  backgroundColor: "var(--ps-bg-nav)",
  borderColor: "var(--ps-border)",
};

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar expand="lg" sticky="top" className="border-bottom" style={estiloNav}>
      <Container fluid="lg">
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2 fw-semibold"
        >
          <FaPlaystation color="#3390ff" size={22} />
          <span>
            PS <span style={{ color: "#3390ff" }}>Store</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="nav-principal" />

        <Navbar.Collapse id="nav-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/productos">
              Productos
            </Nav.Link>
            {user?.rol === "admin" && (
              <Nav.Link as={NavLink} to="/dashboard">
                Gestión
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center gap-3 flex-wrap py-2 py-lg-0">
            <BarraBusqueda />
            <CartWidget />

            {user ? (
              <NavDropdown
                align="end"
                id="menu-usuario"
                title={
                  <span className="d-inline-flex align-items-center gap-1">
                    <FaUserCircle /> {user.nombre}
                  </span>
                }
              >
                <NavDropdown.Item as={Link} to="/perfil">
                  <FaUser className="me-2" />
                  Mi perfil
                </NavDropdown.Item>
                {user.rol === "admin" && (
                  <NavDropdown.Item as={Link} to="/dashboard">
                    <FaCog className="me-2" />
                    Panel de gestión
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                  <FaSignOutAlt className="me-2" />
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                className="d-flex align-items-center gap-1"
              >
                <FaSignInAlt /> Ingresar
              </Nav.Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
