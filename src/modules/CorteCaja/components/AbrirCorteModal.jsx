import React, { useState } from "react";

export default function AbrirCorteModal({ open, onClose, onSubmit }) {
  const [monto, setMonto] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg">

        <h2 className="text-xl font-bold mb-4 text-center">
          Abrir Corte de Caja
        </h2>

        <label className="text-gray-600 font-medium">Monto inicial:</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full p-3 mt-1 bg-gray-100 border rounded-lg"
          placeholder="Ejemplo: 500"
        />

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={() => onSubmit(Number(monto))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Abrir
          </button>
        </div>
      </div>
    </div>
  );
}
