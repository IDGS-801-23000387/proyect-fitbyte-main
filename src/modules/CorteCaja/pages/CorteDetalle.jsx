import React, { useEffect, useState } from "react";
import { obtenerCorte } from "../api/corteCaja.api";
import { useParams } from "react-router-dom";

export default function CorteDetalle() {
  const { id } = useParams();
  const [corte, setCorte] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const r = await obtenerCorte(id);
      setCorte(r.data);
    };
    cargar();
  }, [id]);

  if (!corte) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow">

      <h1 className="text-2xl font-bold mb-6">
        Corte #{corte.id}
      </h1>

      <div className="space-y-3 mb-6">
        <p><strong>Monto inicial:</strong> ${corte.montoInicial}</p>
        <p><strong>Monto final:</strong> {corte.montoFinal ? `$${corte.montoFinal}` : "Aún abierto"}</p>
        <p><strong>Fecha apertura:</strong> {new Date(corte.fechaApertura).toLocaleString()}</p>
        <p><strong>Fecha cierre:</strong> {corte.fechaCierre ? new Date(corte.fechaCierre).toLocaleString() : "Aún abierto"}</p>
      </div>

      <h2 className="text-xl font-bold mb-3">Movimientos</h2>

      <div className="border rounded-lg p-4 bg-gray-50">
        {corte.movimientos.length === 0 ? (
          <p>No hay movimientos registrados.</p>
        ) : (
          corte.movimientos.map((m) => (
            <div key={m.id} className="border-b pb-3 mb-3">
              <p><strong>{m.tipo}</strong></p>
              <p>Monto: ${m.monto}</p>
              <p>{m.descripcion}</p>
              <p className="text-sm text-gray-500">
                {new Date(m.fecha).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
