import React, { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { updateEjercicioRequest } from "../api/ejercicios.api";

function EjercicioEditForm({ ejercicio, onClose, onUpdated }) {
  const [form, setForm] = useState({
    nombre: ejercicio.nombre || "",
    series: ejercicio.series || "",
    repeticiones: ejercicio.repeticiones || "",
    descanso: ejercicio.descanso || "",
    notas: ejercicio.notas || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const conf = await Swal.fire({
      icon: "question",
      title: "¿Guardar cambios?",
      text: "Este ejercicio será actualizado",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!conf.isConfirmed) return;

    setLoading(true);

    try {
      await updateEjercicioRequest(ejercicio.id, {
        ...form,
        rutinaId: ejercicio.rutinaId,
      });

      await Swal.fire({
        icon: "success",
        title: "Ejercicio actualizado correctamente",
        confirmButtonText: "OK",
      });

      onUpdated();
      onClose();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar ejercicio",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
      <div className="w-full max-w-md bg-white h-full shadow-xl p-6 overflow-y-auto border-l border-gray-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Editar ejercicio</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
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
                value={form.series}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Repeticiones</label>
              <input
                name="repeticiones"
                value={form.repeticiones}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descanso</label>
              <input
                name="descanso"
                value={form.descanso}
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
              value={form.notas}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#212B36] hover:bg-[#1A222A] text-white rounded-xl font-medium shadow mt-4 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EjercicioEditForm;
