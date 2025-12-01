import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, CalendarDays, User2, Clock, QrCode } from "lucide-react";

export default function ResultadoAsistencia() {

  const { state } = useLocation();
  const navigate = useNavigate();

 
  useEffect(() => {
    if (!state) return;

    const timer = setTimeout(() => {
      navigate("/asistencia");
    }, 8000);

    return () => clearTimeout(timer);
  }, [state, navigate]);

 
  if (!state) {
    return (
      <div className="w-full p-10 text-center">
        <p>No hay información disponible.</p>
        <button onClick={() => navigate("/asistencia")} className="underline text-blue-600">
          Volver
        </button>
      </div>
    );
  }

  const {
    estado,
    mensaje,
    nombre,
    fotoUrl,
    fechaVencimiento
  } = state;

  const fechaFormateada = new Date(fechaVencimiento).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const horaActual = new Date().toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full flex justify-center items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 h-full">
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl border border-white/60 rounded-3xl p-8 w-full max-w-md text-center">

        
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-gray-600 text-sm">
            <Clock size={14} /> {horaActual}
          </div>
        </div>

     
        <div className="flex justify-center mb-6">
          <img className="w-28 h-28 rounded-full shadow-lg" src={fotoUrl} alt={nombre} />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido!</h1>
        <p className="text-gray-600 mb-8 text-lg">{mensaje}</p>

        <div className="bg-blue-50 p-4 rounded-xl mb-6">
          <User2 className="inline-block text-blue-500" size={20} />
          <p className="text-xl font-semibold">{nombre}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl mb-6 border border-green-200">
          <CheckCircle className="inline-block text-green-600" size={24} />
          <p className="font-bold text-green-700">Membresía {estado}</p>
        </div>

        <div className="bg-white border p-4 rounded-xl">
          <CalendarDays size={20} className="text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-700">{fechaFormateada}</p>
        </div>

      </div>
    </div>
  );
}
