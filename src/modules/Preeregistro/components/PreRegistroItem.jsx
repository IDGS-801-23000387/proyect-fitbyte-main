import React from "react";

export default function PreRegistroItem({ item, onAccept, onReject }) {
  const isDisabled = item.estado !== 0;  

  return (
    <div
      className={`rounded-2xl border-2 p-8 transition-all duration-500 shadow-lg backdrop-blur-sm
        ${
          isDisabled
            ? "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 opacity-80"
            : "bg-gradient-to-br from-white to-gray-50/80 border-gray-300/80 hover:shadow-2xl hover:scale-[1.02] hover:border-[#212B36]/20"
        }
      `}
    >
      <div className="flex items-start justify-between gap-6">
        
        <div className="flex items-start flex-1">
         
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-bold text-2xl text-gray-900">
                {item.nombre}
              </h3>

               
              {!isDisabled && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                  Nuevo
                </span>
              )}

              {isDisabled && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.estado === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.estado === 1 ? "Aceptado" : "Rechazado"}
                </span>
              )}
            </div>

          
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3 text-gray-700 bg-white/50 p-3 rounded-xl border border-gray-200">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <i className="fas fa-envelope text-[#212B36] text-lg"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Correo</p>
                  <p className="text-gray-900 font-semibold truncate">
                    {item.correo}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700 bg-white/50 p-3 rounded-xl border border-gray-200">
                <div className="bg-green-100 p-2 rounded-lg">
                  <i className="fas fa-phone text-[#212B36] text-lg"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Teléfono</p>
                  <p className="text-gray-900 font-semibold">
                    {item.telefono}
                  </p>
                </div>
              </div>
            </div>

            
            {item.fecha && (
              <div className="flex items-center gap-3 text-gray-600 bg-gray-100/50 p-3 rounded-xl border border-gray-200">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <i className="fas fa-calendar text-[#212B36] text-lg"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Solicitado
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(item.fecha).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

         
        <div className="flex flex-col gap-3 min-w-[140px]">
          <button
            disabled={isDisabled}
            onClick={() => onAccept(item.id)}
            className={`px-6 py-3 rounded-xl font-bold text-sm min-w-[140px] flex items-center gap-3 justify-center shadow-lg transition-all duration-300
              ${
                isDisabled
                  ? "bg-gray-400 text-white cursor-not-allowed transform scale-95"
                  : "bg-[#212B36] hover:bg-[#1A232C] text-white hover:shadow-xl hover:scale-105 active:scale-95"
              }
            `}
          >
            <i className="fas fa-check text-lg"></i>
            {item.estado === 1 ? "Aceptado" : "Aceptar"}
          </button>

          <button
            disabled={isDisabled}
            onClick={() => onReject(item.id)}
            className={`px-6 py-3 rounded-xl font-bold text-sm min-w-[140px] flex items-center gap-3 justify-center shadow-lg transition-all duration-300
              ${
                isDisabled
                  ? "bg-gray-400 text-white cursor-not-allowed transform scale-95"
                  : "bg-red-600 hover:bg-red-700 text-white hover:shadow-xl hover:scale-105 active:scale-95"
              }
            `}
          >
            <i className="fas fa-times text-lg"></i>
            {item.estado === 2 ? "Rechazado" : "Rechazar"}
          </button>
        </div>
      </div>
    </div>
  );
}
