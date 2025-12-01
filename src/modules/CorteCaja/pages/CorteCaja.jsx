import React, { useEffect, useState } from "react";
import {
  obtenerCorteDiario,
  cerrarCorte,
  obtenerCortesPorDia,
} from "../api/corteCaja.api";

import GenerarCorteModal from "../components/GenerarCorteModal";
import CorteTable from "../components/CorteTable";
import { History } from "lucide-react";

export default function CorteCaja() {
  const [cortes, setCortes] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      const hoy = new Date().toISOString().split("T")[0];
      const r = await obtenerCortesPorDia(hoy);
      setCortes(r.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

const generar = async (cajaInicialInput) => {
  try {
    // 1) Pedimos el resumen del periodo
    const resumen = await obtenerCorteDiario(cajaInicialInput);

    const data = resumen.data;

    // 2) Cerramos el corte usando LOS VALORES DEL BACKEND
    await cerrarCorte({
      fecha: new Date().toISOString(),
      cajaInicial: data.cajaInicial, // <- puede ser la que pusiste o la caja final del último corte
      ingresosTotales: data.ingresos.ingresosTotales,
      egresosTotales: data.egresos.egresosTotales,
    });

    setModal(false);
    cargar(); // recarga la tabla de cortes

  } catch (err) {
    console.error(err);
    alert("Error al generar el corte");
  }
};


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-3 mb-6">
        <History size={24} /> Corte de Caja
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setModal(true)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
        >
          Generar Corte
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <CorteTable cortes={cortes} />
      )}

      <GenerarCorteModal
        open={modal}
        onClose={() => setModal(false)}
        onSubmit={generar}
      />
    </div>
  );
}
