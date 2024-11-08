// src/app/home/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
    id: number;
    name: string;
    lastName: string;
}

const HomePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Obtener la información del usuario desde las cookies
        const storedUser = Cookies.get("user");
        const token = Cookies.get("token");

        if (!token || !storedUser) {
            // Si no hay token o usuario, redirigir a la página de inicio de sesión
            router.push("/");
        } else {
            setUser(JSON.parse(decodeURIComponent(storedUser)));
        }
    }, [router]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Bienvenido, {user?.name} {user?.lastName}!</h1>
            <p>Esta es la página de inicio protegida.</p>
        </div>
    );
};

export default HomePage;
