import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import PreRegistroList from "../components/PreRegistroList";
import {
  getPreRegistros,
  aceptarPreRegistro,
  rechazarPreRegistro,
} from "../api/preregistro.api";

import Swal from "sweetalert2";

export default function PreRegistroPage() {
  const [search, setSearch] = useState("");
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarPreRegistros();
  }, []);

  const cargarPreRegistros = async () => {
    try {
      setCargando(true);
      const data = await getPreRegistros();

      if (Array.isArray(data)) {
        const registrosMapeados = data.map((item, index) => ({
          id: item.id || item.Id || `pre-registro-${index}`,
          nombre: item.nombre || item.Nombre || "—",
          correo: item.correo || item.Correo || "—",
          telefono: item.telefono || item.Telefono || "—",
          direccion: item.direccion || item.Direccion || "",
          edad: item.edad || item.Edad || "",
          observaciones: item.observaciones || item.Observaciones || "",
          fecha: item.fechaRegistro || item.FechaRegistro || "",
          estado: item.estado || item.Estado || 0,
        }));

        setRegistros(registrosMapeados);
      } else {
        setRegistros([]);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar los pre-registros",
      });
      setRegistros([]);
    } finally {
      setCargando(false);
    }
  };

  const filtered = registros.filter(
    (r) =>
      (r.nombre || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.correo || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.telefono || "").includes(search)
  );

  const accept = async (id) => {
    const registro = registros.find((r) => r.id === id);
    if (!registro) return;

    const confirm = await Swal.fire({
      icon: "question",
      title: "Aceptar Pre-Registro",
      text: `¿Aceptar el pre-registro de ${registro.nombre}?`,
      showCancelButton: true,
      confirmButtonColor: "#121824",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await aceptarPreRegistro(id);

      Swal.fire({
        icon: "success",
        title: "Aceptado",
        text: "El pre-registro fue aprobado",
        confirmButtonColor: "#121824",
      });

      setRegistros((prev) => prev.filter((r) => r.id !== id));

      navigate("/membresias", {
        state: {
          preRegistro: registro,
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al aceptar el pre-registro",
      });
    }
  };

  const reject = async (id) => {
    const registro = registros.find((r) => r.id === id);
    if (!registro) return;

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Rechazar Pre-Registro",
      text: `¿Deseas rechazar el pre-registro de ${registro.nombre}?`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Rechazar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await rechazarPreRegistro(id);

      Swal.fire({
        icon: "success",
        title: "Rechazado",
        text: `El pre-registro de ${registro.nombre} fue rechazado`,
        confirmButtonColor: "#121824",
      });

      setRegistros((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo rechazar el pre-registro",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="bg-gradient-to-r from-[#212B36] to-[#1A232C] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg w-fit">
            <i className="fas fa-user-plus text-white text-2xl sm:text-3xl"></i>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Pre-Registro
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mt-1 sm:mt-2">
              Gestiona las solicitudes de registro de nuevos miembros
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-200/60 p-4 sm:p-6 h-[calc(100vh-200px)] sm:h-[calc(100vh-240px)] min-h-[600px] sm:min-h-[700px]">
        <div className="bg-gradient-to-r from-[#212B36] to-[#1A232C] text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex-shrink-0 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <i className="fas fa-tachometer-alt text-xl sm:text-2xl"></i>
              <h2 className="text-xl sm:text-2xl font-bold">
                Panel de Pre-Registros
              </h2>
            </div>
            <div className="flex items-center gap-3 bg-white/20 px-3 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base">
              <i className="fas fa-info-circle"></i>
              <span className="font-semibold">
                {filtered.length} registros encontrados
              </span>
            </div>
          </div>
        </div>

        <div className="h-[calc(100%-140px)] sm:h-[calc(100%-120px)]">
          {cargando ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-[#212B36] border-t-transparent mx-auto mb-4 sm:mb-6"></div>
                <p className="text-gray-600 text-base sm:text-lg font-semibold">
                  Cargando pre-registros...
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                  Por favor espere un momento
                </p>
              </div>
            </div>
          ) : (
            <PreRegistroList
              registros={filtered}
              onAccept={accept}
              onReject={reject}
            />
          )}
        </div>
      </div>
    </div>
  );
}
