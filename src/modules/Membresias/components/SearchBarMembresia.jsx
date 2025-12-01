import { Search } from "lucide-react";

export default function SearchBarMembresia({ search, setSearch }) {
  return (
    <div className="relative w-96 mb-6">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar membresía…"
        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white shadow-md border border-gray-200 
                   focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
      />
    </div>
  );
}
