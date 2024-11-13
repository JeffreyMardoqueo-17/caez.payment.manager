"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaCaretDown, FaBell, FaBars } from "react-icons/fa";
import Cookies from "js-cookie";

interface User {
    id: number;
    name: string;
    lastName: string;
}

const NavBar: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    // Oculta NavBar en la página de login ("/")
    if (pathname === "/") return null;

    // Cargar usuario de cookies
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

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        setUser(null);
        router.push("/");
    };

    return (
        <div className="bg-white shadow-sm py-4 px-6 flex justify-between items-center border-b">
            <button
                onClick={onSidebarToggle}
                className="lg:hidden text-gray-600 focus:outline-none"
            >
                <FaBars size={24} />
            </button>
            <h1 className="text-xl font-semibold hidden lg:block">Dashboard</h1>
            <div className="flex items-center space-x-4">
                <FaBell className="text-gray-500 cursor-pointer" />
                {user && (
                    <div className="relative">
                        <button
                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                            className="text-gray-700 font-medium flex items-center"
                        >
                            {user.name} {user.lastName} <FaCaretDown className="ml-2" />
                        </button>
                        {showUserDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                                <button
                                    onClick={() => router.push("/profile")}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Mi perfil
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavBar;
