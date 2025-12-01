import React, { useState, useEffect } from "react";
import { Loader, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Keypad from "../components/Keypad";
import { verificarAsistenciaRequest } from "../api/asistencia.api";

export default function Asistencia() {

  const [clienteId, setClienteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const [horaActual, setHoraActual] = useState("");
  const navigate = useNavigate();

   
  useEffect(() => {
    const interval = setInterval(() => {
      setHoraActual(new Date().toLocaleTimeString("es-MX"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  
  const handleIngresar = async () => {
    if (!clienteId) {
      setTipoMensaje("warning");
      setMensaje("Por favor ingresa tu ID");
      return;
    }

    try {
      setLoading(true);
      setMensaje("");

      const response = await verificarAsistenciaRequest(clienteId);

     
      navigate("/asistencia/resultado", {
        state: response.data,  
      });

      setClienteId("");

    } catch (err) {
      console.log(err);
      setTipoMensaje("error");
      setMensaje("ID no encontrado o membresía vencida");
    }

    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center p-6">

      
      <div className="text-center mt-4">
        <div className="flex justify-center">
          <div className="bg-[#10141b] rounded-3xl p-4 shadow-xl">
            <img src="/fondo3.png" alt="FitByte" className="h-36" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Bienvenid@, por favor ingresa tu ID
        </h1>

        <p className="text-4xl font-bold text-gray-700 mt-4">{horaActual}</p>
      </div>

      
      <input
        readOnly
        value={clienteId}
        className="w-full max-w-md mt-6 px-6 py-4 text-center text-xl border-2 border-gray-300 rounded-lg"
        placeholder="Ingrese su ID"
      />

      
      <button
        onClick={handleIngresar}
        disabled={loading}
        className="w-full max-w-3xl py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-lg mt-6"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader className="animate-spin" size={20} /> Verificando...
          </span>
        ) : (
          "Ingresar"
        )}
      </button>

     
      {mensaje && (
        <div
          className={`mt-4 p-4 rounded-lg max-w-md text-center ${
            tipoMensaje === "error"
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-yellow-100 border border-yellow-400 text-yellow-700"
          }`}
        >
          {tipoMensaje === "error" && <XCircle size={20} />}
          <p>{mensaje}</p>
        </div>
      )}

     
      <Keypad
        onNumber={(n) => setClienteId((prev) => prev + n)}
        onClear={() => setClienteId("")}
      />

      <p className="mt-10 text-gray-400 text-sm">
        © FitByte Gym 2025
      </p>

    </div>
  );
}
