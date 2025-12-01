import "./index.css";

function App() {
  return (
    <div className="min-h-screen flex">
     
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center">
        <h1 className="text-white text-5xl font-bold text-center">
          Bienvenido a <br />
          <span className="text-yellow-300">FitByte Gym</span>
        </h1>
      </div>

      
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50">
        <div className="bg-white shadow-2xl rounded-2xl w-11/12 max-w-md p-8">
          <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-6">
            Inicia sesión
          </h2>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            ¿No tienes una cuenta?{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
