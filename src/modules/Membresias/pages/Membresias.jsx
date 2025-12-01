import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

import MembresiaModal from "../components/MembresiaModal";
import MembresiaForm from "../components/MembresiaForm";
import MembresiaTable from "../components/MembresiaTable";
import MembresiaNotificaciones from "../components/MembresiaNotificaciones";
import RenovarMembresiaModal from "../components/RenovarMembresiaModal";

import {
  getMembresias,
  registrarMembresia,
  renovarMembresia,
  eliminarMembresia,
  editarMembresia,
  getMembresiasPorVencer,
} from "../api/membresias.api";

export default function Membresias() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const [renovarOpen, setRenovarOpen] = useState(false);
  const [renovarTarget, setRenovarTarget] = useState(null);

  const location = useLocation();

  // ================================
  // Pre-registro carga automática
  // ================================
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

  // ================================
  // Cargar datos
  // ================================
  useEffect(() => {
    cargarDatos();
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      const data = await getMembresiasPorVencer();
      const alertasLimpias = Array.isArray(data)
        ? data.map((m) => ({
            codigoCliente: m.codigoCliente || m.CodigoCliente || "—",
            nombre: m.nombre || m.Nombre || "—",
            correo: m.correo || m.Correo || "—",
            fechaVencimiento: m.fechaVencimiento || m.FechaVencimiento || null,
          }))
        : [];

      setAlertas(alertasLimpias);
    } catch (e) {
      console.error("Error cargando alertas:", e);
    }
  };

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const data = await getMembresias();

      if (Array.isArray(data)) {
        const lista = data.map((m, idx) => ({
          id: m.id || m.Id || idx,
          codigoCliente: m.codigoCliente || m.CodigoCliente || "—",
          nombre: m.nombre || m.Nombre || "—",
          edad: m.edad || m.Edad || "",
          telefono: m.telefono || m.Telefono || "",
          direccion: m.direccion || m.Direccion || "",
          correo: m.correo || m.Correo || "",
          rutina: m.rutina || m.Rutina || "",
          enfermedadesOLesiones: m.enfermedadesOLesiones || m.EnfermedadesOLesiones || "",
          fotoUrl: m.fotoUrl || m.FotoUrl || null,
          tipo: m.tipo || m.Tipo || "—",
          nivel: m.nivel || m.Nivel || "—",
          fechaRegistro: m.fechaRegistro || m.FechaRegistro || null,
          fechaVencimiento: m.fechaVencimiento || m.FechaVencimiento || null,
          formaPago: m.formaPago || m.FormaPago || "—",
          montoPagado: m.montoPagado ?? m.MontoPagado ?? 0,
        }));

        setRegistros(lista);
      } else {
        setRegistros([]);
      }
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las membresías", "error");
      setRegistros([]);
    } finally {
      setCargando(false);
    }
  };

  // ================================
  // Crear / Editar
  // ================================
  const guardar = async (formData) => {
    if (!formData) {
      setModalOpen(false);
      setEditingData(null);
      return;
    }

    const esEdicion = Boolean(editingData?.id);

    const ok = await Swal.fire({
      title: "¿Confirmar?",
      text: esEdicion ? "¿Deseas editar esta membresía?" : "¿Registrar nueva membresía?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    });

    if (!ok.isConfirmed) return;

    try {
      setCargando(true);

      if (esEdicion) {
        await editarMembresia(editingData.id, formData);
        Swal.fire("Actualizado", "Membresía editada correctamente", "success");
      } else {
        await registrarMembresia(formData);
        Swal.fire("Registrado", "Membresía creada correctamente", "success");
      }

      await cargarDatos();
      await cargarAlertas();

      setModalOpen(false);
      setEditingData(null);
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar la membresía", "error");
    } finally {
      setCargando(false);
    }
  };

  // Editar
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

  // ================================
  // Renovar
  // ================================
  const renovar = (item) => {
    setRenovarTarget(item);
    setRenovarOpen(true);
  };

  const confirmarRenovacion = async ({
    nuevaFechaVencimiento,
    tipoPago,
    montoPagado,
  }) => {
    const body = {
      NuevaFechaVencimiento: nuevaFechaVencimiento,
      TipoPago: tipoPago,
      MontoPagado: montoPagado,
    };

    console.log("📤 BODY que se envía al API:", body);

    try {
      setCargando(true);

      await renovarMembresia(renovarTarget.id, body);

      Swal.fire("Renovado", "La membresía fue renovada correctamente", "success");

      await cargarDatos();
      await cargarAlertas();
    } catch (e) {
      console.error("❌ ERROR EN RENOVAR:", e);
      Swal.fire("Error", "No se pudo renovar la membresía", "error");
    } finally {
      setRenovarOpen(false);
      setRenovarTarget(null);
      setCargando(false);
    }
  };

  // ================================
  // Eliminar
  // ================================
  const eliminar = async (item) => {
    const ok = await Swal.fire({
      title: "¿Eliminar?",
      text: `Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!ok.isConfirmed) return;

    try {
      setCargando(true);
      await eliminarMembresia(item.id);

      Swal.fire("Eliminado", "Membresía eliminada", "success");

      await cargarDatos();
      await cargarAlertas();
    } catch {
      Swal.fire("Error", "No se pudo eliminar la membresía", "error");
    } finally {
      setCargando(false);
    }
  };

  // ================================
  // Render
  // ================================
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
          {cargando ? "Cargando..." : `${registros.length} membresías registradas`}
        </p>

        <button
          onClick={() => {
            setEditingData(null);
            setModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#212B36] text-white font-medium rounded-md 
                     hover:bg-[#1A222A] transition flex items-center gap-2"
        >
          <span>+</span> Registrar Membresía
        </button>
      </div>

      <MembresiaTable
        data={registros}
        onEdit={editar}
        onRenew={renovar}
        onDelete={eliminar}
        cargando={cargando}
      />

      <MembresiaModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-2xl font-bold text-[#212B36]">
            {editingData?.id ? "Editar Membresía" : "Registrar Nueva Membresía"}
          </h2>

          <button
            onClick={() => setModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <MembresiaForm onSubmit={guardar} initialData={editingData} />
      </MembresiaModal>

      <RenovarMembresiaModal
        open={renovarOpen}
        onClose={() => setRenovarOpen(false)}
        onSubmit={confirmarRenovacion}
        item={renovarTarget}
      />
    </div>
  );
}
