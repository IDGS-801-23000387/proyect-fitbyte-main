import React, { useState, useEffect } from "react";

export default function RenovarMembresiaModal({ open, onClose, onSubmit, item }) {
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [monto, setMonto] = useState("");
  const [formaPago, setFormaPago] = useState("Efectivo");

  // Limpiar cada que se abre
  useEffect(() => {
    if (open) {
      setNuevaFecha("");
      setMonto("");
      setFormaPago("Efectivo");
    }
  }, [open]);

  if (!open) return null;

  const enviar = () => {
    const payload = {
      nuevaFechaVencimiento: nuevaFecha,
      tipoPago: formaPago,
      montoPagado: Number(monto),
    };

    console.log("📦 PAYLOAD desde MODAL:", payload);
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full">

        <h2 className="text-2xl font-bold mb-4">
          Renovar Membresía — {item?.nombre}
        </h2>

        {/* Fecha */}
        <label className="font-medium">Nueva Fecha de Vencimiento</label>
        <input
          type="date"
          value={nuevaFecha}
          onChange={(e) => setNuevaFecha(e.target.value)}
          className="w-full p-3 bg-gray-100 border rounded-lg mt-1 mb-3"
        />

        {/* Monto */}
        <label className="font-medium">Monto Pagado</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full p-3 bg-gray-100 border rounded-lg mt-1 mb-3"
          placeholder="Ejemplo: 350"
        />

        {/* Forma pago */}
        <label className="font-medium">Forma de Pago</label>
        <select
          value={formaPago}
          onChange={(e) => setFormaPago(e.target.value)}
          className="w-full p-3 bg-gray-100 border rounded-lg mt-1 mb-3"
        >
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Transferencia">Transferencia</option>
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
            Cancelar
          </button>

          <button
            onClick={enviar}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}
