 
import api from "../../../api/axiosConfig";

 
export const registrarProducto = (data) =>
  api.post("Productos/registrar", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const registrarProductosMultiples = (data) =>
  api.post("Productos/registrar-multiples", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const actualizarProducto = (id, data) =>
  api.put(`Productos/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

 
export const eliminarProductoApi = (id) => api.delete(`Productos/${id}`);
 
export const obtenerProductosPorProveedor = async (proveedorId) => {
  const resp = await api.get(`Productos/por-proveedor/${proveedorId}`);

  console.log("📦 RESPUESTA CRUDOS PRODUCTOS:", resp.data);

  const lista = Array.isArray(resp.data) ? resp.data : [];

  const productosMapeados = lista.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    categoria: p.categoria,
    precio: p.precio,                   
    precioUnitario: p.precioUnitario,   
    precioFinal: p.precioFinal,         
    fotoUrl: p.fotoUrl,
    piezasPorPaquete: p.piezasPorPaquete,
    proveedorId: p.proveedorId,
    activo: p.activo,
  }));

  console.log(" PRODUCTOS MAPEADOS:", productosMapeados);

  return productosMapeados;
};

 
export const obtenerProductosDisponibles = () =>
  api.get("Productos/disponibles");
