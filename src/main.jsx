import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ReloadPrompt from "./ReloadPrompt.jsx";

import { ProveedoresProvider } from "./modules/Proveedores/context/ProveedoresContext.jsx";
import { ProductosProvider } from "./modules/Proveedores/context/ProductosContext.jsx";

import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";

import { AuthProvider } from "./store/authContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ProveedoresProvider>
        <ProductosProvider>
          <ReloadPrompt />
          <RouterProvider router={router} />
        </ProductosProvider>
      </ProveedoresProvider>
    </AuthProvider>
  </StrictMode>
);
