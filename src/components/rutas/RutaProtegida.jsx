import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Protege rutas privadas (Requerimiento #1).
// - Sin usuario logueado -> redirige a /login.
// - Con roles exigidos y usuario sin ese rol -> redirige al inicio.
const RutaProtegida = ({ children, rolesPermitidos }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaProtegida;
