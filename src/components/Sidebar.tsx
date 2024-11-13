"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaChartPie, FaUsers, FaCog, FaSignOutAlt, FaTimes } from "react-icons/fa";

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const router = useRouter();

    // Ocultar Sidebar en la página de login ("/")
    if (pathname === "/") return null;

    const menuItems = [
        { label: "alumno", icon: <FaChartPie />, path: "/alumno" },
        { label: "padrino", icon: <FaUsers />, path: "/padrino" },
        { label: "encargado", icon: <FaCog />, path: "/encargado" },
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
        onClose(); // Cierra el sidebar en móviles al navegar
    };

    return (
        <>
            {/* Sidebar en dispositivos grandes */}
            <div className="hidden lg:flex w-64 bg-white border-r h-full flex-col shadow-lg">
                <h2 className="text-xl font-bold p-4">Mi Aplicación</h2>
                <nav className="flex-1 p-4 space-y-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(item.path)}
                            className="flex items-center space-x-2 p-2 w-full text-left text-gray-700 hover:bg-blue-100 rounded-md"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Sidebar para dispositivos móviles */}
            {isOpen && (
                <div className="fixed inset-0 flex z-50 lg:hidden">
                    <div className="w-64 bg-white border-r shadow-lg h-full flex flex-col">
                        <button onClick={onClose} className="p-4 text-gray-600 focus:outline-none">
                            <FaTimes size={24} />
                        </button>
                        <h2 className="text-xl font-bold p-4">Mi Aplicación</h2>
                        <nav className="flex-1 p-4 space-y-4">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleNavigation(item.path)}
                                    className="flex items-center space-x-2 p-2 w-full text-left text-gray-700 hover:bg-blue-100 rounded-md"
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                    {/* Overlay para cerrar el sidebar */}
                    <div onClick={onClose} className="flex-1 bg-black opacity-50"></div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
