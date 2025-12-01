 
import api from "../../../api/axiosConfig";

export const obtenerProductos = async () => {
  const res = await api.get("Productos/disponibles");
  return res.data;
};

export const crearVenta = async (venta) => {
  const res = await api.post("Ventas/crear", venta);
  return res.data;
};

export const obtenerVentas = async () => {
  const res = await api.get("Ventas");
  return res.data;
};

export const obtenerVentaPorId = async (id) => {
  const res = await api.get(`Ventas/${id}`);
  return res.data;
};
