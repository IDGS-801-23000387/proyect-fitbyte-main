import React from "react";
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
  CreditCard
} from 'lucide-react';

export default function Home() {

  // Datos de ejemplo (luego los conectarás a tu API)
  const stats = {
    membresiasActivas: 245,
    membresiasVencidas: 12,
    ventasHoy: 4500,
    visitasHoy: 87,
    productosVendidos: 23,
    renovacionesPendientes: 8,
    ingresosMes: 125000,
    nuevosSocios: 15
  };

  const ventasRecientes = [
    { id: 1, producto: "Proteína Whey 2kg", cantidad: 2, total: 1200, fecha: "10:30 AM" },
    { id: 2, producto: "Shaker", cantidad: 1, total: 150, fecha: "11:45 AM" },
    { id: 3, producto: "Membresía Premium", cantidad: 1, total: 1500, fecha: "12:00 PM" },
    { id: 4, producto: "Creatina 300g", cantidad: 1, total: 450, fecha: "02:15 PM" }
  ];

  const membresiasPorVencer = [
    { nombre: "Juan Pérez", tipo: "Premium", vence: "15/11/2025", dias: 3 },
    { nombre: "María González", tipo: "Estándar", vence: "16/11/2025", dias: 4 },
    { nombre: "Carlos López", tipo: "Básica", vence: "18/11/2025", dias: 6 },
    { nombre: "Ana Martínez", tipo: "Premium", vence: "20/11/2025", dias: 8 }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard FitByte</h1>
        <p className="text-gray-600">Resumen general del gimnasio</p>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Membresías Activas"
          value={stats.membresiasActivas}
          subtitle="Socios activos"
          color="bg-blue-500"
          trend={12}
        />
        <StatCard
          icon={DollarSign}
          title="Ingresos del Mes"
          value={`$${stats.ingresosMes.toLocaleString()}`}
          subtitle="Acumulado mensual"
          color="bg-green-500"
          trend={8}
        />
        <StatCard
          icon={ShoppingCart}
          title="Ventas Hoy"
          value={`$${stats.ventasHoy.toLocaleString()}`}
          subtitle={`${stats.productosVendidos} productos`}
          color="bg-purple-500"
        />
        <StatCard
          icon={UserCheck}
          title="Visitas Hoy"
          value={stats.visitasHoy}
          subtitle="Asistencias registradas"
          color="bg-indigo-500"
        />
      </div>

      {/* STATS SECUNDARIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={AlertCircle}
          title="Membresías Vencidas"
          value={stats.membresiasVencidas}
          subtitle="Requieren atención"
          color="bg-red-500"
        />
        <StatCard
          icon={Clock}
          title="Renovaciones Pendientes"
          value={stats.renovacionesPendientes}
          subtitle="Próximas a vencer"
          color="bg-orange-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Nuevos Socios"
          value={stats.nuevosSocios}
          subtitle="Este mes"
          color="bg-teal-500"
          trend={20}
        />
        <StatCard
          icon={Package}
          title="Productos Vendidos"
          value={stats.productosVendidos}
          subtitle="Hoy"
          color="bg-cyan-500"
        />
      </div>

      {/* TABLAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Ventas Recientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Ventas Recientes</h2>
            <ShoppingCart className="text-purple-500" size={24} />
          </div>

          <div className="space-y-4">
            {ventasRecientes.map((venta) => (
              <div key={venta.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{venta.producto}</p>
                  <p className="text-sm text-gray-500">{venta.fecha} • Cant: {venta.cantidad}</p>
                </div>
                <span className="font-bold text-green-600">${venta.total}</span>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-purple-600 font-semibold hover:bg-purple-50 rounded-lg">
            Ver todas las ventas →
          </button>
        </div>

        {/* Membresías por vencer */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Membresías por Vencer</h2>
            <AlertCircle className="text-orange-500" size={24} />
          </div>

          <div className="space-y-4">
            {membresiasPorVencer.map((m, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{m.nombre}</p>
                  <p className="text-sm text-gray-500">{m.tipo} • Vence: {m.vence}</p>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold 
                  ${m.dias <= 3 ? 'bg-red-100 text-red-700' : 
                    m.dias <= 7 ? 'bg-orange-100 text-orange-700' : 
                    'bg-yellow-100 text-yellow-700'}
                `}>
                  {m.dias} días
                </span>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-orange-600 font-semibold hover:bg-orange-50 rounded-lg">
            Ver todas las alertas →
          </button>
        </div>

      </div>

      {/* GRÁFICA SIMULADA */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Ingresos Semanales</h2>
          <BarChart3 className="text-green-500" size={24} />
        </div>

        <div className="flex items-end justify-between h-64 gap-4">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia) => {
            const height = Math.random() * 80 + 20;
            return (
              <div key={dia} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: `${height}%` }}></div>
                <span className="text-sm text-gray-600 font-medium">{dia}</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* DISTRIBUCIÓN MEMBRESÍAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CreditCard size={32} />
            <span className="text-3xl font-bold">89</span>
          </div>
          <h3 className="text-lg font-semibold">Membresías Básicas</h3>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CreditCard size={32} />
            <span className="text-3xl font-bold">102</span>
          </div>
          <h3 className="text-lg font-semibold">Membresías Estándar</h3>
        </div>

        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CreditCard size={32} />
            <span className="text-3xl font-bold">54</span>
          </div>
          <h3 className="text-lg font-semibold">Membresías Premium</h3>
        </div>
      </div>

    </div>
  );
}
