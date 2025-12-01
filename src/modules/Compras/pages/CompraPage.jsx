import React, { useEffect, useState } from "react";
import { useProveedores } from "../../Proveedores/context/ProveedoresContext";
import { useProductos } from "../../Proveedores/context/ProductosContext";
import { crearCompra } from "../api/comprasApi";
import {
  ShoppingCart,
  Package,
  Factory,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

function ComprasPage() {
  const { proveedores, obtenerProveedores } = useProveedores();
  const {
    productos,
    obtenerProductosPorProveedor,
    cargando: cargandoProductos,
  } = useProductos();

  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [cantidadesTarjeta, setCantidadesTarjeta] = useState({});
  const [total, setTotal] = useState(0);
  const [cargandoCompra, setCargandoCompra] = useState(false);

  const noti = (icon, title) => {
    Swal.fire({
      icon,
      title,
      toast: true,
      timer: 1600,
      position: "top-end",
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    obtenerProveedores?.();
  }, []);

  useEffect(() => {
    if (!proveedorSeleccionado) {
      setCarrito([]);
      setCantidadesTarjeta({});
      return;
    }
    obtenerProductosPorProveedor(proveedorSeleccionado.id);
    setCarrito([]);
    setCantidadesTarjeta({});
  }, [proveedorSeleccionado]);

  useEffect(() => {
    setTotal(carrito.reduce((acc, item) => acc + item.subtotal, 0));
  }, [carrito]);

  const handleProveedorChange = (e) => {
    const id = Number(e.target.value);
    const proveedor = proveedores.find((p) => p.id === id) || null;
    setProveedorSeleccionado(proveedor);
  };

  const cambiarCantidadTarjeta = (productoId, nueva) => {
    if (nueva < 1) nueva = 1;
    setCantidadesTarjeta((prev) => ({ ...prev, [productoId]: nueva }));
  };

  const agregarAlCarrito = (producto) => {
    const cantidad = cantidadesTarjeta[producto.id] || 1;
    const existe = carrito.find((x) => x.productoId === producto.id);

    if (existe) {
      const nuevaCantidad = existe.cantidad + cantidad;
      setCarrito(
        carrito.map((x) =>
          x.productoId === producto.id
            ? {
                ...x,
                cantidad: nuevaCantidad,
                subtotal: nuevaCantidad * x.precio,
              }
            : x
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          categoria: producto.categoria,
          fotoUrl: producto.fotoUrl,
          cantidad,
          precioPaquete: producto.precio,
          subtotal: cantidad * producto.precio,
          proveedorId: producto.proveedorId,
        },
      ]);
    }

    setCantidadesTarjeta((prev) => ({ ...prev, [producto.id]: 1 }));
    noti("success", `${producto.nombre} agregado al carrito`);
  };

  const actualizarCantidadCarrito = (productoId, nueva) => {
    if (nueva < 1) return;
    setCarrito(
      carrito.map((x) =>
        x.productoId === productoId
          ? { ...x, cantidad: nueva, subtotal: nueva * x.precioPaquete }
          : x
      )
    );
  };

  const eliminarDelCarrito = async (productoId) => {
    const prod = carrito.find((x) => x.productoId === productoId);
    if (!prod) return;

    const c = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar producto?",
      text: `Se eliminará: ${prod.nombre}`,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!c.isConfirmed) return;

    setCarrito(carrito.filter((x) => x.productoId !== productoId));
    noti("info", "Producto eliminado");
  };

  const confirmarCompra = async () => {
    if (!proveedorSeleccionado) {
      return noti("warning", "Selecciona un proveedor primero");
    }

    if (carrito.length === 0) {
      return noti("warning", "El carrito está vacío");
    }

    const c = await Swal.fire({
      icon: "question",
      title: `¿Confirmar compra por $${total.toFixed(2)}?`,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });

    if (!c.isConfirmed) return;

    const payload = {
      fechaCompra: new Date().toISOString(),
      items: carrito.map((item) => ({
        productoId: item.productoId,
        proveedorId: proveedorSeleccionado.id,
        cantidad: item.cantidad,
        precioUnitario: item.precioPaquete,
        nombre: item.nombre,
        categoria: item.categoria,
        fotoUrl: item.fotoUrl,
      })),
    };

    try {
      setCargandoCompra(true);
      await crearCompra(payload);

      await Swal.fire({
        icon: "success",
        title: "Compra registrada",
        confirmButtonText: "OK",
      });

      setCarrito([]);
      setCantidadesTarjeta({});
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al registrar compra",
      });
    } finally {
      setCargandoCompra(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#10141b] rounded-xl flex items-center justify-center">
              <ShoppingCart size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compras a Proveedores</h1>
              <p className="text-gray-600 text-sm mt-1">
                Registra compras por paquete o pieza
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="block text-gray-800 font-bold mb-3 flex items-center gap-3 text-sm uppercase">
                <div className="w-9 h-9 bg-[#10141b] rounded-lg flex items-center justify-center">
                  <Factory size={18} className="text-white" />
                </div>
                Seleccionar Proveedor
              </label>

              <select
                value={proveedorSeleccionado?.id ?? ""}
                onChange={handleProveedorChange}
                className="w-full border-2 border-gray-300 rounded-lg p-3 bg-white"
              >
                <option value="">Selecciona un proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombreEmpresa}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#10141b] rounded-lg flex items-center justify-center">
                  <Package size={22} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Productos Disponibles</h2>
              </div>

              {!proveedorSeleccionado && (
                <div className="text-center py-16 text-gray-600">
                  Selecciona un proveedor para ver sus productos
                </div>
              )}

              {proveedorSeleccionado && cargandoProductos && (
                <div className="flex flex-col items-center py-16 text-gray-600">
                  <div className="animate-spin h-14 w-14 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4" />
                  Cargando productos...
                </div>
              )}

              {proveedorSeleccionado &&
                !cargandoProductos &&
                productos.length === 0 && (
                  <div className="text-center py-16 text-gray-600">
                    Este proveedor no tiene productos
                  </div>
                )}

              {proveedorSeleccionado &&
                !cargandoProductos &&
                productos.length > 0 && (
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {productos.map((prod) => {
                        const cantidadTarjeta =
                          cantidadesTarjeta[prod.id] || 1;
                        const costoUnitario =
                          prod.precioUnitario ??
                          prod.precio / prod.piezasPorPaquete ??
                          0;

                        return (
                          <div
                            key={prod.id}
                            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg"
                          >
                            <div className="w-full h-44 bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                              {prod.fotoUrl ? (
                                <img
                                  src={prod.fotoUrl}
                                  alt={prod.nombre}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Package className="text-gray-400" size={50} />
                              )}
                            </div>

                            <h3 className="font-bold text-gray-900 text-base mb-2">
                              {prod.nombre}
                            </h3>

                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                {prod.categoria}
                              </span>
                              <span className="text-xs text-gray-600">
                                {prod.piezasPorPaquete} pzs/paquete
                              </span>
                            </div>

                            <div className="space-y-1.5 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  Precio paquete
                                </span>
                                <span className="font-bold text-green-600">
                                  ${Number(prod.precio).toFixed(2)}
                                </span>
                              </div>

                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  Costo por pieza
                                </span>
                                <span className="font-bold text-blue-600">
                                  ${Number(costoUnitario).toFixed(2)}
                                </span>
                              </div>

                              <div className="flex justify-between text-sm pt-1.5 border-t">
                                <span className="text-gray-700">
                                  Precio final/pieza
                                </span>
                                <span className="font-bold text-orange-600">
                                  ${Number(prod.precioFinal || 0).toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                  className="px-2.5 py-1.5 bg-gray-100"
                                  disabled={cantidadTarjeta <= 1}
                                  onClick={() =>
                                    cambiarCantidadTarjeta(
                                      prod.id,
                                      cantidadTarjeta - 1
                                    )
                                  }
                                >
                                  <Minus size={16} />
                                </button>

                                <span className="px-4 font-bold text-gray-900">
                                  {cantidadTarjeta}
                                </span>

                                <button
                                  className="px-2.5 py-1.5 bg-gray-100"
                                  onClick={() =>
                                    cambiarCantidadTarjeta(
                                      prod.id,
                                      cantidadTarjeta + 1
                                    )
                                  }
                                >
                                  <Plus size={16} />
                                </button>
                              </div>

                              <button
                                className="flex-1 py-2 bg-[#10141b] hover:bg-green-600 text-white rounded-lg text-sm font-bold"
                                onClick={() => agregarAlCarrito(prod)}
                              >
                                Agregar
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 lg:sticky lg:top-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
                <div className="w-11 h-11 bg-green-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Carrito de Compra
                  </h2>
                  {carrito.length > 0 && (
                    <p className="text-xs text-gray-600">
                      {carrito.length} {carrito.length === 1 ? "producto" : "productos"}
                    </p>
                  )}
                </div>
              </div>

              {carrito.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ShoppingCart size={32} className="text-green-500" />
                  </div>
                  <p className="text-gray-600 font-semibold">
                    El carrito está vacío
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Agrega productos para comenzar
                  </p>
                </div>
              ) : (
                <>
                  <div className="max-h-80 overflow-y-auto space-y-3 mb-5">
                    {carrito.map((item) => (
                      <div
                        key={item.productoId}
                        className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-white"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">
                              {item.nombre}
                            </h4>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                              {item.categoria}
                            </span>
                          </div>
                          <button
                            className="ml-2 w-7 h-7 flex items-center justify-center rounded bg-red-100 hover:bg-red-200 text-red-600"
                            onClick={() => eliminarDelCarrito(item.productoId)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              className="w-7 h-7 rounded bg-white border border-gray-300 hover:bg-gray-100"
                              onClick={() =>
                                actualizarCantidadCarrito(
                                  item.productoId,
                                  item.cantidad - 1
                                )
                              }
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-bold min-w-[2rem] text-center text-gray-900">
                              {item.cantidad}
                            </span>
                            <button
                              className="w-7 h-7 rounded bg-white border border-gray-300 hover:bg-gray-100"
                              onClick={() =>
                                actualizarCantidadCarrito(
                                  item.productoId,
                                  item.cantidad + 1
                                )
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-600">
                              ${item.precioPaquete.toFixed(2)}/paq
                            </p>
                            <p className="text-base font-bold text-green-600">
                              ${item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-gray-200 pt-5">
                    <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800 text-sm uppercase">
                          Total a Pagar
                        </span>
                        <span className="text-3xl font-bold text-green-600">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-base disabled:opacity-50"
                      disabled={cargandoCompra}
                      onClick={confirmarCompra}
                    >
                      {cargandoCompra ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Procesando...
                        </span>
                      ) : (
                        "Confirmar Compra"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComprasPage;
