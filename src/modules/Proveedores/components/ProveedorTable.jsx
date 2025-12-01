 
import React from "react";
import { Building, Edit, Trash2, UserCheck, Mail, Phone } from "lucide-react";
import { useProveedores } from "../context/ProveedoresContext";
import { toast } from "react-toastify";

export default function ProveedorTable({ proveedores, onSelect, onEdit }) {
  const { eliminarProveedor } = useProveedores();

  const handleEliminar = async (id, nombreEmpresa) => {
    if (!window.confirm(`¿Eliminar proveedor "${nombreEmpresa}"?`)) return;

    try {
      await eliminarProveedor(id);
      toast.success("Proveedor eliminado correctamente.", { icon: "✅" });
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar el proveedor.", { icon: "❌" });
    }
  };

  if (proveedores.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700">
          No hay proveedores registrados
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          Agrega un proveedor para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="space-y-3">
        {proveedores.map((p) => (
          <div
            key={p.id}
            className="border border-gray-200 rounded-lg px-5 py-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition"
          >
         
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <Building className="w-6 h-6 text-[#212B36]" />
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {p.nombreEmpresa}
                </p>

                <p className="text-sm text-gray-500">
                  Contacto: {p.personaContacto || "No especificado"}
                </p>

                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {p.telefono || "Sin teléfono"}
                </p>

                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3" />
                  {p.email || "Sin correo"}
                </p>

                {p.rfc && (
                  <p className="text-xs text-gray-400 mt-1">RFC: {p.rfc}</p>
                )}
              </div>
            </div>

          
            <div className="flex gap-2 mt-3 md:mt-0">
            
              <button
                onClick={() => onSelect(p)}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-1 transition"
              >
                <UserCheck className="w-4 h-4" />
                Seleccionar
              </button>

              
              <button
                onClick={() => onEdit(p)}
                className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1 transition"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>

               
              <button
                onClick={() => handleEliminar(p.id, p.nombreEmpresa)}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1 transition"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
