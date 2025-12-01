import React, { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { updateRutinaRequest } from "../api/rutinas.api";

function RutinaEditForm({ rutina, onClose, onUpdated }) {
  const [form, setForm] = useState({
    titulo: rutina.titulo || "",
    descripcion: rutina.descripcion || "",
    duracion: rutina.duracion || "",
    nivel: rutina.nivel || "Principiante",
    genero: rutina.genero || "Hombre",
  });

  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const conf = await Swal.fire({
      icon: "question",
      title: "¿Guardar cambios?",
      text: "La rutina será actualizada",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!conf.isConfirmed) return;

    setLoading(true);

    const data = new FormData();
    data.append("Titulo", form.titulo);
    data.append("Descripcion", form.descripcion);
    data.append("Duracion", form.duracion);
    data.append("Nivel", form.nivel);
    data.append("Genero", form.genero);
    if (imagen) data.append("Imagen", imagen);

    try {
      await updateRutinaRequest(rutina.id, data);

      await Swal.fire({
        icon: "success",
        title: "Rutina actualizada correctamente",
        confirmButtonText: "OK",
      });

      onUpdated();
      onClose();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar la rutina",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
      <div className="w-full max-w-lg bg-white h-full shadow-xl p-6 overflow-y-auto border-l border-gray-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Editar Rutina</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              name="titulo"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
              rows={3}
              value={form.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duración</label>
            <input
              name="duracion"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
              value={form.duracion}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nivel</label>
            <select
              name="nivel"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
              value={form.nivel}
              onChange={handleChange}
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Género</label>
            <select
              name="genero"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
              value={form.genero}
              onChange={handleChange}
            >
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Imagen (opcional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setImagen(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#212B36] hover:bg-[#1A222A] text-white rounded-xl font-medium shadow mt-4 disabled:opacity-60"
          >
            {loading ? "Actualizando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RutinaEditForm;
