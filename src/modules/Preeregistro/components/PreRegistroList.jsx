import React from "react";
import PreRegistroItem from "./PreRegistroItem";

export default function PreRegistroList({ registros, onAccept, onReject }) {
  return (
    <div className="h-full flex flex-col">
      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 px-2 sm:px-4 flex-shrink-0 gap-3 sm:gap-0">
        <div className="order-2 sm:order-1">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Solicitudes Pendientes
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Gestiona las solicitudes de pre-registro
          </p>
        </div>

        <span className="order-1 sm:order-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-center">
          {registros.length} solicitud{registros.length !== 1 ? "es" : ""}
        </span>
      </div>

      {/* LISTA CON SCROLL RESPONSIVO */}
      <div
        className="flex-1 overflow-y-auto px-2 sm:px-4"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#b0b0b0 #e5e7eb" }}
      >
        <div className="space-y-3 sm:space-y-4 pb-4">
          {registros.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <i className="fas fa-user-check text-3xl sm:text-4xl mb-3 text-gray-300"></i>
              <p className="text-base sm:text-lg font-semibold">
                No hay solicitudes pendientes
              </p>
              <p className="text-xs sm:text-sm mt-1">
                Todas las solicitudes han sido procesadas
              </p>
            </div>
          ) : (
            registros.map((item, index) => {
              const key =
                item.id || item.Id || `pre-registro-${index}-${Date.now()}`;

              return (
                <PreRegistroItem
                  key={key}
                  item={item}
                  onAccept={onAccept}
                  onReject={onReject}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}