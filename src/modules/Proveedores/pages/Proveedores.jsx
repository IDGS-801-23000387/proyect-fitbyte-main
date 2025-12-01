import React, { useState, useEffect } from "react";
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronRight,
  Package,
  Users,
  AlertCircle,
} from "lucide-react";

import Swal from "sweetalert2";

import ProveedorForm from "../components/ProveedorForm";
import ProveedorEditForm from "../components/ProveedorEditForm";

import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import ProductEditForm from "../components/ProductEditForm";

import { useProveedores } from "../context/ProveedoresContext";
import { useProductos } from "../context/ProductosContext";

function Proveedores() {
  const {
    proveedores,
    cargando: cargandoProveedores,
    error: errorProveedores,
    crearProveedor,
    editarProveedor,
    eliminarProveedor,
  } = useProveedores();

  const {
    productos,
    cargando: cargandoProductos,
    error: errorProductos,
    obtenerProductosPorProveedor,
    editarProducto,
    eliminarProducto,
  } = useProductos();

  const [showFormProveedor, setShowFormProveedor] = useState(false);
  const [proveedorActual, setProveedorActual] = useState(null);
  const [modoEditarProveedor, setModoEditarProveedor] = useState(false);

  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [showFormProducto, setShowFormProducto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const noti = async (icon, title) => {
    await Swal.fire({
      icon,
      title,
      timer: 1600,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });
  };

  useEffect(() => {
    if (proveedorSeleccionado?.id) {
      obtenerProductosPorProveedor(proveedorSeleccionado.id);
    }
  }, [proveedorSeleccionado?.id]);

  const proveedoresFiltrados = proveedores.filter(
    (prov) =>
      prov.nombreEmpresa?.toLowerCase().includes(busqueda.toLowerCase()) ||
      prov.personaContacto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      prov.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const proveedorActivo = proveedorSeleccionado;

  const productosDelProveedor = proveedorActivo
    ? productos.filter((p) => p.proveedorId === proveedorActivo.id)
    : [];

  const handleSaveProveedor = async (data) => {
    try {
      await crearProveedor(data);
      noti("success", "Proveedor registrado");
      setShowFormProveedor(false);
    } catch {
      noti("error", "Error registrando proveedor");
    }
  };

  const handleEditarProveedor = (prov) => {
    setProveedorActual(prov);
    setModoEditarProveedor(true);
    setShowFormProveedor(true);
  };

  const handleUpdateProveedor = async (data) => {
    try {
      await editarProveedor(proveedorActual.id, data);
      noti("success", "Proveedor actualizado");

      setShowFormProveedor(false);
      setProveedorActual(null);
      setModoEditarProveedor(false);

      if (proveedorSeleccionado?.id === proveedorActual.id) {
        setProveedorSeleccionado({ ...proveedorSeleccionado, ...data });
      }
    } catch {
      noti("error", "Error actualizando proveedor");
    }
  };

  const handleDeleteProveedor = async (id, nombreEmpresa) => {
    const c = await Swal.fire({
      icon: "warning",
      title: `¿Eliminar proveedor "${nombreEmpresa}"?`,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#d33",
    });

    if (!c.isConfirmed) return;

    try {
      await eliminarProveedor(id);
      noti("success", "Proveedor eliminado");

      if (proveedorSeleccionado?.id === id) {
        setProveedorSeleccionado(null);
      }
    } catch {
      noti("error", "Error eliminando proveedor");
    }
  };

  const handleSaveProducto = () => {
    noti("success", "Producto agregado");
    setShowFormProducto(false);
  };

  const handleUpdateProducto = async (data, productId) => {
    try {
      const idToUse = productId || productoEditando?.Id;

      if (!idToUse) {
        noti("error", "No se pudo obtener ID del producto");
        return;
      }

      await editarProducto(idToUse, {
        ...data,
        proveedorId: proveedorSeleccionado.id,
      });

      noti("success", "Producto actualizado");
      setProductoEditando(null);
    } catch {
      noti("error", "Error actualizando producto");
    }
  };

  const handleDeleteProducto = async (id) => {
    const c = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar producto?",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#d33",
    });

    if (!c.isConfirmed) return;

    try {
      await eliminarProducto(id, proveedorSeleccionado.id);
      noti("success", "Producto eliminado");
    } catch {
      noti("error", "Error eliminando producto");
    }
  };

  if (cargandoProveedores) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#212B36] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando proveedores...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#212B36] rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Proveedores
              </h1>
              <p className="text-gray-600 text-sm">
                Gestión de proveedores y sus productos
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setModoEditarProveedor(false);
              setProveedorActual(null);
              setShowFormProveedor(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#212B36] hover:bg-[#1A222A] text-white rounded-xl shadow text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Nuevo Proveedor
          </button>
        </div>

        {errorProveedores && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span>{errorProveedores}</span>
          </div>
        )}

        {errorProductos && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span>{errorProductos}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow p-4">
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar proveedor..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212B36]"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {proveedoresFiltrados.map((prov) => {
                  const activo = prov.id === proveedorSeleccionado?.id;

                  return (
                    <div
                      key={prov.id}
                      onClick={() => setProveedorSeleccionado(prov)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                        activo
                          ? "bg-[#212B36] text-white shadow"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            activo ? "bg-white/20" : "bg-gray-200"
                          }`}
                        >
                          <Building
                            className={`w-4 h-4 ${
                              activo ? "text-white" : "text-[#212B36]"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {prov.nombreEmpresa}
                          </p>
                          <p
                            className={`text-xs ${
                              activo ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            {prov.personaContacto || "Sin contacto"}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 ${
                          activo ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                  );
                })}

                {proveedoresFiltrados.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-4">
                    {proveedores.length === 0
                      ? "No hay proveedores registrados."
                      : "No se encontraron proveedores."}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {proveedorActivo ? (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Building className="w-7 h-7 text-[#212B36]" />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          {proveedorActivo.nombreEmpresa}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Contacto:{" "}
                          {proveedorActivo.personaContacto ||
                            "No especificado"}
                        </p>
                        {proveedorActivo.rfc && (
                          <p className="text-xs text-gray-500 mt-1">
                            RFC: {proveedorActivo.rfc}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                            <Phone className="w-3 h-3" />
                            {proveedorActivo.telefono || "Sin teléfono"}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                            <Mail className="w-3 h-3" />
                            {proveedorActivo.email || "Sin correo"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditarProveedor(proveedorActivo)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProveedor(
                            proveedorActivo.id,
                            proveedorActivo.nombreEmpresa
                          )
                        }
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>
                        {proveedorActivo.direccion || "Dirección no especificada"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Productos del proveedor
                      {cargandoProductos && (
                        <span className="text-sm text-gray-500">
                          (Cargando...)
                        </span>
                      )}
                      <span className="text-sm font-normal text-gray-500">
                        ({productosDelProveedor.length} productos)
                      </span>
                    </h3>

                    <button
                      onClick={() => {
                        setProductoEditando(null);
                        setShowFormProducto(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-[#212B36] hover:bg-[#1A222A] text-white rounded-lg text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar producto
                    </button>
                  </div>

                  {productosDelProveedor.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Este proveedor aún no tiene productos registrados.
                    </p>
                  ) : (
                    <div className="mt-2">
                      <ProductTable
                        productos={productosDelProveedor}
                        cargando={cargandoProductos}
                        onEdit={(p) => setProductoEditando(p)}
                        onDelete={handleDeleteProducto}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow p-10 flex flex-col items-center justify-center text-center">
                <Building className="w-10 h-10 text-gray-300 mb-3" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Selecciona un proveedor
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Elige un proveedor del panel izquierdo para ver sus detalles y
                  productos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFormProveedor &&
        (modoEditarProveedor ? (
          <ProveedorEditForm
            proveedor={proveedorActual}
            onCancel={() => {
              setShowFormProveedor(false);
              setProveedorActual(null);
              setModoEditarProveedor(false);
            }}
            onSave={handleUpdateProveedor}
          />
        ) : (
          <ProveedorForm
            onCancel={() => setShowFormProveedor(false)}
            onSave={handleSaveProveedor}
          />
        ))}

      {showFormProducto && proveedorSeleccionado && (
        <ProductForm
          proveedorSeleccionado={proveedorSeleccionado}
          onCancel={() => setShowFormProducto(false)}
          onSave={handleSaveProducto}
        />
      )}

      {productoEditando && (
        <ProductEditForm
          producto={productoEditando}
          productoId={productoEditando?.Id}
          onCancel={() => setProductoEditando(null)}
          onUpdate={handleUpdateProducto}
        />
      )}
    </div>
  );
}

export default Proveedores;
