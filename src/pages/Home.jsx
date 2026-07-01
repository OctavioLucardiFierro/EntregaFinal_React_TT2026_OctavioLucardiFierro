import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { FaGamepad, FaTruck, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { Boton } from "../styles/ui";
import Seo from "../components/ui/Seo";

const Hero = styled.header`
  text-align: center;
  padding: 84px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: radial-gradient(circle at 50% -10%, rgba(51, 144, 255, 0.14), transparent 55%);
`;

const Eyebrow = styled.p`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  margin: 0 0 14px;
`;

const Titulo = styled.h1`
  font-size: clamp(30px, 5vw, 48px);
  font-weight: 700;
  line-height: 1.15;
  margin: 0 auto 16px;
  max-width: 640px;
`;

const Subtitulo = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 440px;
  margin: 0 auto 28px;
`;

const Tarjeta = styled.div`
  background-color: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 28px 24px;
  text-align: center;
  height: 100%;

  svg {
    color: ${({ theme }) => theme.colors.accent};
    margin-bottom: 14px;
  }

  h3 {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 8px;
  }

  p {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0;
    line-height: 1.5;
  }
`;

const beneficios = [
  {
    icono: <FaGamepad size={26} />,
    titulo: "Exclusivos PS5",
    desc: "Los mejores títulos de nueva generación al mejor precio.",
  },
  {
    icono: <FaTruck size={26} />,
    titulo: "Envío en 24hs",
    desc: "Recibí tu juego al día siguiente en todo el país.",
  },
  {
    icono: <FaShieldAlt size={26} />,
    titulo: "Compra segura",
    desc: "Pagos protegidos con encriptación de extremo a extremo.",
  },
];

const Home = () => (
  <>
    <Seo
      titulo="Inicio"
      descripcion="PS Store: los mejores videojuegos exclusivos de PlayStation 5 y PS4 al mejor precio. Envío en 24hs y compra segura."
    />

    <Hero>
      <Eyebrow>PlayStation Store</Eyebrow>
      <Titulo>
        Tu próximo juego favorito está aquí
      </Titulo>
      <Subtitulo>
        Descubrí los mejores exclusivos de PS5 y PS4 con envío rápido y pago seguro.
      </Subtitulo>
      <Boton as={Link} to="/productos">
        Ver catálogo <FaArrowRight />
      </Boton>
    </Hero>

    <Container className="py-5">
      <Row className="g-4">
        {beneficios.map((b) => (
          <Col xs={12} md={4} key={b.titulo}>
            <Tarjeta>
              {b.icono}
              <h3>{b.titulo}</h3>
              <p>{b.desc}</p>
            </Tarjeta>
          </Col>
        ))}
      </Row>
    </Container>
  </>
);

export default Home;
