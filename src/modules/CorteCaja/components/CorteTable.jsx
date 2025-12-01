import React from "react";
import { Eye, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function CorteTable({ cortes }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">

      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Historial de Cortes</h2>
      </div>

      <div className="overflow-auto" style={{ maxHeight: "420px" }}>
        <table className="w-full">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-sm border-b">
                Corte
              </th>
              <th className="px-6 py-3 text-left font-semibold text-sm border-b">
                Fecha
              </th>
              <th className="px-6 py-3 text-left font-semibold text-sm border-b">
                Ingresos
              </th>
              <th className="px-6 py-3 text-left font-semibold text-sm border-b">
                Egresos
              </th>
              <th className="px-6 py-3 text-left font-semibold text-sm border-b">
                Ganancia
              </th>
              <th className="px-6 py-3 text-left font-semibold text-sm border-b">
                Caja Final
              </th>
              <th className="px-6 py-3 text-left font-semibold text-sm border-b">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {cortes.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold">#{String(c.id).padStart(4, "0")}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    {new Date(c.fecha).toLocaleString()}
                  </div>
                </td>

                <td className="px-6 py-4">${c.ingresosTotales}</td>
                <td className="px-6 py-4">${c.egresosTotales}</td>
                <td className="px-6 py-4 font-bold text-green-600">
                  ${c.ganancia}
                </td>

                <td className="px-6 py-4">${c.cajaFinal}</td>

                <td className="px-6 py-4">
                  <Link
                    to={`/corte-caja/detalle/${c.id}`}
                    className="px-4 py-2 bg-[#212B36] hover:bg-black text-white rounded-lg flex items-center gap-2"
                  >
                    <Eye size={16} /> Ver
                  </Link>
                </td>
              </tr>
            ))}

            {cortes.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Sin cortes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
