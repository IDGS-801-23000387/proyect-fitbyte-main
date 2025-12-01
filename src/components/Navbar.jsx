import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardList,
  ShoppingCart,
  Truck,
  UserPlus,
  BarChart3,
  LogOut,
  Dumbbell,
  Search,
  History,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const go = (ruta) => {
    navigate(ruta);
    setIsOpen(false);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("isLoggedIn");
        navigate("/auth/login");
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#10141b] text-white p-2 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

       
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

       
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-[#10141b] text-gray-300 flex flex-col h-screen
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        
        <div className="p-6 flex items-center gap-3">
          <h1 className="text-white text-2xl font-bold">FitByte</h1>
        </div>

        
        <div className="flex-1 overflow-y-auto">
          {/* ADMINISTRACIÓN */}
          <div className="px-6 py-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              ADMINISTRACIÓN
            </h2>

            <nav className="space-y-1">
              <button
                onClick={() => go("/dashboard")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <LayoutDashboard size={20} />
                <span className="text-sm">Dashboard General</span>
              </button>

              <button
                onClick={() => go("/membresias")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <Users size={20} />
                <span className="text-sm">Membresías</span>
              </button>

              <button
                onClick={() => go("/pre-registro")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <UserPlus size={20} />
                <span className="text-sm">Pre-Registro</span>
              </button>

              <button
                onClick={() => go("/asistencia")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <CalendarCheck size={20} />
                <span className="text-sm">Asistencias</span>
              </button>

              <button
                onClick={() => go("/visitas")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <ClipboardList size={20} />
                <span className="text-sm">Visitas</span>
              </button>
            </nav>
          </div>

          {/* INVENTARIO Y VENTAS */}
          <div className="px-6 py-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              INVENTARIO Y VENTAS
            </h2>

            <nav className="space-y-1">
              <button
                onClick={() => go("/ventas")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <ShoppingCart size={20} />
                <span className="text-sm">Ventas</span>
              </button>

              <button
                onClick={() => go("/ventas/historial")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <History size={20} />
                <span className="text-sm">Historial de Ventas</span>
              </button>

              <button
                onClick={() => go("/compras")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <Truck size={20} />
                <span className="text-sm">Compras a Proveedores</span>
              </button>

              <button
                onClick={() => go("/compras/historial")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <History size={20} />
                <span className="text-sm">Historial de Compras</span>
              </button>

              <button
                onClick={() => go("/proveedores")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <Truck size={20} />
                <span className="text-sm">Proveedores</span>
              </button>
            </nav>
          </div>

          {/* ENTRENAMIENTO */}
          <div className="px-6 py-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              ENTRENAMIENTO
            </h2>

            <nav className="space-y-1">
              <button
                onClick={() => go("/rutinas")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <Dumbbell size={20} />
                <span className="text-sm">Rutinas</span>
              </button>
            </nav>
          </div>

          {/* REPORTES */}
          <div className="px-6 py-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              REPORTES
            </h2>

            <nav className="space-y-1">
              <button
                onClick={() => go("/corte-caja")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
              >
                <BarChart3 size={20} />
                <span className="text-sm">Reportes Financieros</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-6 border-t border-slate-700">
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-slate-700 text-gray-300 pl-10 pr-4 py-2.5 rounded-lg text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=6d28d9&color=fff"
              className="w-12 h-12 rounded-full"
              alt="Admin"
            />
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Administrador</p>
              <p className="text-gray-400 text-xs">admin@fitbyte.com</p>
            </div>

            <LogOut
              size={20}
              className="cursor-pointer text-white hover:text-red-300"
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;