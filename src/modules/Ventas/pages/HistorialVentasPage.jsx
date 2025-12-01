import React, { useEffect, useState } from "react";
import { obtenerVentas, obtenerVentaPorId } from "../api/ventasApi";
import { History, Eye, Calendar, Package, X } from "lucide-react";

export default function HistorialVentasPage() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

 
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerVentas();

        const normalizadas = data.map((v) => ({
          id: v.id ?? v.Id ?? v.ventaId ?? v.VentaId,
          cliente: v.cliente ?? v.Cliente ?? "Mostrador",
          fecha: v.fechaVenta ?? v.FechaVenta,
          total: Number(v.total ?? v.Total ?? 0),
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
        items: (data.items ?? data.Items ?? []).map((i) => ({
          productoId:
            i.productoId ?? i.ProductoId ?? i.id ?? i.Id,
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

 
  const formatFecha = (f) =>
    new Date(f).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

 
  if (cargando)
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando ventas...</p>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
     
      <h1 className="text-2xl font-bold flex items-center gap-3 mb-6">
        <History /> Historial de Ventas
      </h1>

      
      <div className="bg-white shadow rounded-xl overflow-hidden">
         
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">Todas las Ventas</h2>
          <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
            Total: {ventas.length} venta(s)
          </span>
        </div>
 
        <div className="max-h-[65vh] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left">Venta</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {ventas.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    #VENT-{String(v.id).padStart(4, "0")}
                  </td>

                 
                  <td className="px-6 py-4 text-gray-800">{v.cliente}</td>

                  
                  <td className="px-6 py-4 text-gray-800">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-600" />
                      <span>{formatFecha(v.fecha)}</span>
                    </div>
                  </td>

               
                  <td className="px-6 py-4 text-gray-800">
                    <span className="font-bold text-green-700">
                      ${v.total.toFixed(2)}
                    </span>
                  </td>
 
                  <td className="px-6 py-4">
                    <button
                      onClick={() => abrirDetalles(v.id)}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black transition"
                    >
                      <Eye size={16} /> Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

            
          {ventas.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <History size={40} className="mx-auto mb-2" />
              No hay ventas registradas.
            </div>
          )}
        </div>
      </div>
 
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative">
         
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={cerrarModal}
            >
              <X size={24} />
            </button>

          
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Detalle de Venta
              </h2>
              <div className="space-y-1 text-gray-600">
                <p>
                  <strong>Cliente:</strong> {ventaSeleccionada?.cliente || "Cargando..."}
                </p>
                <p>
                  <strong>Fecha:</strong> {ventaSeleccionada ? formatFecha(ventaSeleccionada.fecha) : "Cargando..."}
                </p>
              </div>
            </div>

            {cargandoDetalle || !ventaSeleccionada ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Cargando detalles...</p>
              </div>
            ) : (
              <>
           
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Productos Vendidos ({ventaSeleccionada.items.length})
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {ventaSeleccionada.items.map((i) => (
                      <div
                        key={i.productoId}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                          {i.foto ? (
                            <img
                              src={i.foto}
                              alt={i.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="text-gray-400" size={20} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{i.nombre}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>Cantidad: {i.cantidad}</span>
                            <span>Precio: ${i.precioUnitario.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-green-700 text-lg">
                            ${i.subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              
                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-green-700">
                      ${ventaSeleccionada.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}