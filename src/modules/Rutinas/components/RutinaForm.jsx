import React, { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { createRutinaRequest } from "../api/rutinas.api";

function RutinaForm({ onClose, onSaved }) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    duracion: "",
    nivel: "Principiante",
    genero: "Hombre",
  });

  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const conf = await Swal.fire({
      icon: "question",
      title: "¿Guardar rutina?",
      text: "La rutina será creada",
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
      await createRutinaRequest(data);

      await Swal.fire({
        icon: "success",
        title: "Rutina creada correctamente",
        confirmButtonText: "OK",
      });

      onSaved();
      onClose();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al crear la rutina",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
      <div className="w-full max-w-lg bg-white h-full shadow-xl p-6 overflow-y-auto border-l border-gray-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Nueva Rutina</h2>
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
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duración</label>
            <input
              name="duracion"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
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
            <label className="block text-sm font-medium mb-1">Imagen</label>
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
            {loading ? "Guardando..." : "Guardar Rutina"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RutinaForm;
