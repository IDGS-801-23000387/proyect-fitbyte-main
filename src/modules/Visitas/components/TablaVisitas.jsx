import React from "react";

function TablaVisitas({ visitas, stats, cargando }) {
  console.log(" VISITAS EN TABLA:", visitas);

  if (cargando) {
    return (
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">Lista de Visitas</h2>
          <div className="flex gap-5 text-center text-sm font-semibold">
            <div><p className="text-gray-500 text-xs">Hoy</p><p className="bg-gray-100 px-3 py-1 rounded">—</p></div>
            <div><p className="text-gray-500 text-xs">Ayer</p><p className="bg-gray-100 px-3 py-1 rounded">—</p></div>
            <div><p className="text-gray-500 text-xs">Semana</p><p className="bg-gray-100 px-3 py-1 rounded">—</p></div>
            <div><p className="text-gray-500 text-xs">Mes</p><p className="bg-gray-100 px-3 py-1 rounded">—</p></div>
          </div>
        </div>
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando visitas...</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(visitas) || visitas.length === 0) {
    return (
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">Lista de Visitas</h2>
          <div className="flex gap-5 text-center text-sm font-semibold">
            <div><p className="text-gray-500 text-xs">Hoy</p><p className="bg-gray-100 px-3 py-1 rounded">{stats.hoy || 0}</p></div>
            <div><p className="text-gray-500 text-xs">Ayer</p><p className="bg-gray-100 px-3 py-1 rounded">{stats.ayer || 0}</p></div>
            <div><p className="text-gray-500 text-xs">Semana</p><p className="bg-gray-100 px-3 py-1 rounded">{stats.semana || 0}</p></div>
            <div><p className="text-gray-500 text-xs">Mes</p><p className="bg-gray-100 px-3 py-1 rounded">{stats.mes || 0}</p></div>
          </div>
        </div>

        <div className="text-center py-10 text-gray-500">
          <div className="mx-auto mb-2">📊</div>
          No hay visitas registradas.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      
   
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <h2 className="font-semibold text-gray-800">
          Lista de Visitas ({visitas.length})
        </h2>
        <div className="flex gap-5 text-center text-sm font-semibold">
          <div><p className="text-gray-500 text-xs">Hoy</p><p className="bg-gray-100 px-3 py-1 rounded">{stats.hoy}</p></div>
          <div><p className="text-gray-500 text-xs">Ayer</p><p className="bg-gray-100 px-3 py-1 rounded">{stats.ayer}</p></div>
          <div><p className="text-gray-500 text-xs">Semana</p><p className="bg-gray-100 px-3 py-1 rounded">{stats.semana}</p></div>
          <div><p className="text-gray-500 text-xs">Mes</p><p className="bg-gray-100 px-3 py-1 rounded">{stats.mes}</p></div>
        </div>
      </div>

     
      <div className="overflow-y-auto h-[350px]">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left">Cliente</th>
              <th className="px-6 py-3 text-left">Costo</th>
              <th className="px-6 py-3 text-left">Forma de Pago</th>
              <th className="px-6 py-3 text-left">Fecha de Venta</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {visitas.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">

               
                <td className="px-6 py-4 font-medium text-gray-900">
                  {v.nombreCliente}
                </td>

               
                <td className="px-6 py-4 font-bold text-green-700">
                  ${Number(v.costo).toFixed(2)}
                </td>

                 
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      v.formaPago === "Efectivo"
                        ? "bg-green-100 text-green-800"
                        : v.formaPago.includes("Tarjeta")
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {v.formaPago}
                  </span>
                </td>

                
                <td className="px-6 py-4 text-gray-700">
                  {v.fechaVenta
                    ? new Date(v.fechaVenta).toLocaleDateString("es-MX")
                    : "—"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default TablaVisitas;
