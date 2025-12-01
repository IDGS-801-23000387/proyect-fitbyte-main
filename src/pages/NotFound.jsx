import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-100 to-white text-center px-4">
      <h1 className="text-7xl font-extrabold text-gray-900 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-3">Página no encontrada</h2>
      <p className="text-gray-500 mb-6 max-w-md">
        Lo sentimos , la página que buscas no existe o fue movida.  
        Puedes volver al inicio para seguir explorando .
      </p>
      <Link
        to="/"
        className="bg-gray-900 text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-800 transition-all duration-300"
      >
         Volver al inicio
      </Link>
    </div>
  );
}
