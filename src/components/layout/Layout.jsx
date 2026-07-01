import { Outlet } from "react-router-dom";
import styled from "styled-components";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Main = styled.main`
  min-height: calc(100vh - 140px);
`;

// Estructura comun a todas las paginas: barra de navegacion, contenido y pie.
const Layout = () => (
  <>
    <NavBar />
    <Main>
      <Outlet />
    </Main>
    <Footer />
  </>
);

export default Layout;
