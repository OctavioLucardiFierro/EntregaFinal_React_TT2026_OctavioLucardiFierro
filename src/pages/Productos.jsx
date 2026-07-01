import ItemListContainer from "../components/productos/ItemListContainer";
import Seo from "../components/ui/Seo";

const Productos = () => (
  <>
    <Seo
      titulo="Catálogo"
      descripcion="Explorá todo el catálogo de videojuegos de PlayStation 5 y PS4 disponibles en PS Store."
    />
    <ItemListContainer />
  </>
);

export default Productos;
