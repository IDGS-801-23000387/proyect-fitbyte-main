import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerCortesPorDia } from "../api/corteCaja.api";
import { Calendar } from "lucide-react";

export default function CorteDetalle() {
  const { id } = useParams();
  const [corte, setCorte] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const hoy = new Date().toISOString().split("T")[0];
      const r = await obtenerCortesPorDia(hoy);

      const encontrado = r.data.find((c) => c.id === Number(id));
      setCorte(encontrado);
    };

    cargar();
  }, [id]);

  if (!corte)
    return <p className="p-6">Cargando detalles del corte...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Corte #{String(id).padStart(4, "0")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card title="Caja Inicial" value={corte.cajaInicial} />

        <Card title="Ingresos" value={corte.ingresosTotales} />

        <Card title="Egresos" value={corte.egresosTotales} />

        <Card title="Ganancia" value={corte.ganancia} green />
      </div>

      <div className="p-4 bg-gray-50 rounded border flex items-center gap-2">
        <Calendar size={20} className="text-gray-500" />
        <span>{new Date(corte.fecha).toLocaleString()}</span>
      </div>
    </div>
  );
}

function Card({ title, value, green }) {
  return (
    <div className="p-4 bg-white border rounded shadow">
      <p className="text-gray-500">{title}</p>
      <h2
        className={`text-2xl font-bold ${
          green ? "text-green-600" : "text-black"
        }`}
      >
        ${value}
      </h2>
    </div>
  );
}
