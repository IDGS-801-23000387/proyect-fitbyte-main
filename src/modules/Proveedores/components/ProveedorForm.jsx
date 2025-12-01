import React, { useState } from "react";
import { X, Save } from "lucide-react";
import Swal from "sweetalert2";

function ProveedorForm({ onCancel, onSave }) {
  const [enviando, setEnviando] = useState(false);

  const [form, setForm] = useState({
    nombreEmpresa: "",
    personaContacto: "",
    telefono: "",
    email: "",
    direccion: "",
    rfc: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const c = await Swal.fire({
      icon: "question",
      title: "¿Guardar proveedor?",
      text: "Se registrará en el sistema",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (!c.isConfirmed) return;

    setEnviando(true);

    try {
      await onSave(form);

      await Swal.fire({
        icon: "success",
        title: "Proveedor registrado correctamente",
        confirmButtonText: "OK",
      });

      setForm({
        nombreEmpresa: "",
        personaContacto: "",
        telefono: "",
        email: "",
        direccion: "",
        rfc: "",
      });

      onCancel();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: "Intenta nuevamente",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white h-full shadow-xl p-8 overflow-auto border-l border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#212B36]">
            Registrar Proveedor
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-[#212B36]"
            disabled={enviando}
          >
            <X size={26} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { name: "nombreEmpresa", label: "Nombre de empresa", required: true },
            { name: "personaContacto", label: "Persona de contacto", required: true },
            { name: "telefono", label: "Teléfono", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "direccion", label: "Dirección" },
            { name: "rfc", label: "RFC" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 font-medium mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              <input
                name={field.name}
                type={field.type || "text"}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
                disabled={enviando}
                placeholder={`Ingrese ${field.label.toLowerCase()}`}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#212B36] focus:border-[#212B36] outline-none transition disabled:bg-gray-100"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={enviando}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium disabled:bg-gray-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={enviando}
              className="flex-1 py-3 bg-[#212B36] hover:bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:bg-gray-500"
            >
              <Save size={18} />
              {enviando ? "Guardando..." : "Guardar Proveedor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProveedorForm;
