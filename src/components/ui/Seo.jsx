import { Helmet } from "react-helmet-async";

// Componente de SEO (Requerimiento #3): gestiona <title> y <meta description>
// de cada pagina de forma dinamica con React Helmet.
const Seo = ({ titulo, descripcion }) => (
  <Helmet>
    <title>{titulo ? `${titulo} | PS Store` : "PS Store | Videojuegos PlayStation"}</title>
    {descripcion && <meta name="description" content={descripcion} />}
  </Helmet>
);

export default Seo;
