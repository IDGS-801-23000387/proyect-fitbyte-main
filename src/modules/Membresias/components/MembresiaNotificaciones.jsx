import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import MembresiaModal from "./MembresiaModal";

export default function MembresiaNotificaciones({ alertas = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
   
      <button
        className="relative p-2 bg-white shadow rounded-full hover:bg-gray-100 transition"
        onClick={() => setOpen(true)}
      >
        <Bell size={22} className="text-gray-700" />

      
        {alertas.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {alertas.length}
          </span>
        )}
      </button>

       
      <MembresiaModal open={open} onClose={() => setOpen(false)}>
        <div className="flex justify-between items-center pb-3 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Membresías por vencer (2 días)
          </h2>

          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {alertas.length === 0 ? (
          <p className="text-gray-600 mt-4">No hay membresías por vencer.</p>
        ) : (
          <div className="mt-4 max-h-[300px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Código</th>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Correo</th>
                  <th className="p-2 text-left">Vence</th>
                </tr>
              </thead>
              <tbody>
                {alertas.map((m, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{m.codigoCliente}</td>
                    <td className="p-2 font-medium">{m.nombre}</td>
                    <td className="p-2">{m.correo}</td>
                    <td className="p-2 text-red-600 font-semibold">
                      {m.fechaVencimiento
                        ? new Date(m.fechaVencimiento).toLocaleDateString(
                            "es-MX"
                          )
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MembresiaModal>
    </div>
  );
}
