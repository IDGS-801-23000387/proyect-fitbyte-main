function CorteCajaModal({ stats, total, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Corte de Caja</h2>
          <button onClick={onClose} className="text-3xl text-gray-500">
            ×
          </button>
        </div>

        <div className="space-y-3">
          <p>
            Hoy: <b>{stats.hoy}</b>
          </p>
          <p>
            Ayer: <b>{stats.ayer}</b>
          </p>
          <p>
            Esta semana: <b>{stats.semana}</b>
          </p>
          <p>
            Este mes: <b>{stats.mes}</b>
          </p>

          <hr />

          <p className="text-lg font-bold">Total generado: ${total}</p>
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CorteCajaModal;
