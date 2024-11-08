// src/app/page.tsx
"use client";

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface LoginData {
  Login: string;
  Password: string;
}

const LoginPage: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({ Login: '', Password: '' });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input
          type="text"
          name="Login"
          placeholder="Correo electrónico"
          value={loginData.Login}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="Password"
          placeholder="Contraseña"
          value={loginData.Password}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
