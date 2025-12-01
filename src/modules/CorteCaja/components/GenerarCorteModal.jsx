import React, { useState } from "react";

export default function GenerarCorteModal({ open, onClose, onSubmit }) {
  const [cajaInicial, setCajaInicial] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">

        <h2 className="text-2xl font-bold mb-6">Generar Corte</h2>

        <label className="font-semibold">Caja Inicial:</label>
        <input
          type="number"
          value={cajaInicial}
          onChange={(e) => setCajaInicial(e.target.value)}
          placeholder="Ejemplo: 1000"
          className="w-full p-3 mt-2 border rounded bg-gray-100"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancelar
          </button>

          <button
            onClick={() => onSubmit(Number(cajaInicial))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
          >
            Generar
          </button>
        </div>

      </div>
    </div>
  );
}
