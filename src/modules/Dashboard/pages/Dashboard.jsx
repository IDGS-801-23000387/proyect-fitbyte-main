import React, { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  Package,
  UserCheck,
  Clock,
  BarChart3,
  CreditCard,
  Loader2,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../../../api/axiosConfig";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState(null);
  const [ingresosMensuales, setIngresosMensuales] = useState([]);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const r1 = await api.get("/Dashboard/resumen-general");
        const r2 = await api.get("/Dashboard/ingresos-mensuales");
        const r3 = await api.get("/Dashboard/membresias-por-vencer");

        const data1 = r1.data;
        const data2 = r2.data;

        setResumen({
          ...data1,
          membresiasPorVencer: r3.data,
        });

        const grafica = Array.from({ length: 12 }).map((_, i) => ({
          mes: [
            "Ene","Feb","Mar","Abr","May","Jun",
            "Jul","Ago","Sep","Oct","Nov","Dic",
          ][i],
          productos:
            data2.ventasProductos?.find((x) => x.mes === i + 1)?.total || 0,
          visitas:
            data2.visitas?.find((x) => x.mes === i + 1)?.total || 0,
        }));

        setIngresosMensuales(grafica);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="w-full flex justify-center py-32 bg-white min-h-screen">
        <Loader2 className="animate-spin text-purple-500" size={42} />
      </div>
    );

  const r = resumen;

 
  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-[#1E293B] rounded-2xl shadow-lg p-6 hover:scale-[1.02] transition-all">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="text-white" size={28} />
        </div>
        <div>
          <p className="text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-gray-400 text-xs font-light mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#F5F7FA] min-h-screen p-6">

    
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Dashboard FitByte
        </h1>
        <p className="text-gray-600 mt-1">Resumen general del gimnasio</p>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={Users}
          title="Membresías Activas"
          value={r.miembros.activas}
          subtitle="Socios activos"
          color="bg-blue-600"
        />
        <StatCard
          icon={DollarSign}
          title="Ingresos del Mes"
          value={`$${(
            r.ventas.productosMes + r.ventas.visitasMes
          ).toLocaleString()}`}
          subtitle="Total acumulado"
          color="bg-green-600"
        />
        <StatCard
          icon={ShoppingCart}
          title="Ventas Hoy"
          value={`$${(
            r.ventas.productosHoy + r.ventas.visitasHoy
          ).toLocaleString()}`}
          subtitle={`${r.visitas.hoy} visitas`}
          color="bg-purple-600"
        />
        <StatCard
          icon={UserCheck}
          title="Asistencias Hoy"
          value={r.asistencias.hoy}
          subtitle="Entradas registradas"
          color="bg-indigo-600"
        />
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={AlertCircle}
          title="Membresías Vencidas"
          value={r.miembros.vencidas}
          subtitle="Requieren atención"
          color="bg-red-500"
        />
        <StatCard
          icon={Clock}
          title="Por Vencer (3 días)"
          value={r.miembros.porVencer}
          subtitle="Urgente renovar"
          color="bg-orange-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Nuevos Socios"
          value={r.miembros.nuevasMes}
          subtitle="Este mes"
          color="bg-teal-600"
        />
        <StatCard
          icon={Package}
          title="Stock Bajo"
          value={r.inventario.stockBajo}
          subtitle="Productos críticos"
          color="bg-cyan-500"
        />
      </div>
 
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Ingresos Mensuales
          </h2>
          <BarChart3 className="text-green-600" size={26} />
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ingresosMensuales}>
              <XAxis dataKey="mes" stroke="#334155" tick={{ fill: "#334155" }} />
              <YAxis stroke="#334155" tick={{ fill: "#334155" }} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                }}
                labelStyle={{ color: "#0F172A" }}
              />
              <Bar dataKey="productos" fill="#6366F1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="visitas" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
 
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Membresías por vencer
        </h2>

        <div className="space-y-4">
          {r.membresiasPorVencer.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between p-3 border-b border-gray-200"
            >
              <div>
                <h3 className="text-gray-900 font-semibold">{m.nombre}</h3>
                <p className="text-gray-600 text-sm">
                  Código: {m.codigoCliente}
                </p>
              </div>

              <span className="text-rose-600 font-semibold">
                {new Date(m.fechaVencimiento).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1E293B] rounded-2xl shadow p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CreditCard size={32} />
            <span className="text-3xl font-bold">
              {Math.floor(r.miembros.activas / 3)}
            </span>
          </div>
          <h3 className="text-lg font-semibold">Membresías Básicas</h3>
        </div>

        <div className="bg-[#1E293B] rounded-2xl shadow p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CreditCard size={32} />
            <span className="text-3xl font-bold">
              {Math.floor(r.miembros.activas / 2)}
            </span>
          </div>
          <h3 className="text-lg font-semibold">Membresías Estándar</h3>
        </div>

        <div className="bg-[#1E293B] rounded-2xl shadow p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CreditCard size={32} />
            <span className="text-3xl font-bold">
              {Math.floor(r.miembros.activas / 4)}
            </span>
          </div>
          <h3 className="text-lg font-semibold">Membresías Premium</h3>
        </div>
      </div>
    </div>
  );
}
