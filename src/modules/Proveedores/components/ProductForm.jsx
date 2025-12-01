import React, { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { useProductos } from "../context/ProductosContext";
import { useProveedores } from "../context/ProveedoresContext";

function ProductForm({ proveedorSeleccionado, onCancel, onSave }) {
  const { crearProducto } = useProductos();
  const { proveedores } = useProveedores();

  const [form, setForm] = useState({
    proveedorId: proveedorSeleccionado?.id ?? "",
    nombre: "",
    precio: "",
    categoria: "",
    piezasPorPaquete: "",
    precioFinal: "",
    foto: null,
  });

  const [preview, setPreview] = useState("");

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

    const proveedorId = proveedorSeleccionado
      ? proveedorSeleccionado.id
      : Number(form.proveedorId);

    if (!proveedorId) {
      return Swal.fire({
        icon: "warning",
        title: "Selecciona un proveedor",
        text: "Debes elegir un proveedor antes de crear el producto.",
      });
    }

    const conf = await Swal.fire({
      icon: "question",
      title: "¿Guardar producto?",
      text: "Se registrará en el inventario",
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (!conf.isConfirmed) return;

    const producto = {
      proveedorId,
      nombre: form.nombre,
      precio: Number(form.precio),
      categoria: form.categoria,
      piezasPorPaquete: Number(form.piezasPorPaquete),
      precioFinal: Number(form.precioFinal || 0),
      foto: form.foto,
    };

    try {
      await crearProducto(producto);

      await Swal.fire({
        icon: "success",
        title: "Producto creado correctamente",
        confirmButtonText: "OK",
      });

      if (onSave) onSave();
      onCancel();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al crear producto",
        text: "Intenta nuevamente.",
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
            Nuevo Producto
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
            <label className="block text-gray-700 font-medium mb-2">Proveedor</label>

            {proveedorSeleccionado ? (
              <div className="bg-gray-100 p-3 rounded-xl text-gray-700 font-medium border border-gray-200">
                {proveedorSeleccionado.nombreEmpresa}
              </div>
            ) : (
              <select
                name="proveedorId"
                value={form.proveedorId}
                onChange={(e) =>
                  setForm({ ...form, proveedorId: Number(e.target.value) })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#212B36] focus:border-[#212B36] outline-none transition"
                required
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombreEmpresa}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nombre del Producto
            </label>
            <input
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#212B36]"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del producto"
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
                value={form.precio}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 pl-8 focus:ring-2 focus:ring-[#212B36]"
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
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 pl-8 focus:ring-2 focus:ring-[#212B36]"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Categoría</label>
            <input
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#212B36]"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              placeholder="Ej: Bebidas, Snacks, Limpieza..."
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
              value={form.piezasPorPaquete}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#212B36]"
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
              name="foto"
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 file:bg-gray-200 file:text-[#212B36] file:rounded-full"
            />

            {preview && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                <img
                  src={preview}
                  className="w-32 h-32 rounded-xl border-2 border-gray-200 object-cover shadow-sm"
                  alt="preview"
                />
              </div>
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
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
