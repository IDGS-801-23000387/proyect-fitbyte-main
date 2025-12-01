import { createContext, useContext, useState, useEffect } from "react";
import {
  registrarProveedor,
  actualizarProveedor,
  eliminarProveedor as apiEliminarProveedor,
  obtenerProveedoresActivos,
} from "../api/proveedoresApi";

const ProveedoresContext = createContext();
export const useProveedores = () => useContext(ProveedoresContext);

export function ProveedoresProvider({ children }) {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    cargarProveedores();
  }, []);

 
  const cargarProveedores = async () => {
    try {
      setCargando(true);
      setError(null);

      console.log(" Iniciando carga de proveedores…");

      const data = await obtenerProveedoresActivos();
      console.log(" Proveedores recibidos del API:", data);

      if (!Array.isArray(data)) {
        console.error(" La API no regresó un array");
        setProveedores([]);
        return;
      }

      
      const proveedoresMapeados = data.map((p) => ({
        id: p.id ?? p.Id,
        nombreEmpresa: p.nombreEmpresa ?? p.NombreEmpresa,
        personaContacto: p.personaContacto ?? p.PersonaContacto,
        telefono: p.telefono ?? p.Telefono,
        email: p.email ?? p.Email,
        direccion: p.direccion ?? p.Direccion,
        rfc: p.rfc ?? p.RFC,
        activo: p.activo ?? p.Activo,
        fechaRegistro: p.fechaRegistro ?? p.FechaRegistro,
        productos: p.productos ?? p.Productos ?? [],
      }));

      console.log(" PROVEEDORES MAPEADOS FINAL:", proveedoresMapeados);

      setProveedores(proveedoresMapeados);
    } catch (err) {
      console.error(" Error al cargar proveedores:", err);
      setError("Error al cargar los proveedores");
      setProveedores([]);
    } finally {
      setCargando(false);
    }
  };


  const crearProveedor = async (data) => {
    try {
      setError(null);
      console.log(" Creando proveedor...", data);
      
      await registrarProveedor(data);
      await cargarProveedores();
      
      console.log("Proveedor creado exitosamente");
      return { success: true };
    } catch (err) {
      console.error(" Error al crear proveedor:", err);
      const errorMsg = err.response?.data?.message || "Error al crear el proveedor";
      setError(errorMsg);
      
      
      throw new Error(errorMsg);
    }
  };

 
  const editarProveedor = async (id, data) => {
    try {
      setError(null);
      console.log(" Editando proveedor...", id, data);
      
      await actualizarProveedor(id, data);
      await cargarProveedores();
      
      console.log("Proveedor editado exitosamente");
      return { success: true };
    } catch (err) {
      console.error(" Error al editar proveedor:", err);
      const errorMsg = err.response?.data?.message || "Error al editar el proveedor";
      setError(errorMsg);
      
      
      throw new Error(errorMsg);
    }
  };


  const eliminarProveedor = async (id) => {
    try {
      setError(null);
      console.log(" Eliminando proveedor...", id);
      
      await apiEliminarProveedor(id);
      await cargarProveedores();
      
      console.log(" Proveedor eliminado exitosamente");
      return { success: true };
    } catch (err) {
      console.error(" Error al eliminar proveedor:", err);
      const errorMsg = err.response?.data?.message || "Error al eliminar el proveedor";
      setError(errorMsg);
      
      
      throw new Error(errorMsg);
    }
  };

  return (
    <ProveedoresContext.Provider
      value={{
        proveedores,
        cargando,
        error,
        crearProveedor,
        editarProveedor,
        eliminarProveedor,
        cargarProveedores,
      }}
    >
      {children}
    </ProveedoresContext.Provider>
  );
}