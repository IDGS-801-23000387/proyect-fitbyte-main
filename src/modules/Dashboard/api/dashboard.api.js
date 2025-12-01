import api from "../../../api/axiosConfig";

// ================================
// 📌 RESUMEN GENERAL
// ================================
export const obtenerResumenGeneral = () =>
  api.get("/dashboard/resumen-general");

 
export const obtenerIngresosMensuales = () =>
  api.get("/dashboard/ingresos-mensuales");

 
export const obtenerMembresiasPorVencer = () =>
  api.get("/dashboard/membresias-por-vencer");

 
export const obtenerTopProductos = () =>
  api.get("/dashboard/top-productos");
 
export const obtenerAsistenciasSemana = () =>
  api.get("/dashboard/asistencias-semana");
