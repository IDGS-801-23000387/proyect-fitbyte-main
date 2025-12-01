import React, { useEffect, useState } from "react";
import { abrirCorte, cerrarCorte, obtenerCortesPorDia } from "../api/corteCaja.api";
import AbrirCorteModal from "../components/AbrirCorteModal";
import { Link } from "react-router-dom";
import { History, PlusCircle, Lock, Eye, Calendar, DollarSign, CheckCircle, XCircle } from "lucide-react";

export default function CorteCaja() {
  const [cortes, setCortes] = useState([]);
  const [modal, setModal] = useState(false);

  const cargar = async () => {
    const hoy = new Date().toISOString().split("T")[0];
    const r = await obtenerCortesPorDia(hoy);
    setCortes(r.data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrir = async (monto) => {
    await abrirCorte(monto);
    setModal(false);
    cargar();
  };

  const cerrar = async () => {
    await cerrarCorte();
    cargar();
  };

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
                Corte de Caja
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mt-1 sm:mt-2">
                Gestiona los cortes de caja del día
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm sm:text-base text-gray-600 bg-gray-100 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
              {cortes.length} corte{cortes.length !== 1 ? "s" : ""} hoy
            </span>
            
            <button
              onClick={() => setModal(true)}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <PlusCircle size={16} className="sm:w-5 sm:h-5" />
              Abrir Corte
            </button>
          </div>
        </div>
        
        {/* SEPARADOR */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 sm:my-6"></div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/60 p-4 sm:p-6">
        {/* TABLA CON SCROLL */}
        <div className="overflow-auto" style={{ maxHeight: "500px", scrollbarWidth: "thin", scrollbarColor: "#b0b0b0 #e5e7eb" }}>
          <table className="w-full min-w-[800px] sm:min-w-0">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#212B36] text-white p-1 rounded">#</span>
                    ID Corte
                  </div>
                </th>
                <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-600" />
                    Fecha Apertura
                  </div>
                </th>
                <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-green-600" />
                    Monto Inicial
                  </div>
                </th>
                <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-blue-600" />
                    Monto Final
                  </div>
                </th>
                <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b">
                  Estado
                </th>
                <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200/50">
              {cortes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* ID */}
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-[#212B36] to-[#1A232C] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-xs sm:text-sm">
                          #{String(c.id).padStart(3, "0")}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900 text-sm sm:text-base">
                        Corte #{c.id}
                      </span>
                    </div>
                  </td>

                  {/* FECHA APERTURA */}
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                      <Calendar size={14} className="text-gray-500 flex-shrink-0" />
                      <span>
                        {new Date(c.fechaApertura).toLocaleString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </td>

                  {/* MONTO INICIAL */}
                  <td className="p-3 sm:p-4">
                    <div className="bg-green-50/70 border border-green-200 p-2 sm:p-3 rounded-lg">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-600" />
                        <span className="font-bold text-green-700 text-sm sm:text-base">
                          ${parseFloat(c.montoInicial).toLocaleString("es-MX", { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* MONTO FINAL */}
                  <td className="p-3 sm:p-4">
                    <div className={`p-2 sm:p-3 rounded-lg ${c.montoFinal ? 'bg-blue-50/70 border border-blue-200' : 'bg-gray-100/70 border border-gray-200'}`}>
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className={c.montoFinal ? "text-blue-600" : "text-gray-400"} />
                        <span className={`font-bold text-sm sm:text-base ${c.montoFinal ? "text-blue-700" : "text-gray-500"}`}>
                          {c.montoFinal ? `$${parseFloat(c.montoFinal).toLocaleString("es-MX", { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}` : "---"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* ESTADO */}
                  <td className="p-3 sm:p-4">
                    {c.estado === 0 ? (
                      <div className="flex items-center gap-2 bg-green-100/70 text-green-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-green-200">
                        <CheckCircle size={14} className="text-green-600" />
                        <span className="font-semibold text-xs sm:text-sm">Abierto</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-100/70 text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-gray-300">
                        <XCircle size={14} className="text-gray-500" />
                        <span className="font-semibold text-xs sm:text-sm">Cerrado</span>
                      </div>
                    )}
                  </td>

                  {/* ACCIONES */}
                  <td className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        to={`/corte-caja/detalle/${c.id}`}
                        className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-3 sm:py-2 bg-[#212B36] hover:bg-black text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        <Eye size={14} />
                        <span>Ver</span>
                      </Link>

                      {c.estado === 0 && (
                        <button
                          onClick={cerrar}
                          className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-3 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                          <Lock size={14} />
                          <span>Cerrar</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {cortes.length === 0 && (
                <tr>
                  <td className="p-4 sm:p-6 text-center" colSpan="6">
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                      <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4">
                        <History className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-base sm:text-lg font-semibold mb-2">
                        No hay cortes registrados hoy
                      </p>
                      <p className="text-gray-500 text-sm sm:text-base">
                        Abre un nuevo corte para comenzar
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-300/50">
        <div className="text-center text-gray-500 text-xs sm:text-sm">
          <p>Sistema de Gestión de Cortes de Caja</p>
          <p className="mt-1">Fecha: {new Date().toLocaleDateString("es-ES", { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </div>

      {/* MODAL */}
      <AbrirCorteModal
        open={modal}
        onClose={() => setModal(false)}
        onSubmit={abrir}
      />
    </div>
  );
}