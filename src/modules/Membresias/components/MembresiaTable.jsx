import React from "react";

export default function MembresiaTable({
  data,
  onEdit,
  onRenew,
  cargando,
}) {
  console.log(" DATOS EN TABLA:", data);

  if (cargando) {
    return (
      <div className="w-full mt-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Membresías</h2>
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando membresías...</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full mt-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Membresías</h2>
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <p className="text-gray-500">No hay membresías registradas</p>
          <p className="text-sm text-gray-400 mt-2">
            Haz clic en "Registrar Membresía" para agregar la primera
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      

      <div className="bg-white rounded-2xl shadow">

         
        <table className="w-full min-w-[1000px] border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">
                Código Cliente
              </th>
              <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">
                Nombre
              </th>
              <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">
                Teléfono
              </th>
              <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">
                Correo
              </th>
              <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">
                Tipo Membresía
              </th>
              <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">
                Fecha Ingreso
              </th>
              <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">
                Fecha Vencimiento
              </th>
              <th className="py-3 px-4 text-center text-gray-700 text-sm font-medium">
                Acciones
              </th>
            </tr>
          </thead>
        </table>

        
        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <tbody>
              {data.map((membresia) => {
                const uniqueKey = membresia.id;

                const hoy = new Date().setHours(0, 0, 0, 0);
                const vencimiento = membresia.fechaVencimiento
                  ? new Date(membresia.fechaVencimiento).setHours(0, 0, 0, 0)
                  : null;

                const estaVencida = vencimiento && vencimiento < hoy;

                return (
                  <tr
                    key={uniqueKey}
                    className={`border-b border-gray-200 transition-colors 
                    ${estaVencida ? "bg-gray-100 opacity-70" : "hover:bg-gray-50"}`}
                  >
                    <td className="py-3 px-4 font-mono text-sm text-gray-900 font-bold">
                      {membresia.codigoCliente}
                    </td>

                    <td className="py-3 px-4 font-medium text-gray-900">
                      {membresia.nombre}
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      {membresia.telefono}
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      {membresia.correo}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          membresia.tipo === "Premium"
                            ? "bg-purple-100 text-purple-800"
                            : membresia.tipo === "Anualidad"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {membresia.tipo}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      {membresia.fechaRegistro
                        ? new Date(membresia.fechaRegistro).toLocaleDateString("es-MX")
                        : "—"}
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      {membresia.fechaVencimiento
                        ? new Date(membresia.fechaVencimiento).toLocaleDateString("es-MX")
                        : "—"}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          disabled={estaVencida}
                          onClick={() => onEdit(membresia)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors
                            ${
                              estaVencida
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#212B36] text-white hover:bg-[#1A222A]"
                            }`}
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => onRenew(membresia)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors font-medium"
                        >
                          Renovar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
