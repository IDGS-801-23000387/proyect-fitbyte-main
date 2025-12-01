// src/modules/Proveedores/components/ProductEditForm.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

function ProductEditForm({ producto, productoId, onUpdate, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    piezasPorPaquete: "",
    precioFinal: "",
    activo: true,
    proveedorId: "",
    foto: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || "",
        precio: producto.precio?.toString() || "",
        categoria: producto.categoria || "",
        piezasPorPaquete: producto.piezasPorPaquete?.toString() || "",
        precioFinal: producto.precioFinal?.toString() || "",
        activo: producto.activo ?? true,
        proveedorId: producto.proveedorId?.toString() || "",
        foto: null,
      });

      setPreview(producto.fotoUrl || "");
    }
  }, [producto, productoId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, foto: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      icon: "question",
      title: "¿Guardar cambios?",
      text: "Se actualizará la información del producto",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const payload = {
      ...form,
      precio: Number(form.precio),
      piezasPorPaquete: Number(form.piezasPorPaquete),
      proveedorId: Number(form.proveedorId || producto.proveedorId),
      precioFinal: Number(form.precioFinal || 0),
      activo: form.activo,
    };

    const idFinal = producto?.id || productoId;

    try {
      await onUpdate(payload, idFinal);

      await Swal.fire({
        icon: "success",
        title: "Producto actualizado correctamente",
        confirmButtonText: "OK",
      });

      onCancel();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "Ocurrió un problema al actualizar el producto.",
      });
    }
  };

  const costoUnitario =
    form.precio && form.piezasPorPaquete
      ? (Number(form.precio) / Number(form.piezasPorPaquete)).toFixed(2)
      : "";

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white h-full shadow-xl p-8 overflow-auto border-l border-gray-200">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#212B36]">
            Editar Producto
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-[#212B36]"
          >
            <X size={26} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nombre del Producto
            </label>
            <input
              name="nombre"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#212B36]"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Precio del paquete (costo)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                name="precio"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 pl-8 focus:ring-2 focus:ring-[#212B36]"
                value={form.precio}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Costo por pieza (calculado)
            </label>
            <input
              disabled
              value={costoUnitario}
              className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Precio final por pieza (venta)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                name="precioFinal"
                value={form.precioFinal}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 pl-8 focus:ring-2 focus:ring-[#212B36]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Categoría
            </label>
            <input
              name="categoria"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#212B36]"
              value={form.categoria}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Piezas por paquete
            </label>
            <input
              type="number"
              name="piezasPorPaquete"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#212B36]"
              value={form.piezasPorPaquete}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Imagen del Producto
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              name="foto"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 file:bg-gray-200 file:rounded-full"
            />

            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="w-32 h-32 mt-3 rounded-xl object-cover border border-gray-200 shadow-sm"
              />
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-[#212B36] hover:bg-black text-white rounded-xl"
            >
              Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ProductEditForm;
