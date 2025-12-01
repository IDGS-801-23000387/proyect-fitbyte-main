import React, { useEffect, useState } from "react";
import {
  Dumbbell,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Clock,
  FileText,
} from "lucide-react";

import Swal from "sweetalert2";

import {
  getRutinasRequest,
  deleteRutinaRequest,
} from "../api/rutinas.api";

import {
  getEjerciciosPorRutinaRequest,
  deleteEjercicioRequest,
} from "../api/ejercicios.api";

import RutinaForm from "../components/RutinaForm";
import RutinaEditForm from "../components/RutinaEditForm";
import EjercicioForm from "../components/EjercicioForm";
import EjercicioEditForm from "../components/EjercicioEditForm";

function Rutinas() {
  const [rutinas, setRutinas] = useState([]);
  const [rutinaSeleccionadaId, setRutinaSeleccionadaId] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [showFormRutina, setShowFormRutina] = useState(false);
  const [modoEditarRutina, setModoEditarRutina] = useState(false);
  const [rutinaActual, setRutinaActual] = useState(null);

  const [showFormEjercicio, setShowFormEjercicio] = useState(false);
  const [modoEditarEjercicio, setModoEditarEjercicio] = useState(false);
  const [ejercicioActual, setEjercicioActual] = useState(null);

  const cargarRutinas = async () => {
    try {
      const res = await getRutinasRequest();
      setRutinas(res.data || []);
      if (res.data?.length > 0) {
        setRutinaSeleccionadaId(res.data[0].id);
      }
    } catch (err) {
      console.error("Error al obtener rutinas:", err);
    }
  };

  const cargarEjercicios = async (rutinaId) => {
    if (!rutinaId) return;
    try {
      const res = await getEjerciciosPorRutinaRequest(rutinaId);
      setEjercicios(res.data || []);
    } catch (err) {
      console.error("Error al obtener ejercicios:", err);
    }
  };

  useEffect(() => {
    cargarRutinas();
  }, []);

  useEffect(() => {
    if (rutinaSeleccionadaId) {
      cargarEjercicios(rutinaSeleccionadaId);
    } else {
      setEjercicios([]);
    }
  }, [rutinaSeleccionadaId]);

  const handleSeleccionarRutina = (id) => {
    setRutinaSeleccionadaId(id);
  };

  const handleEliminarRutina = async (id) => {
    const conf = await Swal.fire({
      title: "¿Eliminar rutina?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!conf.isConfirmed) return;

    try {
      await deleteRutinaRequest(id);

      await Swal.fire({
        icon: "success",
        title: "Rutina eliminada",
        confirmButtonText: "OK",
      });

      await cargarRutinas();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar rutina",
      });
    }
  };

  const handleNuevaRutina = () => {
    setModoEditarRutina(false);
    setRutinaActual(null);
    setShowFormRutina(true);
  };

  const handleEditarRutina = () => {
    const r = rutinas.find((x) => x.id === rutinaSeleccionadaId);
    if (!r) return;
    setRutinaActual(r);
    setModoEditarRutina(true);
    setShowFormRutina(true);
  };

  const handleNuevoEjercicio = () => {
    if (!rutinaSeleccionadaId) {
      Swal.fire({
        icon: "info",
        title: "Selecciona una rutina primero",
      });
      return;
    }

    setModoEditarEjercicio(false);
    setEjercicioActual(null);
    setShowFormEjercicio(true);
  };

  const handleEditarEjercicio = (ejercicio) => {
    setModoEditarEjercicio(true);
    setEjercicioActual(ejercicio);
    setShowFormEjercicio(true);
  };

  const handleEliminarEjercicio = async (id) => {
    const conf = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar ejercicio?",
      text: "Esta acción no se puede revertir",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!conf.isConfirmed) return;

    try {
      await deleteEjercicioRequest(id);

      await Swal.fire({
        icon: "success",
        title: "Ejercicio eliminado",
        confirmButtonText: "OK",
      });

      cargarEjercicios(rutinaSeleccionadaId);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar el ejercicio",
      });
    }
  };

  const rutinasFiltradas = rutinas.filter((r) =>
    r.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const rutinaSeleccionada =
    rutinas.find((x) => x.id === rutinaSeleccionadaId) || null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Rutinas</h1>
            <p className="text-gray-600 text-sm">Gestiona tus rutinas y ejercicios</p>
          </div>

          <button
            onClick={handleNuevaRutina}
            className="flex items-center gap-2 px-4 py-2 bg-[#212B36] hover:bg-[#1A222A] text-white rounded-xl shadow text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Nueva Rutina
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow p-4">

              <div className="relative mb-4">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar rutina..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212B36]"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {rutinasFiltradas.map((r) => {
                  const activa = r.id === rutinaSeleccionadaId;
                  return (
                    <div
                      key={r.id}
                      onClick={() => handleSeleccionarRutina(r.id)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                        activa
                          ? "bg-[#212B36] text-white shadow"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            activa ? "bg-white/20" : "bg-red-100"
                          }`}
                        >
                          <Dumbbell
                            className={`w-4 h-4 ${
                              activa ? "text-white" : "text-red-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{r.titulo}</p>
                          <p
                            className={`text-xs ${
                              activa ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            {r.nivel} · {r.duracion}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 ${
                          activa ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                  );
                })}

                {rutinasFiltradas.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-4">
                    No se encontraron rutinas.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {rutinaSeleccionada ? (
              <div className="space-y-4">

                <div className="bg-white rounded-2xl shadow p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="flex gap-4">
                      {rutinaSeleccionada.imagenUrl && (
                        <img
                          src={rutinaSeleccionada.imagenUrl}
                          alt={rutinaSeleccionada.titulo}
                          className="w-24 h-24 rounded-xl object-cover"
                        />
                      )}

                      <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <Dumbbell className="w-5 h-5 text-red-500" />
                          {rutinaSeleccionada.titulo}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {rutinaSeleccionada.descripcion}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                            <Clock className="w-3 h-3" />
                            {rutinaSeleccionada.duracion}
                          </span>

                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                            <FileText className="w-3 h-3" />
                            {rutinaSeleccionada.nivel} · {rutinaSeleccionada.genero}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleEditarRutina}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>

                      <button
                        onClick={() => handleEliminarRutina(rutinaSeleccionada.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" />
                      Ejercicios
                    </h3>

                    <button
                      onClick={handleNuevoEjercicio}
                      className="flex items-center gap-2 px-3 py-2 bg-[#212B36] hover:bg-[#1A222A] text-white rounded-lg text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Nuevo ejercicio
                    </button>
                  </div>

                  {ejercicios.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Esta rutina aún no tiene ejercicios.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {ejercicios.map((e) => (
                        <div
                          key={e.id}
                          className="border border-gray-200 rounded-xl px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {e.nombre}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {e.series} series · {e.repeticiones} reps ·{" "}
                              {e.descanso} descanso
                            </p>
                            {e.notas && (
                              <p className="text-xs text-gray-400 mt-1">
                                Notas: {e.notas}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditarEjercicio(e)}
                              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleEliminarEjercicio(e.id)}
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow p-10 flex flex-col items-center justify-center text-center">
                <Dumbbell className="w-10 h-10 text-gray-300 mb-3" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Selecciona una rutina
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Elige una rutina del panel izquierdo para ver sus detalles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFormRutina &&
        (modoEditarRutina ? (
          <RutinaEditForm
            rutina={rutinaActual}
            onClose={() => {
              setShowFormRutina(false);
              setModoEditarRutina(false);
              setRutinaActual(null);
            }}
            onUpdated={() => {
              cargarRutinas();
              setShowFormRutina(false);
            }}
          />
        ) : (
          <RutinaForm
            onClose={() => setShowFormRutina(false)}
            onSaved={() => {
              cargarRutinas();
              setShowFormRutina(false);
            }}
          />
        ))}

      {showFormEjercicio &&
        (modoEditarEjercicio ? (
          <EjercicioEditForm
            ejercicio={ejercicioActual}
            onClose={() => {
              setShowFormEjercicio(false);
              setModoEditarEjercicio(false);
              setEjercicioActual(null);
            }}
            onUpdated={() => {
              cargarEjercicios(rutinaSeleccionadaId);
              setShowFormEjercicio(false);
            }}
          />
        ) : (
          <EjercicioForm
            rutinaId={rutinaSeleccionadaId}
            onClose={() => setShowFormEjercicio(false)}
            onSaved={() => {
              cargarEjercicios(rutinaSeleccionadaId);
              setShowFormEjercicio(false);
            }}
          />
        ))}
    </div>
  );
}

export default Rutinas;
