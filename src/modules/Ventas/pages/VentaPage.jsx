import React, { useEffect, useState } from "react";
import { obtenerProductos, crearVenta } from "../api/ventasApi";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Search,
  User,
  Package,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";

export default function VentaPage() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState("Mostrador");
  const [busqueda, setBusqueda] = useState("");
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const data = await obtenerProductos();

        const normalizados = data.map((p) => ({
          id: p.id ?? p.Id ?? p.productoId ?? p.ProductoId,
          nombre: p.nombre ?? p.Nombre ?? "Producto sin nombre",
          precioPaquete: Number(
            p.precioPaquete ??
              p.PrecioPaquete ??
              p.precio ??
              p.Precio ??
              0
          ),
          precioUnitario: Number(
            p.precioUnitario ?? p.PrecioUnitario ?? 0
          ),
          stock: Number(
            p.stockActual ??
              p.StockActual ??
              p.stock ??
              0
          ),
          categoria: p.categoria ?? p.Categoria ?? "General",
          fotoUrl: p.fotoUrl ?? p.FotoUrl ?? "",
        }));

        setProductos(normalizados);
        setProductosFiltrados(normalizados);

        const iniciales = {};
        normalizados.forEach((p) => (iniciales[p.id] = 1));
        setCantidades(iniciales);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error cargando productos",
        });
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  useEffect(() => {
    if (!busqueda.trim()) {
      setProductosFiltrados(productos);
      return;
    }

    const t = busqueda.toLowerCase();

    setProductosFiltrados(
      productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(t) ||
          p.categoria.toLowerCase().includes(t)
      )
    );
  }, [busqueda, productos]);

  const stockRestante = (id) => {
    const p = productos.find((x) => x.id === id);
    if (!p) return 0;

    const enCarrito = carrito.find((x) => x.productoId === id)?.cantidad ?? 0;

    return p.stock - enCarrito;
  };

  const cambiarCantidadTarjeta = (productoId, nueva) => {
    if (nueva < 1) nueva = 1;

    if (nueva > stockRestante(productoId)) {
      Swal.fire({
        icon: "warning",
        title: "Stock insuficiente",
      });
      return;
    }

    setCantidades((prev) => ({ ...prev, [productoId]: nueva }));
  };

  const agregar = (prod) => {
    const restante = stockRestante(prod.id);

    if (restante <= 0) {
      Swal.fire({
        icon: "error",
        title: "Sin stock",
        text: "Este producto no está disponible",
      });
      return;
    }

    const cantidad = cantidades[prod.id] || 1;
    const existe = carrito.find((x) => x.productoId === prod.id);

    if (existe) {
      const nuevaCantidad = existe.cantidad + cantidad;

      if (nuevaCantidad > prod.stock) {
        Swal.fire({
          icon: "warning",
          title: "Stock insuficiente",
        });
        return;
      }

      setCarrito(
        carrito.map((x) =>
          x.productoId === prod.id
            ? {
                ...x,
                cantidad: nuevaCantidad,
                subtotal: nuevaCantidad * x.precioUnitario,
              }
            : x
        )
      );

      Swal.fire({
        icon: "success",
        title: "Cantidad actualizada",
      });

      return;
    }

    setCarrito([
      ...carrito,
      {
        productoId: prod.id,
        nombre: prod.nombre,
        cantidad,
        precioUnitario: prod.precioUnitario,
        subtotal: cantidad * prod.precioUnitario,
        fotoUrl: prod.fotoUrl,
      },
    ]);

    setCantidades((prev) => ({ ...prev, [prod.id]: 1 }));

    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      text: prod.nombre,
    });
  };

  const actualizarCantidadCarrito = (id, nueva) => {
    if (nueva < 1) return;

    const p = productos.find((x) => x.id === id);
    if (!p) return;

    if (nueva > p.stock) {
      Swal.fire({
        icon: "warning",
        title: "Stock insuficiente",
      });
      return;
    }

    setCarrito(
      carrito.map((x) =>
        x.productoId === id
          ? { ...x, cantidad: nueva, subtotal: nueva * x.precioUnitario }
          : x
      )
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((x) => x.productoId !== id));

    Swal.fire({
      icon: "info",
      title: "Producto eliminado",
    });
  };

  useEffect(() => {
    setTotal(carrito.reduce((acc, x) => acc + x.subtotal, 0));
  }, [carrito]);

  const guardar = async () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Carrito vacío",
      });
      return;
    }

    const confirm = await Swal.fire({
      icon: "question",
      title: "Confirmar Venta",
      text: `¿Registrar venta por $${total.toFixed(2)}?`,
      showCancelButton: true,
      confirmButtonColor: "#121824",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, registrar",
    });

    if (!confirm.isConfirmed) return;

    try {
      setCargando(true);

      const venta = {
        cliente,
        items: carrito.map((x) => ({
          productoId: x.productoId,
          cantidad: x.cantidad,
          precioUnitario: x.precioUnitario,
        })),
      };

      await crearVenta(venta);

      Swal.fire({
        icon: "success",
        title: "Venta registrada",
      });

      setCarrito([]);
      setCliente("Mostrador");
      setBusqueda("");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar la venta",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#10141b] rounded-xl flex items-center justify-center">
              <ShoppingBag size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
              <p className="text-gray-600 text-sm mt-1">
                Registra las ventas de productos del inventario
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-md">
                <label className="font-bold text-gray-800 flex items-center gap-2 mb-3 text-sm uppercase">
                  <div className="w-8 h-8 bg-[#10141b] rounded-lg flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  Cliente
                </label>
                <input
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Nombre del cliente"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg hover:bg-[#dee4ee] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <label className="font-bold text-gray-800 flex items-center gap-2 mb-3 text-sm uppercase">
                  <div className="w-8 h-8 bg-[#10141b] rounded-lg flex items-center justify-center">
                    <Search size={16} className="text-white" />
                  </div>
                  Buscar Producto
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Nombre o categoría..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 p-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#10141b] rounded-lg flex items-center justify-center">
                  <Package size={22} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Catálogo de Productos</h2>
              </div>

              {cargando ? (
                <div className="flex flex-col items-center py-16 text-gray-600">
                  <div className="animate-spin h-14 w-14 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4" />
                  <p className="font-semibold text-lg">Cargando productos...</p>
                </div>
              ) : productosFiltrados.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Package size={40} className="text-blue-400" />
                  </div>
                  <p className="text-gray-600 font-medium text-lg">
                    {busqueda ? "No se encontraron productos" : "No hay productos disponibles"}
                  </p>
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productosFiltrados.map((p) => {
                      const restante = stockRestante(p.id);
                      const cantidadTarjeta = cantidades[p.id] || 1;
                      const sinStock = restante <= 0;

                      return (
                        <div
                          key={p.id}
                          className={`border border-gray-200 rounded-lg p-4 bg-white transition-all ${
                            sinStock ? "opacity-50" : "hover:shadow-lg"
                          }`}
                        >
                          <div className="relative w-full h-44 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                            {p.fotoUrl ? (
                              <img
                                src={p.fotoUrl}
                                alt={p.nombre}
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <Package className="text-gray-400" size={50} />
                            )}
                            {sinStock && (
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                                  SIN STOCK
                                </span>
                              </div>
                            )}
                          </div>

                          <h3 className="font-bold text-gray-900 text-base mb-1">
                            {p.nombre}
                          </h3>
                          <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded mb-3">
                            {p.categoria}
                          </span>

                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-700">Precio por pieza</span>
                            <span className="text-xl font-bold text-green-600">
                              ${p.precioUnitario.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle
                              size={16}
                              className={
                                restante <= 0
                                  ? "text-red-600"
                                  : restante <= 5
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }
                            />
                            <span className="text-sm">
                              Stock disponible:{" "}
                              <span
                                className={`font-bold ${
                                  restante <= 0
                                    ? "text-red-600"
                                    : restante <= 5
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                }`}
                              >
                                {restante}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                                disabled={cantidadTarjeta <= 1 || sinStock}
                                onClick={() =>
                                  cambiarCantidadTarjeta(p.id, cantidadTarjeta - 1)
                                }
                              >
                                <Minus size={16} />
                              </button>

                              <span className="px-4 font-bold text-gray-900">
                                {cantidadTarjeta}
                              </span>

                              <button
                                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                                disabled={sinStock}
                                onClick={() =>
                                  cambiarCantidadTarjeta(p.id, cantidadTarjeta + 1)
                                }
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              className="flex-1 py-2 bg-[#10141b] hover:bg-green-600 text-white rounded-lg text-sm font-bold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                              disabled={sinStock}
                              onClick={() => agregar(p)}
                            >
                              {sinStock ? "Sin stock" : "Agregar"}
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
            <div className="bg-white p-6 rounded-xl shadow-md lg:sticky lg:top-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
                <div className="w-11 h-11 bg-green-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Carrito</h2>
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
                    <ShoppingBag size={32} className="text-green-500" />
                  </div>
                  <p className="text-gray-600 font-semibold">
                    El carrito está vacío
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Agrega productos para continuar
                  </p>
                </div>
              ) : (
                <>
                  <div className="max-h-80 overflow-y-auto space-y-3 mb-5">
                    {carrito.map((i) => {
                      const restante = stockRestante(i.productoId);

                      return (
                        <div
                          key={i.productoId}
                          className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-white transition-colors"
                        >
                          <div className="flex gap-3 mb-2">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                              {i.fotoUrl ? (
                                <img
                                  src={i.fotoUrl}
                                  alt={i.nombre}
                                  className="max-w-full max-h-full object-contain"
                                />
                              ) : (
                                <Package className="text-gray-400" size={20} />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-gray-900 text-sm truncate">
                                  {i.nombre}
                                </span>
                                <button
                                  className="ml-2 w-7 h-7 flex items-center justify-center rounded bg-red-100 hover:bg-red-200 text-red-600 transition-colors flex-shrink-0"
                                  onClick={() => eliminarDelCarrito(i.productoId)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <button
                                className="w-7 h-7 rounded bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
                                onClick={() =>
                                  actualizarCantidadCarrito(i.productoId, i.cantidad - 1)
                                }
                              >
                                <Minus size={14} />
                              </button>

                              <span className="font-bold min-w-[2rem] text-center text-gray-900">
                                {i.cantidad}
                              </span>

                              <button
                                className="w-7 h-7 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center transition-colors"
                                onClick={() =>
                                  actualizarCantidadCarrito(i.productoId, i.cantidad + 1)
                                }
                                disabled={restante <= 0}
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-gray-600">
                                ${i.precioUnitario.toFixed(2)}/pza
                              </p>
                              <p className="font-bold text-green-600">
                                ${i.subtotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t-2 border-gray-200 pt-5">
                    <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800 text-sm uppercase">
                          Total a Cobrar
                        </span>
                        <span className="text-3xl font-bold text-green-600">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={guardar}
                      disabled={cargando}
                      className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {cargando ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Procesando...
                        </span>
                      ) : (
                        "Registrar Venta"
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
