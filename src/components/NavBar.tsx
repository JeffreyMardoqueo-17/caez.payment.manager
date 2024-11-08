// components/NavBar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaBars, FaHome, FaInfoCircle, FaUser, FaTimes } from "react-icons/fa";
import Cookies from "js-cookie";

interface User {
    name: string;
    lastName: string;
    id: number;
}

const NavBar: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedUser = Cookies.get("user");
        if (storedUser) {
            setUser(JSON.parse(decodeURIComponent(storedUser)));
        }
    }, []);

    if (pathname === "/") return null;

    const navItems = [
        { label: "Home", icon: <FaHome />, path: "/home" },
        { label: "About", icon: <FaInfoCircle />, path: "/about" },
        { label: "Profile", icon: <FaUser />, path: "/profile" },
    ];

    const handleNavigation = (path: string) => {
        setSidebarOpen(false);
        router.push(path);
    };

    const handleLogout = async () => {
        const token = Cookies.get("token");
        if (token) {
            await fetch("http://localhost:9000/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            Cookies.remove("token");
            Cookies.remove("user");
            setUser(null);
            setSidebarOpen(false); // Asegúrate de cerrar el sidebar

            setTimeout(() => {
                router.push("/");
            }, 100);
        }
    };

    return (
        <div className="relative">
            <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Mi Aplicación</h1>
                {user ? (
                    <p className="text-sm mr-4">Hola, {user.name} {user.lastName}</p>
                ) : (
                    <p className="text-sm mr-4">Cargando...</p>
                )}
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white">
                    <FaBars size={24} />
                </button>
                <div className="hidden lg:flex space-x-6">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(item.path)}
                            className="hover:text-gray-400 flex items-center"
                        >
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                        </button>
                    ))}
                    <button onClick={handleLogout} className="hover:text-gray-400 flex items-center">
                        Cerrar sesión
                    </button>
                </div>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 lg:hidden">
                    <div className="w-64 bg-gray-900 h-full shadow-xl p-4 space-y-4">
                        <button onClick={() => setSidebarOpen(false)} className="text-white mb-4">
                            <FaTimes size={24} />
                        </button>
                        <nav className="flex flex-col space-y-4">
                            {navItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleNavigation(item.path)}
                                    className="text-white hover:bg-gray-700 py-2 px-4 rounded flex items-center"
                                >
                                    {item.icon}
                                    <span className="ml-2">{item.label}</span>
                                </button>
                            ))}
                            <button onClick={handleLogout} className="text-white hover:bg-gray-700 py-2 px-4 rounded flex items-center">
                                Cerrar sesión
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavBar;
