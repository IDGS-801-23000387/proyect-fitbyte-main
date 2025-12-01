import React, { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { createEjercicioRequest } from "../api/ejercicios.api";

function EjercicioForm({ rutinaId, onClose, onSaved }) {
  const [form, setForm] = useState({
    nombre: "",
    series: "",
    repeticiones: "",
    descanso: "",
    notas: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rutinaId) return;

    const conf = await Swal.fire({
      icon: "question",
      title: "¿Guardar ejercicio?",
      text: "Este ejercicio se añadirá a la rutina",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!conf.isConfirmed) return;

    setLoading(true);

    try {
      await createEjercicioRequest({
        ...form,
        rutinaId,
      });

      await Swal.fire({
        icon: "success",
        title: "Ejercicio creado correctamente",
        confirmButtonText: "OK",
      });

      onSaved();
      onClose();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al crear ejercicio",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
      <div className="w-full max-w-md bg-white h-full shadow-xl p-6 overflow-y-auto border-l border-gray-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Nuevo ejercicio</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              name="nombre"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Series</label>
              <input
                name="series"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Repeticiones</label>
              <input
                name="repeticiones"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descanso</label>
              <input
                name="descanso"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea
              name="notas"
              rows={3}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#212B36] hover:bg-[#1A222A] text-white rounded-xl font-medium shadow mt-4 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar ejercicio"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EjercicioForm;
