import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import MembresiaModal from "../components/MembresiaModal";
import MembresiaForm from "../components/MembresiaForm";
import MembresiaTable from "../components/MembresiaTable";
import MembresiaNotificaciones from "../components/MembresiaNotificaciones";

import {
  getMembresias,
  registrarMembresia,
  renovarMembresia,
  eliminarMembresia,
  editarMembresia,
  getMembresiasPorVencer,
} from "../api/membresias.api";

import Swal from "sweetalert2";

export default function Membresias() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.preRegistro) {
      const p = location.state.preRegistro;

      setEditingData({
        id: null,
        Nombre: p.nombre,
        Edad: p.edad || "",
        Telefono: p.telefono,
        Direccion: p.direccion || "",
        Correo: p.correo,
        Tipo: "",
        Nivel: "",
        Rutina: "",
        EnfermedadesOLesiones: "",
        FormaPago: "",
        MontoPagado: "",
        FechaRegistro: "",
        FechaVencimiento: "",
      });

      setModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    cargarDatos();
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      const data = await getMembresiasPorVencer();
      const alertasMapeadas = Array.isArray(data)
        ? data.map((m) => ({
            codigoCliente: m.codigoCliente || m.CodigoCliente || "—",
            nombre: m.nombre || m.Nombre || "—",
            correo: m.correo || m.Correo || "—",
            fechaVencimiento:
              m.fechaVencimiento || m.FechaVencimiento || null,
          }))
        : [];

      setAlertas(alertasMapeadas);
    } catch {
      setAlertas([]);
    }
  };

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await getMembresias();

      if (Array.isArray(data)) {
        const datosMapeados = data.map((item, index) => ({
          id: item.Id || item.id || item.idMembresia || `temp-${index}`,
          codigoCliente: item.CodigoCliente || item.codigoCliente,
          nombre: item.Nombre || item.nombre,
          edad: item.Edad || item.edad,
          telefono: item.Telefono || item.telefono,
          direccion: item.Direccion || item.direccion,
          correo: item.Correo || item.correo,
          rutina: item.Rutina || item.rutina,
          enfermedadesOLesiones:
            item.EnfermedadesOLesiones || item.enfermedadesOLesiones,
          fotoUrl: item.FotoUrl || item.fotoUrl,
          tipo: item.Tipo || item.tipo,
          nivel: item.Nivel || item.nivel,
          activa: item.Activa ?? item.activa,
          fechaRegistro: item.FechaRegistro || item.fechaRegistro,
          fechaVencimiento: item.FechaVencimiento || item.fechaVencimiento,
          formaPago: item.FormaPago || item.formaPago,
          montoPagado: item.MontoPagado ?? item.montoPagado,
          historial: item.Historial || item.historial,
        }));

        setRegistros(datosMapeados);
      } else {
        setRegistros([]);
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar las membresías",
      });
      setRegistros([]);
    } finally {
      setCargando(false);
    }
  };

  const guardar = async (formData) => {
    if (!formData) {
      setModalOpen(false);
      setEditingData(null);
      return;
    }

    const mensaje = editingData?.id
      ? "¿Deseas guardar los cambios?"
      : "¿Registrar nueva membresía?";

    const confirm = await Swal.fire({
      icon: "question",
      title: "Confirmación",
      text: mensaje,
      showCancelButton: true,
      confirmButtonColor: "#121824",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      setCargando(true);

      if (editingData?.id) {
        await editarMembresia(editingData.id, formData);
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Membresía editada correctamente",
          confirmButtonColor: "#121824",
        });
      } else {
        await registrarMembresia(formData);
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Membresía registrada correctamente",
          confirmButtonColor: "#121824",
        });
      }

      await cargarDatos();
      await cargarAlertas();

      setModalOpen(false);
      setEditingData(null);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al guardar la membresía",
      });
    } finally {
      setCargando(false);
    }
  };

  const editar = (item) => {
    setEditingData({
      id: item.id,
      Nombre: item.nombre,
      Edad: item.edad,
      Telefono: item.telefono,
      Direccion: item.direccion,
      Correo: item.correo,
      Rutina: item.rutina,
      EnfermedadesOLesiones: item.enfermedadesOLesiones,
      Tipo: item.tipo,
      Nivel: item.nivel,
      FormaPago: item.formaPago,
      MontoPagado: item.montoPagado,
      FechaRegistro: item.fechaRegistro,
      FechaVencimiento: item.fechaVencimiento,
      FotoUrl: item.fotoUrl,
    });

    setModalOpen(true);
  };

  const renovar = async (item) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "Renovar Membresía",
      text: `¿Renovar la membresía de ${item.nombre}?`,
      showCancelButton: true,
      confirmButtonColor: "#121824",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, renovar",
    });

    if (!confirm.isConfirmed) return;

    try {
      setCargando(true);
      await renovarMembresia(item.id);

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Membresía renovada correctamente",
        confirmButtonColor: "#121824",
      });

      await cargarDatos();
      await cargarAlertas();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al renovar la membresía",
      });
    } finally {
      setCargando(false);
    }
  };

  const eliminarReg = async (item) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Eliminar Membresía",
      text: `¿Eliminar la membresía de ${item.nombre}?`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Eliminar",
    });

    if (!confirm.isConfirmed) return;

    try {
      setCargando(true);
      await eliminarMembresia(item.id);

      Swal.fire({
        icon: "success",
        title: "Eliminada",
        text: "La membresía se eliminó correctamente",
        confirmButtonColor: "#121824",
      });

      await cargarDatos();
      await cargarAlertas();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar la membresía",
      });
    } finally {
      setCargando(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingData(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Gestión de Membresías
        </h1>
        <MembresiaNotificaciones alertas={alertas} />
      </div>

      <div className="flex justify-between mb-4">
        <p className="text-gray-600">
          {cargando
            ? "Cargando..."
            : `${registros.length} membresías registradas`}
        </p>

        <button
          onClick={() => {
            setEditingData(null);
            setModalOpen(true);
          }}
          disabled={cargando}
          className="px-5 py-2.5 bg-[#212B36] text-white font-medium rounded-md 
                     hover:bg-[#1A222A] transition disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
        >
          <span>+</span>
          Registrar Membresía
        </button>
      </div>

      <MembresiaTable
        data={registros}
        onEdit={editar}
        onRenew={renovar}
        onDelete={eliminarReg}
        cargando={cargando}
      />

      <MembresiaModal open={modalOpen} onClose={closeModal}>
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-2xl font-bold text-[#212B36]">
            {editingData?.id ? "Editar Membresía" : "Registrar Nueva Membresía"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <MembresiaForm onSubmit={guardar} initialData={editingData} />
      </MembresiaModal>

      {cargando && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded shadow flex items-center gap-2 z-20">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Cargando…</span>
        </div>
      )}
    </div>
  );
}
