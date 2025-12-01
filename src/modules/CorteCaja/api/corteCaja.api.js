import api from "../../../api/axiosConfig";

 
export const obtenerCorteDiario = (cajaInicial) =>
  api.get(`/CorteCaja/diario?cajaInicial=${cajaInicial}`);

 
export const cerrarCorte = (data) => api.post("/CorteCaja/cerrar", data);

 
export const obtenerCortesPorDia = (fecha) =>
  api.get(`/CorteCaja/historial/dia?fecha=${fecha}`);

 
export const obtenerCortesSemana = () =>
  api.get(`/CorteCaja/historial/semana`);

 
export const obtenerCortesMes = (year, month) =>
  api.get(`/CorteCaja/historial/mes?year=${year}&month=${month}`);
