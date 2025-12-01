import React from "react";

export default function PreRegistroItem({ item, onAccept, onReject }) {
  const isDisabled = item.estado !== 0;  

  return (
    <div
      className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 md:p-8 transition-all duration-500 shadow-md sm:shadow-lg backdrop-blur-sm
        ${
          isDisabled
            ? "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 opacity-80"
            : "bg-gradient-to-br from-white to-gray-50/80 border-gray-300/80 hover:shadow-xl sm:hover:shadow-2xl hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-[#212B36]/20"
        }
      `}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 truncate">
                {item.nombre}
              </h3>

              {!isDisabled && (
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold bg-green-500 text-white whitespace-nowrap">
                  Nuevo
                </span>
              )}

              {isDisabled && (
                <span
                  className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    item.estado === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.estado === 1 ? "Aceptado" : "Rechazado"}
                </span>
              )}
            </div>
            
            {/* Botones en móvil - solo visible en pantallas pequeñas */}
            <div className="flex sm:hidden gap-2 mb-2">
              <button
                disabled={isDisabled}
                onClick={() => onAccept(item.id)}
                className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 justify-center shadow transition-all duration-300
                  ${
                    isDisabled
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-[#212B36] hover:bg-[#1A232C] text-white active:scale-95"
                  }
                `}
              >
                <i className="fas fa-check"></i>
                {item.estado === 1 ? "Aceptado" : "Aceptar"}
              </button>

              <button
                disabled={isDisabled}
                onClick={() => onReject(item.id)}
                className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 justify-center shadow transition-all duration-300
                  ${
                    isDisabled
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white active:scale-95"
                  }
                `}
              >
                <i className="fas fa-times"></i>
                {item.estado === 2 ? "Rechazado" : "Rechazar"}
              </button>
            </div>
          </div>

          {/* Información del registro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 text-gray-700 bg-white/50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                <i className="fas fa-envelope text-[#212B36] text-sm sm:text-lg"></i>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Correo</p>
                <p className="text-gray-900 font-semibold text-sm sm:text-base truncate">
                  {item.correo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-gray-700 bg-white/50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200">
              <div className="bg-green-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                <i className="fas fa-phone text-[#212B36] text-sm sm:text-lg"></i>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Teléfono</p>
                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                  {item.telefono}
                </p>
              </div>
            </div>
          </div>

          {/* Fecha - ocupa todo el ancho en móviles, se mueve a la derecha en tablets+ */}
          {item.fecha && (
            <div className="flex items-center gap-2 sm:gap-3 text-gray-600 bg-gray-100/50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200">
              <div className="bg-purple-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                <i className="fas fa-calendar text-[#212B36] text-sm sm:text-lg"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Solicitado</p>
                <p className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base truncate">
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

        {/* Botones en desktop - ocultos en móvil */}
        <div className="hidden sm:flex flex-col gap-2 sm:gap-3 min-w-[120px] sm:min-w-[140px]">
          <button
            disabled={isDisabled}
            onClick={() => onAccept(item.id)}
            className={`px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 sm:gap-3 justify-center shadow transition-all duration-300
              ${
                isDisabled
                  ? "bg-gray-400 text-white cursor-not-allowed transform scale-95"
                  : "bg-[#212B36] hover:bg-[#1A232C] text-white hover:shadow-lg sm:hover:shadow-xl hover:scale-105 active:scale-95"
              }
            `}
          >
            <i className="fas fa-check text-sm sm:text-lg"></i>
            {item.estado === 1 ? "Aceptado" : "Aceptar"}
          </button>

          <button
            disabled={isDisabled}
            onClick={() => onReject(item.id)}
            className={`px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 sm:gap-3 justify-center shadow transition-all duration-300
              ${
                isDisabled
                  ? "bg-gray-400 text-white cursor-not-allowed transform scale-95"
                  : "bg-red-600 hover:bg-red-700 text-white hover:shadow-lg sm:hover:shadow-xl hover:scale-105 active:scale-95"
              }
            `}
          >
            <i className="fas fa-times text-sm sm:text-lg"></i>
            {item.estado === 2 ? "Rechazado" : "Rechazar"}
          </button>
        </div>
      </div>
    </div>
  );
}