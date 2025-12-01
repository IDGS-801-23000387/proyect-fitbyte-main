import api from "../../../api/axiosConfig";

// Abrir corte
export const abrirCorte = (montoInicial) =>
  api.post("/CorteCaja/abrir", montoInicial);

// Cerrar corte
export const cerrarCorte = () =>
  api.post("/CorteCaja/cerrar");

// Obtener cortes de un día
export const obtenerCortesPorDia = (fecha) =>
  api.get(`/CorteCaja/historial/dia?fecha=${fecha}`);

// Obtener corte por ID
export const obtenerCorte = (id) =>
  api.get(`/CorteCaja/${id}`);
