"use client";

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginData {
  Login: string;
  Password: string;
}

const LoginPage: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({ Login: '', Password: '' });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: name === "Login" ? value.toLowerCase() : value // Convierte solo el campo "Login" a minúsculas
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:9000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg);
        return;
      }

      const data = await response.json();

      // Guardar el token y la información del usuario en las cookies
      Cookies.set('token', data.token, { expires: 1 });
      Cookies.set('user', encodeURIComponent(JSON.stringify(data.user)), { expires: 1 });

      // Redirigir al usuario a /home
      router.push('/home');
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setError("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl flex overflow-hidden">

        {/* Sección lateral con fondo degradado */}
        <div className="hidden md:flex w-1/2 bg-bgAzul flex-col justify-center items-center p-8">
          <Image
            src="/path/to/your/logo.png" // Reemplaza con la ruta de tu logo
            alt="Logo"
            width={100}
            height={100}
            className="mb-6"
          />
          <h2 className="text-white text-2xl font-semibold text-center">Bienvenido a Administración CAEZ</h2>
        </div>

        {/* Formulario de inicio de sesión */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-bgAzul text-center mb-6">Iniciar sesión</h2>

          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <div className="relative">
              <input
                type="email"
                name="Login"
                placeholder="Correo electrónico"
                value={loginData.Login}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-blue-700 focus:outline-none text-gray-700"
                required
                onContextMenu={(e) => e.preventDefault()} // Deshabilita inspección del campo
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Cambia entre 'text' y 'password' según el estado
                name="Password"
                placeholder="Contraseña"
                value={loginData.Password}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-blue-700 focus:outline-none text-gray-700"
                required
                onContextMenu={(e) => e.preventDefault()} // Deshabilita inspección del campo
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                tabIndex={-1} // Evita que el botón se seleccione al navegar con el tab
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-bgAzul text-white rounded-md font-semibold hover:bg-blue-950 transition-all duration-300"
            >
              Ingresar
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-blue-600 text-sm hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
