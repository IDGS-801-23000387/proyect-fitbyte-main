 
import api from "../../../api/axiosConfig";

 
export const obtenerProveedores = async () => {
  try {
    console.log(" Haciendo petición a: Proveedores/activos");
    const res = await api.get("Proveedores/activos");
    console.log(" Respuesta de proveedores:", res.data);
    return res.data;
  } catch (error) {
    console.error(" Error en obtenerProveedores:", error);
    console.error(" Detalles del error:", error.response?.data);
    throw error;
  }
};

 
export const obtenerProductosPorProveedor = async (proveedorId) => {
  try {
    console.log(
      ` Haciendo petición a: Productos/por-proveedor/${proveedorId}`
    );
    const res = await api.get(`Productos/por-proveedor/${proveedorId}`);
    console.log(" Respuesta de productos:", res.data);
    return res.data;
  } catch (error) {
    console.error(" Error en obtenerProductosPorProveedor:", error);
    console.error(" Detalles del error:", error.response?.data);
    throw error;
  }
};

 
export const crearCompra = async (compra) => {
  const res = await api.post("Compras/crear", compra);
  return res.data;
};

 
export const obtenerCompras = async () => {
  const res = await api.get("Compras");
  return res.data;
};
