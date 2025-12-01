 
import React from "react";
import { Edit, Trash2, Package } from "lucide-react";

function ProductTable({ productos, cargando, onEdit, onDelete }) {
  if (cargando) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-[#212B36] mx-auto"></div>
        <p className="text-sm text-gray-500 mt-3">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
    
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-[#212B36]" />
          <h3 className="text-lg font-semibold text-gray-900">
            Productos del proveedor
          </h3>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {productos.length} producto{productos.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      
      {productos.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Este proveedor aún no tiene productos registrados.
        </p>
      )}

      
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {productos.map((p) => (
          <div
            key={p.id}
            className="border border-gray-200 rounded-xl px-5 py-4 flex flex-col md:flex-row justify-between hover:bg-gray-50 transition"
          >
           
            <div className="flex gap-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <Package className="w-6 h-6 text-[#212B36]" />
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {p.nombre}
                </p>

                <div className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Categoría: </span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {p.categoria}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mt-2">
                  Piezas por paquete:{" "}
                  <span className="font-semibold">{p.piezasPorPaquete}</span>
                </p>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-600">Precio paquete</span>
                    <span className="text-green-600 font-bold">
                      ${Number(p.precio).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-600">Costo por pieza</span>
                    <span className="text-blue-600 font-bold">
                      ${Number(p.precioUnitario).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-600">Precio final pieza</span>
                    <span className="text-purple-700 font-bold">
                      ${Number(p.precioFinal).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="flex gap-2 mt-4 md:mt-0 md:self-center">
              <button
                onClick={() => onEdit(p)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-sm transition"
              >
                <Edit className="w-4 h-4" /> Editar
              </button>

              <button
                onClick={() => onDelete(p.id)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-sm transition"
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductTable;
