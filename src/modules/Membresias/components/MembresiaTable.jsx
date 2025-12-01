import React from "react";

export default function MembresiaTable({ data, onEdit, onRenew, cargando }) {
  console.log("DATOS EN TABLA:", data);

  // ==========================
  // ESTADO: CARGANDO
  // ==========================
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

  // ==========================
  // ESTADO: SIN DATOS
  // ==========================
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

  // ==========================
  // TABLA COMPLETA
  // ==========================
  return (
    <div className="w-full mt-4">
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        {/* ========================== */}
        {/* DESKTOP TABLE */}
        {/* ========================== */}
        <div className="hidden md:block">
          <div className="max-h-[450px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">Código Cliente</th>
                  <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">Nombre</th>
                  <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">Teléfono</th>
                  <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">Correo</th>
                  <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">Tipo Membresía</th>
                  <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">Fecha Ingreso</th>
                  <th className="py-3 px-4 text-left text-gray-700 text-sm font-medium">Fecha Vencimiento</th>
                  <th className="py-3 px-4 text-center text-gray-700 text-sm font-medium">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {data.map((membresia) => {

                  // Asegurar datos
                  const codigo = membresia.codigoCliente || "—";
                  const nombre = membresia.nombre || "—";
                  const tel = membresia.telefono || "—";
                  const correo = membresia.correo || "—";

                  const tipo = membresia.tipo || "—";

                  const fechaIngreso = membresia.fechaRegistro
                    ? new Date(membresia.fechaRegistro).toLocaleDateString("es-MX")
                    : "—";

                  const fechaVencimiento = membresia.fechaVencimiento
                    ? new Date(membresia.fechaVencimiento).toLocaleDateString("es-MX")
                    : "—";

                  return (
                    <tr
                      key={membresia.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-sm font-bold text-gray-900">
                        {codigo}
                      </td>

                      <td className="py-3 px-4 font-medium text-gray-900">
                        {nombre}
                      </td>

                      <td className="py-3 px-4 text-gray-700">
                        {tel}
                      </td>

                      <td className="py-3 px-4 text-gray-700">
                        {correo}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            tipo === "Premium"
                              ? "bg-purple-100 text-purple-800"
                              : tipo === "Anualidad"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {tipo}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-gray-700">
                        {fechaIngreso}
                      </td>

                      <td className="py-3 px-4 text-gray-700">
                        {fechaVencimiento}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">

                          <button
                            onClick={() => onEdit(membresia)}
                            className="px-3 py-1 bg-[#212B36] text-white rounded text-xs hover:bg-[#1A222A] transition font-medium"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => onRenew(membresia)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition font-medium"
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

        {/* ========================== */}
        {/* MOBILE VERSION */}
        {/* ========================== */}

        <div className="md:hidden">
          <div className="max-h-[450px] overflow-y-auto p-4">
            {data.map((membresia) => {

              const codigo = membresia.codigoCliente || "—";
              const nombre = membresia.nombre || "—";
              const tel = membresia.telefono || "—";
              const correo = membresia.correo || "—";

              const tipo = membresia.tipo || "—";

              const fechaIngreso = membresia.fechaRegistro
                ? new Date(membresia.fechaRegistro).toLocaleDateString("es-MX")
                : "—";

              const fechaVencimiento = membresia.fechaVencimiento
                ? new Date(membresia.fechaVencimiento).toLocaleDateString("es-MX")
                : "—";

              return (
                <div
                  key={membresia.id}
                  className="mb-4 p-4 rounded-xl border bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{nombre}</h3>
                      <p className="font-mono text-sm text-gray-600">Código: {codigo}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tipo === "Premium"
                          ? "bg-purple-100 text-purple-800"
                          : tipo === "Anualidad"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {tipo}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Teléfono</p>
                      <p className="font-medium">{tel}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Correo</p>
                      <p className="font-medium truncate">{correo}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Ingreso</p>
                      <p className="font-medium">{fechaIngreso}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Vencimiento</p>
                      <p className="font-medium">{fechaVencimiento}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(membresia)}
                      className="flex-1 px-4 py-2 bg-[#212B36] text-white rounded-lg text-sm hover:bg-[#1A222A] transition font-medium"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => onRenew(membresia)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition font-medium"
                    >
                      Renovar
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
