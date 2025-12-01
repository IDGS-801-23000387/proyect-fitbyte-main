import React from "react";
import PreRegistroItem from "./PreRegistroItem";

export default function PreRegistroList({ registros, onAccept, onReject }) {
  return (
    <div className="h-full flex flex-col">
    
      <div className="flex justify-between items-center mb-6 px-2 flex-shrink-0">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Solicitudes Pendientes
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las solicitudes de pre-registro
          </p>
        </div>

        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {registros.length} solicitud{registros.length !== 1 ? "es" : ""}
        </span>
      </div>

       
      <div
        className="flex-1 overflow-y-auto px-2"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#b0b0b0 #e5e7eb" }}
      >
        <div className="space-y-4 pb-4">
          {registros.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-user-check text-4xl mb-3 text-gray-300"></i>
              <p className="text-lg font-semibold">
                No hay solicitudes pendientes
              </p>
              <p className="text-sm mt-1">
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
