import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "styled-components";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import App from "./App.jsx";
import { theme } from "./styles/theme.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductosProvider } from "./context/ProductosContext.jsx";
import { CarritoProvider } from "./context/CartContext.jsx";
import { BusquedaProvider } from "./context/BusquedaContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <ProductosProvider>
              <CarritoProvider>
                <BusquedaProvider>
                  <App />
                </BusquedaProvider>
              </CarritoProvider>
            </ProductosProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);
