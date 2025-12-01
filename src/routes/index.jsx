import { createBrowserRouter, Navigate } from "react-router-dom";
import { loginRoutes } from "../modules/Login";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Visitas from "../modules/Visitas/pages/Visitas";
import Membresias from "../modules/Membresias/pages/Membresias";
import Proveedores from "../modules/Proveedores/pages/Proveedores";
import Asistencia from "../modules/Asistencia/pages/Asistencia";
import ResultadoAsistencia from "../modules/Asistencia/pages/ResultadoAsistencia";
import Dashboard from "../modules/Dashboard/pages/Dashboard";
 import CorteCaja from "../modules/CorteCaja/pages/CorteCaja";
import CompraPage from "../modules/Compras";
import HistorialComprasPage from "../modules/Compras/pages/HistorialComprasPage";
import VentaPage from "../modules/Ventas";
import HistorialVentasPage from "../modules/Ventas/pages/HistorialVentasPage";
import CorteDetalle from "../modules/CorteCaja/pages/CorteDetalle";
import PreRegistroPage from "../modules/Preeregistro/pages/PreRegistroPage";
import Rutinas from "../modules/Rutinas/pages/Rutinas";


const router = createBrowserRouter([

  {
    path: "/auth",
    children: [...loginRoutes],
  },

  {
    path: "/",
    element: <Navigate to="/auth/login" />,
  },

  
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "home", element: <Home /> },
      { path: "asistencia", element: <Asistencia /> },
      { path: "asistencia/resultado", element: <ResultadoAsistencia /> },
      { path: "visitas", element: <Visitas /> },
      { path: "membresias", element: <Membresias /> },
      { path: "proveedores", element: <Proveedores /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "corte-caja", element: <CorteCaja /> },   
        { path: "corte-caja/detalle/:id", element: <CorteDetalle />}, 
      { path: "pre-registro", element: <PreRegistroPage /> },
      { path: "compras", element: <CompraPage /> },
      { path: "compras/historial", element: <HistorialComprasPage /> },

      { path: "ventas", element: <VentaPage /> },
      { path: "ventas/historial", element: <HistorialVentasPage /> },

     
      { path: "rutinas", element: <Rutinas /> },
    ],
  },

   
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
