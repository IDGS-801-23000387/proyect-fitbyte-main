import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  CreditCard,
  X,
} from "lucide-react";

function FormVisitaModal({ onAddVisita, onClose }) {
  const [formData, setFormData] = useState({
    nombreCliente: "",
    costo: "",
    formaPago: "",
    fechaVenta: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

   
    const apiData = {
      ...formData,
      costo: parseFloat(formData.costo) || 0,
      fechaVenta: new Date(formData.fechaVenta).toISOString(),
    };

    onAddVisita(apiData);  
    onClose();
  };

  const formasPago = [
    "Efectivo",
    "Tarjeta Crédito",
    "Tarjeta Débito",
    "Transferencia",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
       
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Registrar Visita
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete la información de la visita
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

   
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
        
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Cliente
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="nombreCliente"
                value={formData.nombreCliente}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez García"
                required
                className="w-full border border-gray-300 pl-9 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all"
              />
            </div>
          </div>

          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Costo de la Visita
            </label>
            <div className="relative">
              <DollarSign
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="number"
                name="costo"
                value={formData.costo}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="w-full border border-gray-300 pl-9 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all"
              />
            </div>
          </div>

        
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Forma de Pago
            </label>
            <div className="relative">
              <CreditCard
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <select
                name="formaPago"
                value={formData.formaPago}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 pl-9 pr-10 py-2 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all appearance-none bg-white"
              >
                <option value="">Seleccionar forma de pago...</option>
                {formasPago.map((forma) => (
                  <option key={forma} value={forma}>
                    {forma}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                </svg>
              </div>
            </div>
          </div>

         
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Venta
            </label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                name="fechaVenta"
                value={formData.fechaVenta}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 pl-9 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all"
              />
            </div>
          </div>

          {/* RESUMEN */}  {formData.costo && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Resumen de la visita
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Cliente:</span>{" "}
                  {formData.nombreCliente || "No especificado"}
                </p>
                <p>
                  <span className="font-medium">Costo:</span> $
                  {parseFloat(formData.costo || 0).toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Forma de pago:</span>{" "}
                  {formData.formaPago || "No seleccionada"}
                </p>
              </div>
            </div>
          )}

          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Calendar size={16} />
              Guardar Visita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormVisitaModal;