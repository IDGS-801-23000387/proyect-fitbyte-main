import { TrashIcon } from "@heroicons/react/solid";

export default function RutinaTable({ rutinas, onDelete }) {
    return (
        <div className="bg-white rounded-xl shadow p-5">
            {rutinas.length === 0 ? (
                <p className="text-gray-500">No hay rutinas registradas.</p>
            ) : (
                <div className="space-y-3">
                    {rutinas.map((r) => (
                        <div
                            key={r.id}
                            className="border rounded-lg px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                        >
                            <div>
                                <p className="text-lg font-semibold text-gray-800">
                                    {r.titulo}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Nivel: {r.nivel} — Género: {r.genero}
                                </p>
                            </div>

                            <button
                                onClick={() => onDelete(r.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <TrashIcon className="h-6 w-6" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}