import React, { useState, useEffect } from "react";
import TablaVisitas from "../components/TablaVisitas";
import FormVisitaModal from "../components/FormVisitaModal";
import SearchBar from "../components/SearchBar";
import CorteCajaModal from "../components/CorteCajaModal";
import { registrarVisita, getVisitas } from "../api/visitas.api";
import Swal from "sweetalert2";

function Visitas() {
  const [visitas, setVisitas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCorte, setShowCorte] = useState(false);
  const [search, setSearch] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarVisitas();
  }, []);

  const cargarVisitas = async () => {
    try {
      setCargando(true);
      const data = await getVisitas();

      if (Array.isArray(data)) {
        const visitasMapeadas = data.map((item, index) => ({
          id: item.id || item.Id || `visita-${index}-${Date.now()}`,
          nombreCliente: item.nombreCliente || item.NombreCliente || "—",
          costo: item.costo || item.Costo || 0,
          formaPago: item.formaPago || item.FormaPago || "—",
          fechaVenta: item.fechaVenta || item.FechaVenta,
          correo: item.correo || item.Correo || "",
        }));

        setVisitas(visitasMapeadas);
      } else {
        setVisitas([]);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar las visitas",
      });
      setVisitas([]);
    } finally {
      setCargando(false);
    }
  };

  const agregarVisita = async (data) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "Registrar Visita",
      text: `¿Confirmar visita por un total de $${Number(data.costo).toFixed(
        2
      )}?`,
      showCancelButton: true,
      confirmButtonColor: "#121824",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Registrar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      setCargando(true);
      await registrarVisita(data);
      await cargarVisitas();

      Swal.fire({
        icon: "success",
        title: "Visita Registrada",
        text: "La visita fue registrada correctamente",
        confirmButtonColor: "#121824",
      });

      setShowForm(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar la visita",
      });
    } finally {
      setCargando(false);
    }
  };

  const getFecha = (v) => (v.fechaVenta ? v.fechaVenta.split("T")[0] : "");

  const hoyStr = new Date().toISOString().split("T")[0];
  const ayerStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const stats = {
    hoy: visitas.filter((v) => getFecha(v) === hoyStr).length,
    ayer: visitas.filter((v) => getFecha(v) === ayerStr).length,
    semana: visitas.filter((v) => {
      const f = getFecha(v);
      if (!f) return false;
      const dif = (new Date() - new Date(f)) / (1000 * 60 * 60 * 24);
      return dif <= 7;
    }).length,
    mes: visitas.filter((v) => {
      const f = getFecha(v);
      return f && f.slice(0, 7) === hoyStr.slice(0, 7);
    }).length,
  };

  const totalCaja = visitas.reduce(
    (acc, v) => acc + (Number(v.costo) || 0),
    0
  );

  const visitasFiltradas = visitas.filter((v) =>
    ((v.nombreCliente || "") + " " + (v.correo || ""))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Visitas</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
            disabled={cargando}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Registrar Visita
          </button>

          <button
            onClick={() => setShowCorte(true)}
            disabled={cargando}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Corte de Caja
          </button>
        </div>
      </div>

      <SearchBar search={search} setSearch={setSearch} />

      <TablaVisitas
        visitas={visitasFiltradas}
        stats={stats}
        cargando={cargando}
      />

      {showForm && (
        <FormVisitaModal
          onAddVisita={agregarVisita}
          onClose={() => setShowForm(false)}
        />
      )}

      {showCorte && (
        <CorteCajaModal
          stats={stats}
          total={totalCaja}
          onClose={() => setShowCorte(false)}
        />
      )}
    </div>
  );
}

export default Visitas;
