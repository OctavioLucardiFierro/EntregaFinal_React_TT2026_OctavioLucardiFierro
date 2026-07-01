import { Row, Col } from "react-bootstrap";
import ItemCard from "./ItemCard";

// ===========================================================================
//  >>> GRILLA DE PRODUCTOS: aca se manejan las COLUMNAS y FILAS <<<
//  ---------------------------------------------------------------------------
//  React-Bootstrap reparte cada fila en 12 unidades. Los props del <Row>
//  indican cuantas COLUMNAS (tarjetas) entran por fila segun el ancho:
//     xs -> celular        => 1 por fila  (NO tocar: mantiene el movil)
//     sm -> tablet chica   => 2 por fila
//     md -> tablet / laptop=> 4 por fila
//     lg -> escritorio     => 6 por fila  (tarjetas a la mitad de tamano)
//  Mas columnas = tarjetas mas chicas. El "g-3" es el espacio entre tarjetas.
// ===========================================================================
const ItemList = ({ productos }) => (
  <Row xs={1} sm={2} md={4} lg={6} className="g-3">
    {productos.map((producto) => (
      <Col key={producto.id}>
        <ItemCard producto={producto} />
      </Col>
    ))}
  </Row>
);

export default ItemList;
