import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-3xl">
          <div className="relative">
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
              <i className="fas fa-search text-xl text-[#212B36] opacity-80"></i>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-16 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#212B36]/20 focus:border-[#212B36] transition-all duration-300 text-lg text-gray-800 placeholder-gray-500 bg-gray-50/50 hover:bg-white"
            />
          </div>
        </div>
        
         
        {value && (
          <button
            onClick={() => onChange("")}
            className="ml-4 px-5 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl transition-all duration-300 font-semibold"
          >
            <i className="fas fa-times mr-2"></i>
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}