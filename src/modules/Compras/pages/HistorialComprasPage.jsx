import React, { useEffect, useState } from "react";
import { obtenerCompras } from "../api/comprasApi";
import { History, Eye, Calendar, Package, X, ShoppingCart, DollarSign, Box } from "lucide-react";

export default function HistorialComprasPage() {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [detallesCompra, setDetallesCompra] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [imagenesError, setImagenesError] = useState({});

  // Cargar compras
  useEffect(() => {
    const cargarCompras = async () => {
      try {
        const data = await obtenerCompras();
        console.log(" Compras cargadas desde API:", data);
        setCompras(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(" Error cargando compras:", error);
        alert("Error al cargar el historial de compras");
      } finally {
        setCargando(false);
      }
    };

    cargarCompras();
  }, []);

  // Formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    
    try {
      const fechaObj = new Date(fecha);
      
      if (isNaN(fechaObj.getTime())) {
        return "Fecha inválida";
      }
      
      return fechaObj.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      
    } catch (error) {
      console.error("Error formateando fecha:", error, fecha);
      return "Error en fecha";
    }
  };

  const manejarErrorImagen = (key) => {
    setImagenesError((prev) => ({ ...prev, [key]: true }));
  };

  // Normalizar compra
  const normalizarCompra = (compra) => {
    const id = compra.id ?? compra.Id;
    const fechaCompra = compra.fechaCompra ?? compra.FechaCompra;
    const total = compra.total ?? compra.Total ?? 0;
    const items = compra.items ?? compra.Items ?? [];

    return { id, fechaCompra, total, items };
  };

  // Ver detalles
  const verDetalles = (compraCruda) => {
    const compra = normalizarCompra(compraCruda);
    console.log(" Detalles normalizados de compra:", compra);
    setDetallesCompra(compra);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setDetallesCompra(null);
    setImagenesError({});
  };

  // Loading state
  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#212B36] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Cargando compras...</p>
          <p className="text-gray-500 text-sm mt-1">Por favor espere un momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="bg-gradient-to-r from-[#212B36] to-[#1A232C] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg w-fit">
              <ShoppingCart className="text-white w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Historial de Compras
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mt-1 sm:mt-2">
                Consulta todas las compras registradas en el sistema
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm sm:text-base text-gray-600 bg-gray-100 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
              {compras.length} compra{compras.length !== 1 ? "s" : ""} registrada{compras.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        
        {/* SEPARADOR */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 sm:my-6"></div>
      </div>

      {/* LISTA DE COMPRAS EN CARDS */}
      <div className="space-y-4 sm:space-y-6">
        {compras.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/60">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg sm:text-xl font-semibold mb-2">
              No hay compras registradas
            </p>
            <p className="text-gray-500 text-sm sm:text-base">
              Realiza tu primera compra para comenzar
            </p>
          </div>
        ) : (
          compras.map((compraCruda) => {
            const compra = normalizarCompra(compraCruda);
            
            return (
              <div 
                key={compra.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/60 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
              >
                {/* PRIMERA FILA: ID Compra y Total */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow">
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        COMPRA #{String(compra.id).padStart(4, "0")}
                      </h2>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-orange-200">
                      <DollarSign size={16} className="text-orange-600" />
                      <span className="font-bold text-orange-700 text-lg sm:text-xl">
                        ${Number(compra.total).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      Total de la compra
                    </span>
                  </div>
                </div>

                {/* SEGUNDA FILA: Información de la compra */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {/* Fecha */}
                  <div className="bg-gray-50/70 border border-gray-200/60 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                        <Calendar size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-500">Fecha y Hora</span>
                    </div>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">
                      {formatFecha(compra.fechaCompra)}
                    </p>
                  </div>

                  {/* Productos */}
                  <div className="bg-gray-50/70 border border-gray-200/60 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg">
                        <Package size={14} className="sm:w-4 sm:h-4 text-green-600" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-500">Productos</span>
                    </div>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">
                      {compra.items?.length ?? 0} producto{compra.items?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* TERCERA FILA: Acciones */}
                <div className="flex flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200/60">
                  <button
                    onClick={() => verDetalles(compraCruda)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#212B36] hover:bg-black text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-2"
                  >
                    <Eye size={14} className="sm:w-4 sm:h-4" />
                    Ver Detalles
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL DE DETALLES */}
      {mostrarModal && detallesCompra && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 relative border border-gray-200/60 max-h-[90vh] overflow-y-auto">
            {/* BOTÓN CERRAR */}
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg"
              onClick={cerrarModal}
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* HEADER DEL MODAL */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-[#212B36] to-[#1A232C] text-white p-2.5 sm:p-3 rounded-xl">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Detalle de Compra #COMP-{String(detallesCompra.id).padStart(4, "0")}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Información completa de la compra
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50/70 p-3 sm:p-4 rounded-xl border border-gray-200/60">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Fecha y Hora</p>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">
                    {formatFecha(detallesCompra.fechaCompra)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Productos</p>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">
                    {detallesCompra.items?.length ?? 0} productos
                  </p>
                </div>
              </div>
            </div>

            {/* PRODUCTOS COMPRADOS */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Box size={20} className="text-gray-700" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Productos Comprados ({detallesCompra.items?.length ?? 0})
                </h3>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#b0b0b0 #e5e7eb" }}>
                {detallesCompra.items?.map((item, index) => {
                  const key = `${detallesCompra.id}-${index}`;

                  // Normalizar imagen
                  const foto =
                    item.fotoUrl && item.fotoUrl !== ""
                      ? item.fotoUrl
                      : item.foto && item.foto !== ""
                      ? item.foto
                      : null;

                  // Normalizar precio unitario
                  const precioUnitario =
                    item.precioUnitario ??
                    item.precio ??
                    (item.subtotal && item.cantidad
                      ? item.subtotal / item.cantidad
                      : 0);

                  // Normalizar subtotal
                  const subtotal =
                    item.subtotal ??
                    (item.cantidad && precioUnitario
                      ? item.cantidad * precioUnitario
                      : 0);

                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/70 rounded-xl border border-gray-200/60 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* IMAGEN DEL PRODUCTO */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border border-gray-200">
                        {foto && !imagenesError[key] ? (
                          <img
                            src={foto}
                            alt={item.nombre || "Producto"}
                            className="w-full h-full object-cover"
                            onError={() => manejarErrorImagen(key)}
                          />
                        ) : (
                          <Package className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>

                      {/* INFORMACIÓN DEL PRODUCTO */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate mb-1">
                          {item.nombre || "Producto sin nombre"}
                        </p>
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">Cantidad: {item.cantidad || 0}</span>
                          <span className="bg-blue-50 px-2 py-0.5 rounded">Precio: ${Number(precioUnitario).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* SUBTOTAL */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-orange-700 text-base sm:text-lg">
                          ${Number(subtotal).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Subtotal</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TOTAL */}
            <div className="pt-4 border-t border-gray-200/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-gray-600 text-sm sm:text-base">
                  <p className="mb-1">Compra registrada exitosamente</p>
                  <p className="text-xs">ID de compra: #{detallesCompra.id}</p>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                  <div className="flex flex-col items-end">
                    <span className="text-sm sm:text-base font-medium mb-1">Total de la compra</span>
                    <span className="text-2xl sm:text-3xl font-bold">
                      ${Number(detallesCompra.total ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-300/50">
        <div className="text-center text-gray-500 text-xs sm:text-sm">
          <p>Sistema de Gestión de Compras</p>
          <p className="mt-1">Última actualización: {new Date().toLocaleDateString("es-ES")}</p>
        </div>
      </div>
    </div>
  );
}