import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  DollarSign,
  Activity,
  FileText,
  Camera,
  RotateCcw,
  Check,
} from "lucide-react";

export default function MembresiaForm({ onSubmit, initialData }) {
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

 
  useEffect(() => {
    if (initialData?.FotoUrl) {
      setPreview(initialData.FotoUrl);
    } else {
      setPreview("");
      setSelectedFile(null);
    }
  }, [initialData]);

  
  const openCamera = async () => {
    try {
      setShowCamera(true);
      const constraints = {
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      alert("No se pudo acceder a la cámara.");
      setShowCamera(false);
    }
  };

 
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], "foto-perfil.jpg", {
          type: "image/jpeg",
        });
        setSelectedFile(file);
        setPreview(URL.createObjectURL(blob));
        closeCamera();
      },
      "image/jpeg",
      0.8
    );
  };

 
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const switchCamera = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));

    setTimeout(async () => {
      await openCamera();
    }, 100);
  };

   
  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

   
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (selectedFile) formData.append("Foto", selectedFile);

    onSubmit(formData);
  };

  return (
    <>
       
      {showCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto rounded-lg"
            />

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                onClick={switchCamera}
                type="button"
                className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
              >
                <RotateCcw size={24} className="text-white" />
              </button>

              <button
                onClick={takePhoto}
                type="button"
                className="p-4 bg-white rounded-full hover:bg-gray-200 transition-all"
              >
                <Camera size={28} className="text-gray-800" />
              </button>

              <button
                onClick={closeCamera}
                type="button"
                className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
              >
                <Check size={24} className="text-white" />
              </button>
            </div>
          </div>

          <p className="text-white mt-4 text-sm">
            Presiona el ícono de cámara para tomar foto
          </p>
        </div>
      )}

  
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6">
      
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {initialData ? "Editar Membresía" : "Nueva Membresía"}
          </h1>
          <p className="text-gray-600">
            {initialData ? "Modifique los datos del miembro" : "Complete la información del nuevo miembro"}
          </p>
        </div>

         
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-[#212B36] overflow-hidden shadow-lg">
                <img
                  src={preview || "https://i.pravatar.cc/150"}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#212B36] rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <User size={18} className="text-white" />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={openCamera}
                className="px-5 py-2.5 bg-[#212B36] hover:bg-[#1A222A] text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <Camera size={18} />
                Tomar Foto
              </button>

              <label className="px-5 py-2.5 bg-[#212B36] hover:bg-[#1A222A] text-white rounded-xl cursor-pointer font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                <Upload size={18} />
                Subir Archivo
                <input
                  type="file"
                  hidden
                  onChange={onImageChange}
                  accept="image/*"
                  name="Foto"
                />
              </label>
            </div>

            {preview && (
              <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                <Check size={16} /> Foto lista
              </p>
            )}
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-[#212B36]" />
              Información Personal
            </h2>

            <div className="space-y-4">
              <Input
                label="Nombre"
                name="Nombre"
                icon={<User size={18} />}
                required
                defaultValue={initialData?.Nombre ?? ""}
              />

              <Input
                label="Edad"
                name="Edad"
                type="number"
                required
                defaultValue={initialData?.Edad ?? ""}
              />

              <Input
                label="Teléfono"
                name="Telefono"
                icon={<Phone size={18} />}
                required
                defaultValue={initialData?.Telefono ?? ""}
              />

              <Input
                label="Dirección"
                name="Direccion"
                icon={<MapPin size={18} />}
                required
                defaultValue={initialData?.Direccion ?? ""}
              />

              <Input
                label="Correo"
                name="Correo"
                type="email"
                icon={<Mail size={18} />}
                required
                defaultValue={initialData?.Correo ?? ""}
              />
            </div>
          </div>

         
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-[#212B36]" />
              Detalles de Membresía
            </h2>

            <div className="space-y-4">
              <Select
                label="Tipo de Membresía"
                name="Tipo"
                options={["Anualidad", "Mensual"]}
                icon={<Activity size={18} />}
                required
                defaultValue={initialData?.Tipo ?? ""}
              />

              <Select
                label="Nivel"
                name="Nivel"
                options={["Basico", "Estudiante", "Premium"]}
                icon={<Activity size={18} />}
                required
                defaultValue={initialData?.Nivel ?? ""}
              />

              <Select
                label="Rutina"
                name="Rutina"
                options={[
                  "Pérdida de peso",
                  "Aumento de masa muscular",
                  "Tonificación",
                  "Fuerza",
                  "Cardio / Resistencia",
                  "Funcional",
                  "Rehabilitación",
                  "Flexibilidad / Movilidad",
                ]}
                icon={<FileText size={18} />}
                required
                defaultValue={initialData?.Rutina ?? ""}
              />

              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-[#212B36]" />
                Información Médica
              </h2>

              <Input
                label="Enfermedades o Lesiones"
                name="EnfermedadesOLesiones"
                placeholder="Especifique condiciones médicas relevantes"
                defaultValue={initialData?.EnfermedadesOLesiones ?? ""}
              />
            </div>
          </div>

          
          <div className="bg-white rounded-2xl p-6 shadow-sm border-gray-200 shadow-sm md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-[#212B36]" />
              Pago y Fechas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Forma de Pago"
                name="FormaPago"
                options={["Efectivo", "Tarjeta"]}
                icon={<DollarSign size={18} />}
                required
                defaultValue={initialData?.FormaPago ?? ""}
              />

              <Input
                label="Monto Pagado"
                name="MontoPagado"
                type="number"
                step="0.01"
                min="0"
                icon={<DollarSign size={18} />}
                required
                defaultValue={initialData?.MontoPagado ?? ""}
              />

              <Input
                label="Fecha de Registro"
                type="datetime-local"
                name="FechaRegistro"
                icon={<Calendar size={18} />}
                required
                defaultValue={initialData?.FechaRegistro ?? ""}
              />

              <Input
                label="Fecha de Vencimiento"
                type="datetime-local"
                name="FechaVencimiento"
                icon={<Calendar size={18} />}
                required
                defaultValue={initialData?.FechaVencimiento ?? ""}
              />
            </div>
          </div>
        </div>

        
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => onSubmit(null)}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl shadow-sm"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-7 py-3 bg-[#212B36] hover:bg-[#1A222A] text-white rounded-xl shadow-md hover:shadow-lg"
          >
            {initialData ? "Guardar Miembro" : "Guardar Miembro"}
          </button>
        </div>
      </form>
    </>
  );
}

 

function Input({
  label,
  name,
  type = "text",
  icon,
  placeholder,
  required = false,
  ...props
}) {
  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-700 text-sm">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`w-full border border-gray-300 px-4 py-3 rounded-xl shadow-sm 
          focus:ring-2 focus:ring-[#212B36] focus:border-[#212B36] transition-all 
          ${icon ? "pl-10" : ""}`}
          {...props}
        />
      </div>
    </div>
  );
}

function Select({
  label,
  name,
  options,
  icon,
  required = false,
  defaultValue,
}) {
  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-700 text-sm">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <select
          name={name}
          required={required}
          defaultValue={defaultValue ?? ""}
          className={`w-full border border-gray-300 px-4 py-3 rounded-xl shadow-sm 
          focus:ring-2 focus:ring-[#212B36] focus:border-[#212B36] transition-all 
          appearance-none ${icon ? "pl-10" : ""}`}
        >
          <option value="">Seleccionar...</option>

          {options.map((op, i) => (
            <option key={i} value={op}>
              {op}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          ▼
        </div>
      </div>
    </div>
  );
}