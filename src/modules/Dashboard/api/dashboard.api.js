
import api from "../../../api/axiosConfig";

export const obtenerResumenGeneral = () =>
  api.get("/dashboardv2/resumen-general");

export const obtenerIngresosMensuales = () =>
  api.get("/dashboardv2/ingresos-mensuales");

export const obtenerMembresiasPorVencer = () =>
  api.get("/dashboardv2/membresias-por-vencer");

export const obtenerTopProductos = () =>
  api.get("/dashboardv2/top-productos");
