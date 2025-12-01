 
import React, { useEffect, useState } from "react";
import { obtenerCompras } from "../api/comprasApi";
import { History, Eye, Calendar, Package } from "lucide-react";

export default function HistorialComprasPage() {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [detallesCompra, setDetallesCompra] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [imagenesError, setImagenesError] = useState({});

 
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
        day: "numeric"
      });
      
    } catch (error) {
      console.error("Error formateando fecha:", error, fecha);
      return "Error en fecha";
    }
  };

  const manejarErrorImagen = (key) => {
    setImagenesError((prev) => ({ ...prev, [key]: true }));
  };

  
  const normalizarCompra = (compra) => {
    const id = compra.id ?? compra.Id;
    const fechaCompra = compra.fechaCompra ?? compra.FechaCompra;
    const total = compra.total ?? compra.Total ?? 0;
    const items = compra.items ?? compra.Items ?? [];

    return { id, fechaCompra, total, items };
  };

 
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

  
  if (cargando) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Cargando historial de compras...
          </p>
        </div>
      </div>
    );
  }

 
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-3 mb-6">
        <History size={24} /> Historial de Compras
      </h1>

      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Todas las Compras</h2>
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
              Total: {compras.length} compra(s)
            </span>
          </div>
        </div>

        
        <div className="overflow-auto" style={{ maxHeight: '400px' }}>
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-100 whitespace-nowrap border-b border-gray-200">
                  Compra
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-100 whitespace-nowrap border-b border-gray-200">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-100 whitespace-nowrap border-b border-gray-200">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-100 whitespace-nowrap border-b border-gray-200">
                  Productos
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-100 whitespace-nowrap border-b border-gray-200">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {compras.map((c) => {
                const compra = normalizarCompra(c);

                return (
                  <tr key={compra.id} className="hover:bg-gray-50 transition-colors">
                 
                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                      #COMP-{String(compra.id).padStart(4, "0")}
                    </td>

               
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-gray-700">
                          {formatFecha(compra.fechaCompra)}
                        </span>
                      </div>
                    </td>

                 
                    <td className="px-6 py-4 font-bold text-green-700 whitespace-nowrap">
                      ${Number(compra.total ?? 0).toFixed(2)}
                    </td>

                  
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                      {compra.items?.length ?? 0} producto(s)
                    </td>

                 
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => verDetalles(c)}
                        className="px-4 py-2 bg-[#212B36] hover:bg-black text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                      >
                        <Eye size={16} /> Ver Detalles
                      </button>
                    </td>
                  </tr>
                );
              })}

              {compras.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Package size={48} className="text-gray-300 mb-3" />
                      <p className="text-lg font-medium">No hay compras registradas</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Las compras aparecerán aquí una vez que las registres
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

   
      {mostrarModal && detallesCompra && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white shadow-xl rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                Detalles Compra #COMP-
                {String(detallesCompra.id).padStart(4, "0")}
              </h3>

              <button
                onClick={cerrarModal}
                className="text-gray-500 text-3xl hover:text-gray-700 transition-colors"
              >
                ×
              </button>
            </div>

          
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center gap-2 text-lg">
                <Calendar size={20} className="text-gray-600" />
                <span className="text-gray-800">{formatFecha(detallesCompra.fechaCompra)}</span>
              </div>
            </div>

             
            <h4 className="text-xl font-bold mb-4 text-gray-800">
              Productos Comprados ({detallesCompra.items?.length ?? 0})
            </h4>

            <div className="space-y-4">
              {detallesCompra.items?.map((item, index) => {
                const key = `${detallesCompra.id}-${index}`;

               
                const foto =
                  item.fotoUrl && item.fotoUrl !== ""
                    ? item.fotoUrl
                    : item.foto && item.foto !== ""
                    ? item.foto
                    : null;

               
                const precioUnitario =
                  item.precioUnitario ??
                  item.precio ??
                  (item.subtotal && item.cantidad
                    ? item.subtotal / item.cantidad
                    : 0);

                 
                const subtotal =
                  item.subtotal ??
                  (item.cantidad && precioUnitario
                    ? item.cantidad * precioUnitario
                    : 0);

                return (
                  <div
                    key={key}
                    className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                   
                    <div>
                      {foto && !imagenesError[key] ? (
                        <img
                          src={foto}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          onError={() => manejarErrorImagen(key)}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <Package size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                  
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-900">
                        {item.nombre || "Producto"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Cantidad: <b className="text-gray-800">{item.cantidad}</b>
                      </p>
                    </div>

                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Precio unitario:{" "}
                        <b className="text-gray-800">${Number(precioUnitario).toFixed(2)}</b>
                      </p>
                      <p className="text-lg font-bold text-green-700">
                        ${subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

         
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-2xl font-bold text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
                <span className="text-gray-800">Total:</span>
                <span>
                  ${Number(detallesCompra.total ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}