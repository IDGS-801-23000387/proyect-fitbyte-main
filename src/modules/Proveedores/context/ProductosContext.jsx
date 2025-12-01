 
import { createContext, useContext, useState } from "react";

import {
  registrarProducto as registrarProductoApi,
  registrarProductosMultiples as registrarMultiplesApi,
  actualizarProducto as actualizarProductoApi,
  eliminarProductoApi,
  obtenerProductosPorProveedor as obtenerProductosApi,
} from "../api/productosApi";

const ProductosContext = createContext();
export const useProductos = () => useContext(ProductosContext);

 
const normalizarProducto = (p) => ({
  id: p.id ?? p.Id,
  proveedorId: p.proveedorId ?? p.ProveedorId,
  nombre: p.nombre ?? p.Nombre,
  categoria: p.categoria ?? p.Categoria,
  precio: p.precio ?? p.Precio,  
  precioUnitario: p.precioUnitario ?? p.PrecioUnitario,  
  precioFinal: p.precioFinal ?? p.PrecioFinal,  
  piezasPorPaquete: p.piezasPorPaquete ?? p.PiezasPorPaquete,
  fotoUrl: p.fotoUrl ?? p.FotoUrl,
  activo: p.activo ?? p.Activo,
});

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

 
  const obtenerProductosPorProveedor = async (proveedorId) => {
    try {
      if (!proveedorId) {
        setProductos([]);
        return;
      }

      setCargando(true);
      setError(null);

      const resp = await obtenerProductosApi(proveedorId);

      let raw = [];

      if (Array.isArray(resp)) {
        raw = resp;
      } else if (resp && Array.isArray(resp.data)) {
        raw = resp.data;
      } else if (resp?.data) {
        raw = [resp.data];
      }

      const normalizados = raw.map(normalizarProducto);

      console.log("PRODUCTOS NORMALIZADOS:", normalizados);

      setProductos(normalizados);
    } catch (err) {
      console.error(" Error obteniendo productos:", err);
      setError("No se pudieron cargar los productos.");
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };


  const crearProducto = async (prod) => {
    try {
      setCargando(true);
      setError(null);

      const fd = new FormData();
      fd.append("ProveedorId", String(prod.proveedorId));
      fd.append("Nombre", prod.nombre);
      fd.append("Precio", String(prod.precio)); 
      fd.append("Categoria", prod.categoria);
      fd.append("PiezasPorPaquete", String(prod.piezasPorPaquete));

     
      fd.append("PrecioFinal", String(prod.precioFinal ?? 0));

      if (prod.foto) fd.append("Foto", prod.foto);

      await registrarProductoApi(fd);

      await obtenerProductosPorProveedor(prod.proveedorId);
    } catch (err) {
      console.error(" Error al crear producto:", err);
      setError("No se pudo crear el producto.");
      throw err;
    } finally {
      setCargando(false);
    }
  };

  
  const editarProducto = async (id, prod) => {
    try {
      setCargando(true);
      setError(null);

      const fd = new FormData();
      fd.append("Nombre", prod.nombre);
      fd.append("Precio", String(prod.precio)); 
      fd.append("Categoria", prod.categoria);
      fd.append("PiezasPorPaquete", String(prod.piezasPorPaquete));
      fd.append("Activo", String(prod.activo ?? true));

      
      fd.append("PrecioFinal", String(prod.precioFinal ?? 0));

      if (prod.foto) fd.append("Foto", prod.foto);

      await actualizarProductoApi(id, fd);
      await obtenerProductosPorProveedor(prod.proveedorId);
    } catch (err) {
      console.error(" Error al editar producto:", err);
      setError("No se pudo editar el producto.");
      throw err;
    } finally {
      setCargando(false);
    }
  };


  const eliminarProducto = async (id, proveedorId) => {
    try {
      setCargando(true);
      setError(null);

      await eliminarProductoApi(id);
      await obtenerProductosPorProveedor(proveedorId);
    } catch (err) {
      console.error(" Error al eliminar producto:", err);
      setError("No se pudo eliminar el producto.");
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return (
    <ProductosContext.Provider
      value={{
        productos,
        cargando,
        error,
        obtenerProductosPorProveedor,
        crearProducto,
        editarProducto,
        eliminarProducto,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
};
