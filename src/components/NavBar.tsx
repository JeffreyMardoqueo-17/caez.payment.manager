// components/NavBar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaBars, FaHome, FaInfoCircle, FaUser, FaCaretDown, FaTimes } from "react-icons/fa";
import Cookies from "js-cookie";

// Interfaz para los usuarios
interface User {
    Id: number;
    Name: string;
    LastName: string;
    Login: string;
    RoleName: string;
}

const NavBar: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Cargar el usuario logueado desde las cookies
    const loadLoggedInUser = () => {
        const storedUser = Cookies.get("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(decodeURIComponent(storedUser));
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user from cookies:", error);
            }
        }
    };

    useEffect(() => {
        loadLoggedInUser();

        // Obtener la lista de todos los usuarios desde el backend
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:9000/users");
                if (response.ok) {
                    const usersData = await response.json();
                    setAllUsers(usersData);
                }
            } catch (error) {
                console.error("Error al cargar la lista de usuarios:", error);
            }
        };

        fetchUsers();
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
            setSidebarOpen(false);

            setTimeout(() => {
                router.push("/");
            }, 100);
        }
    };

    // Cambiar de usuario y redirigir al login para re-autenticación
    const handleUserChange = async (selectedUser: User) => {
        Cookies.remove("token"); // Remover token para obligar re-login
        Cookies.remove("user"); // Remover el usuario actual de las cookies
        setUser(null); // Limpiar el usuario actual del estado
        setShowUserDropdown(false); // Cerrar el menú desplegable

        // Guardar el nuevo usuario en cookies para mostrarlo en el NavBar
        Cookies.set("user", encodeURIComponent(JSON.stringify(selectedUser)), { expires: 1 });

        // Redirigir al login y después cargar el usuario actualizado
        router.push("/");
    };

    return (
        <div className="relative">
            <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Mi Aplicación</h1>

                {/* Ítems de navegación */}
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
                </div>

                {/* Usuario en la esquina derecha */}
                <div className="flex items-center space-x-4 ml-auto">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                className="text-sm flex items-center hover:text-gray-400"
                            >
                                {user.Name} {user.LastName} <FaCaretDown className="ml-2" />
                            </button>
                            {showUserDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-blue-900 text-white shadow-lg rounded-lg p-2 z-50">
                                    {allUsers.map((u) => (
                                        <button
                                            key={u.Id}
                                            onClick={() => handleUserChange(u)}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                                        >
                                            {u.Name} {u.LastName}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm">Cargando...</p>
                    )}
                </div>

                {/* Botón de menú móvil */}
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white">
                    <FaBars size={24} />
                </button>
            </div>

            {/* Sidebar para versión móvil */}
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
