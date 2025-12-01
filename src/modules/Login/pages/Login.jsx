import { useState } from "react";
import { loginRequest } from "../api/login.api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginRequest(usuario, contrasena);

      if (res.data.message === "Inicio de sesión exitoso") {
        localStorage.setItem("usuario", JSON.stringify(res.data));
        localStorage.setItem("isLoggedIn", "true");

        Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: "Inicio de sesión exitoso",
          confirmButtonColor: "#121824",
        });

        setTimeout(() => navigate("/dashboard"), 800);
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario o contraseña incorrectos",
        confirmButtonColor: "#121824",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario o contraseña incorrectos",
        confirmButtonColor: "#121824",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen">
     
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
         
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa tu usuario y contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-900"
                />
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="********"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white
                ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#121824] hover:bg-gray-800"
                }`}
            >
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>

   
      <div className="hidden lg:block lg:w-2/5">
        <div className="h-full bg-[#10141b] flex items-center justify-center">
          <img
            src="/fondo3.png"
            alt="Gym Logo"
            className="w-full max-w-2xl object-contain px-12"
          />
        </div>
      </div>
    </section>
  );
}

export default Login;
