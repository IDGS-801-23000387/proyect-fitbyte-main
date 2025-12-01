import api from "../../../api/axiosConfig";

 
export const obtenerProveedoresActivos = async () => {
  try {
    const response = await api.get("Proveedores/activos");
    console.log(" RESPUESTA CRUDA DE PROVEEDORES:", response);

    let proveedoresData = [];

   
    if (Array.isArray(response.data)) {
      proveedoresData = response.data;
    }

    const proveedoresMapeados = proveedoresData.map((proveedor) => ({
      id: proveedor.id ?? proveedor.Id,
      nombreEmpresa: proveedor.nombreEmpresa ?? proveedor.NombreEmpresa,
      personaContacto: proveedor.personaContacto ?? proveedor.PersonaContacto,
      telefono: proveedor.telefono ?? proveedor.Telefono,
      email: proveedor.email ?? proveedor.Email,
      direccion: proveedor.direccion ?? proveedor.Direccion,
      rfc: proveedor.rfc ?? proveedor.RFC,
      activo: proveedor.activo ?? proveedor.Activo,
      fechaRegistro: proveedor.fechaRegistro ?? proveedor.FechaRegistro,
      productos: proveedor.productos ?? proveedor.Productos,
    }));

    console.log(" PROVEEDORES MAPEADOS:", proveedoresMapeados);

    return proveedoresMapeados;   
  } catch (error) {
    console.error(" Error en obtenerProveedoresActivos:", error);
    return [];
  }
};

 
export const registrarProveedor = (data) => {
  const payload = {
    NombreEmpresa: data.nombreEmpresa,
    PersonaContacto: data.personaContacto,
    Telefono: data.telefono,
    Email: data.email,
    Direccion: data.direccion,
    RFC: data.rfc,
  };
  return api.post("Proveedores/registrar", payload);
};
 
export const actualizarProveedor = (id, data) => {
  const payload = {
    NombreEmpresa: data.nombreEmpresa,
    PersonaContacto: data.personaContacto,
    Telefono: data.telefono,
    Email: data.email,
    Direccion: data.direccion,
    RFC: data.rfc,
     
  };
  return api.put(`Proveedores/${id}`, payload);
};

 
export const eliminarProveedor = (id) => api.delete(`Proveedores/${id}`);

 
export const obtenerProveedor = (id) => api.get(`Proveedores/${id}`);

 
export const activarProveedor = (id) => api.put(`Proveedores/activar/${id}`);
