import React, { useEffect, useState } from "react";
import { obtenerVentas, obtenerVentaPorId } from "../api/ventasApi";
import { History, Eye, Calendar, Package, X, User, DollarSign, Receipt } from "lucide-react";

export default function HistorialVentasPage() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // Cargar ventas
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerVentas();

        const normalizadas = data.map((v) => ({
          id: v.id ?? v.Id ?? v.ventaId ?? v.VentaId,
          cliente: v.cliente ?? v.Cliente ?? "Mostrador",
          fecha: v.fechaVenta ?? v.FechaVenta,
          total: Number(v.total ?? v.Total ?? 0),
          metodoPago: v.metodoPago ?? v.MetodoPago ?? "Efectivo",
        }));

        setVentas(normalizadas);
      } catch (e) {
        console.error(e);
        alert("Error cargando ventas");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Abrir detalles de venta
  const abrirDetalles = async (id) => {
    try {
      setCargandoDetalle(true);
      setShowModal(true);

      const data = await obtenerVentaPorId(id);

      const venta = {
        id: data.id ?? data.Id,
        cliente: data.cliente ?? data.Cliente,
        fecha: data.fechaVenta ?? data.FechaVenta,
        total: Number(data.total ?? data.Total ?? 0),
        metodoPago: data.metodoPago ?? data.MetodoPago ?? "Efectivo",
        items: (data.items ?? data.Items ?? []).map((i) => ({
          productoId: i.productoId ?? i.ProductoId ?? i.id ?? i.Id,
          nombre: i.nombre ?? i.Nombre,
          cantidad: i.cantidad ?? i.Cantidad,
          precioUnitario: Number(i.precioUnitario ?? i.PrecioUnitario ?? 0),
          subtotal: Number(i.subtotal ?? i.Subtotal ?? 0),
          foto: i.foto ?? i.Foto ?? null,
        })),
      };

      setVentaSeleccionada(venta);
    } catch (e) {
      console.error(e);
      alert("Error cargando detalles de venta");
    } finally {
      setCargandoDetalle(false);
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setVentaSeleccionada(null);
  };

  // Formatear fecha
  const formatFecha = (f) =>
    new Date(f).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Loading state
  if (cargando)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#212B36] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Cargando ventas...</p>
          <p className="text-gray-500 text-sm mt-1">Por favor espere un momento</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="bg-gradient-to-r from-[#212B36] to-[#1A232C] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg w-fit">
              <History className="text-white w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Historial de Ventas
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mt-1 sm:mt-2">
                Consulta todas las ventas registradas en el sistema
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm sm:text-base text-gray-600 bg-gray-100 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
              {ventas.length} venta{ventas.length !== 1 ? "s" : ""} registrada{ventas.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        
        {/* SEPARADOR */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 sm:my-6"></div>
      </div>

      {/* LISTA DE VENTAS EN CARDS */}
      <div className="space-y-4 sm:space-y-6">
        {ventas.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/60">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg sm:text-xl font-semibold mb-2">
              No hay ventas registradas
            </p>
            <p className="text-gray-500 text-sm sm:text-base">
              Realiza tu primera venta para comenzar
            </p>
          </div>
        ) : (
          ventas.map((venta) => (
            <div 
              key={venta.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/60 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* PRIMERA FILA: ID Venta y Total */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow">
                    <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      VENTA #{String(venta.id).padStart(4, "0")}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <User size={14} className="text-gray-500" />
                      <span className="text-gray-600 text-sm sm:text-base">
                        {venta.cliente}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-green-200">
                    <DollarSign size={16} className="text-green-600" />
                    <span className="font-bold text-green-700 text-lg sm:text-xl">
                      ${venta.total.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    Total de la venta
                  </span>
                </div>
              </div>

              {/* SEGUNDA FILA: Información de la venta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Fecha */}
                <div className="bg-gray-50/70 border border-gray-200/60 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                      <Calendar size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Fecha y Hora</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">
                    {formatFecha(venta.fecha)}
                  </p>
                </div>

                {/* Cliente */}
                <div className="bg-gray-50/70 border border-gray-200/60 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg">
                      <User size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Cliente</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">
                    {venta.cliente}
                  </p>
                </div>

                {/* Método de Pago */}
                <div className="bg-gray-50/70 border border-gray-200/60 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-orange-100 p-1.5 sm:p-2 rounded-lg">
                      <DollarSign size={14} className="sm:w-4 sm:h-4 text-orange-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Método de Pago</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">
                    {venta.metodoPago}
                  </p>
                </div>
              </div>

              {/* TERCERA FILA: Acciones */}
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200/60">
                <button
                  onClick={() => abrirDetalles(venta.id)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#212B36] hover:bg-black text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-2"
                >
                  <Eye size={14} className="sm:w-4 sm:h-4" />
                  Ver Detalles
                </button>
               
              
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL DE DETALLES */}
      {showModal && (
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
                  <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Detalle de Venta #{ventaSeleccionada ? String(ventaSeleccionada.id).padStart(4, "0") : "..."}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Información completa de la transacción
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-gray-50/70 p-3 sm:p-4 rounded-xl border border-gray-200/60">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Cliente</p>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">
                    {ventaSeleccionada?.cliente || "Cargando..."}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Fecha y Hora</p>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">
                    {ventaSeleccionada ? formatFecha(ventaSeleccionada.fecha) : "Cargando..."}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Método de Pago</p>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">
                    {ventaSeleccionada?.metodoPago || "Cargando..."}
                  </p>
                </div>
              </div>
            </div>

            {cargandoDetalle || !ventaSeleccionada ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-3 border-[#212B36] border-t-transparent mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm sm:text-base">Cargando detalles...</p>
              </div>
            ) : (
              <>
                {/* PRODUCTOS VENDIDOS */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Package size={20} className="text-gray-700" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Productos Vendidos ({ventaSeleccionada.items.length})
                    </h3>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#b0b0b0 #e5e7eb" }}>
                    {ventaSeleccionada.items.map((item) => (
                      <div
                        key={item.productoId}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/70 rounded-xl border border-gray-200/60 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                          {item.foto ? (
                            <img
                              src={item.foto}
                              alt={item.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate mb-1">
                            {item.nombre}
                          </p>
                          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">Cantidad: {item.cantidad}</span>
                            <span className="bg-blue-50 px-2 py-0.5 rounded">Precio: ${item.precioUnitario.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-green-700 text-base sm:text-lg">
                            ${item.subtotal.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">Subtotal</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TOTAL */}
                <div className="pt-4 border-t border-gray-200/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-gray-600 text-sm sm:text-base">
                      <p className="mb-1">Venta procesada exitosamente</p>
                      <p className="text-xs">ID de transacción: #{ventaSeleccionada.id}</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                      <div className="flex flex-col items-end">
                        <span className="text-sm sm:text-base font-medium mb-1">Total de la venta</span>
                        <span className="text-2xl sm:text-3xl font-bold">
                          ${ventaSeleccionada.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-300/50">
        <div className="text-center text-gray-500 text-xs sm:text-sm">
          <p>Sistema de Gestión de Ventas</p>
          <p className="mt-1">Última actualización: {new Date().toLocaleDateString("es-ES")}</p>
        </div>
      </div>
    </div>
  );
}