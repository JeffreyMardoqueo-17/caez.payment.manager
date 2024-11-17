"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaChartPie, FaUsers, FaCog, FaChevronDown, FaChevronUp, FaFileAlt } from "react-icons/fa";

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const router = useRouter();

    // Ocultar Sidebar en la página de login ("/")
    if (pathname === "/") return null;

    const menuItems = [
        {
            label: "alumno",
            icon: <FaChartPie />,
            path: "/alumno",
            subItems: [{ label: "auditoria", icon: <FaFileAlt />, path: "/alumno/auditoria" }],
        },
        {
            label: "encargado",
            icon: <FaCog />,
            path: "/encargado",
            subItems: [{ label: "auditoria", icon: <FaFileAlt />, path: "/encargado/auditoria" }],
        },
        {
            label: "padrinos",
            icon: <FaUsers />,
            path: "/padrino",
            subItems: [{ label: "auditoria", icon: <FaFileAlt />, path: "/padrino/auditoria" }],
        },
        {
            label: "pagos",
            icon: <FaUsers />,
            path: "/pagos",
            subItems: [],
        },
        {
            label: "auditorias",
            icon: <FaCog />,
            path: "/auditorias",
            subItems: [
                { label: "alumno", icon: <FaFileAlt />, path: "/auditorias/alumno" },
                { label: "encargado", icon: <FaFileAlt />, path: "/auditorias/encargado" },
                { label: "padrinos", icon: <FaFileAlt />, path: "/auditorias/padrinos" },
                { label: "pagos", icon: <FaFileAlt />, path: "/auditorias/pagos" },
            ],
        },
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
        onClose(); // Cierra el sidebar en móviles al navegar
    };

    const isActive = (path: string) => pathname.startsWith(path);

    return (
        <>
            {/* Sidebar en dispositivos grandes */}
            <div className="hidden lg:flex w-64 bg-background dark:bg-bagroundDark border-r dark:border-borderDark h-full flex-col shadow-lg rounded-r-3xl">
                <h2 className="text-xl font-bold p-4">Mi Aplicación</h2>
                <nav className="flex-1 p-4 space-y-4">
                    {menuItems.map((item, index) => {
                        const [isExpanded, setIsExpanded] = useState(false);

                        return (
                            <div key={index}>
                                {/* Menú principal */}
                                <button
                                    onClick={() =>
                                        item.subItems.length > 0
                                            ? setIsExpanded(!isExpanded)
                                            : handleNavigation(item.path)
                                    }
                                    className={`flex items-center justify-between p-2 w-full text-left rounded-md transition-all duration-300 ${isActive(item.path)
                                        ? "bg-blue-100 dark:bg-hoverTableDark text-yellow-500 dark:text-yellow-400"
                                        : "text-gray-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-hoverTableDark"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span
                                            className={`text-lg ${isActive(item.path)
                                                ? "text-yellow-500 dark:text-yellow-400"
                                                : ""
                                                }`}
                                        >
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </div>
                                    {item.subItems.length > 0 && (
                                        <span>
                                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                        </span>
                                    )}
                                </button>
                                {/* Submenús */}
                                {isExpanded && (
                                    <div className="ml-6 mt-2 space-y-2 transition-all duration-300">
                                        {item.subItems.map((subItem, subIndex) => (
                                            <button
                                                key={subIndex}
                                                onClick={() => handleNavigation(subItem.path)}
                                                className={`flex items-center space-x-2 p-2 w-full text-left rounded-md transition-all duration-300 ${isActive(subItem.path)
                                                    ? "text-yellow-500 bg-blue-100 dark:text-yellow-400 dark:bg-hoverTableDark"
                                                    : "text-gray-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-hoverTableDark"
                                                    }`}
                                            >
                                                <span
                                                    className={`text-lg ${isActive(subItem.path)
                                                        ? "text-yellow-500 dark:text-yellow-400"
                                                        : ""
                                                        }`}
                                                >
                                                    {subItem.icon}
                                                </span>
                                                <span>{subItem.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Sidebar para dispositivos móviles */}
            {isOpen && (
                <div className="fixed inset-0 flex z-50 lg:hidden">
                    <div className="w-64 bg-white border-r shadow-lg h-full flex flex-col">
                        <h2 className="text-xl font-bold p-4">Mi Aplicación</h2>
                        <nav className="flex-1 p-4 space-y-4">
                            {menuItems.map((item, index) => {
                                const [isExpanded, setIsExpanded] = useState(false);

                                return (
                                    <div key={index}>
                                        {/* Menú principal */}
                                        <button
                                            onClick={() =>
                                                item.subItems.length > 0
                                                    ? setIsExpanded(!isExpanded)
                                                    : handleNavigation(item.path)
                                            }
                                            className={`flex items-center justify-between p-2 w-full text-left rounded-md transition-all duration-300 ${isActive(item.path)
                                                ? "bg-blue-100 text-yellow-500"
                                                : "text-gray-700 hover:bg-blue-100"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    className={`text-lg ${isActive(item.path)
                                                        ? "text-yellow-500"
                                                        : ""
                                                        }`}
                                                >
                                                    {item.icon}
                                                </span>
                                                <span>{item.label}</span>
                                            </div>
                                        </button>
                                        {/* Submenús */}
                                        {isExpanded && (
                                            <div className="ml-6 mt-2 space-y-2 transition-all duration-300">
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <button
                                                        key={subIndex}
                                                        onClick={() =>
                                                            handleNavigation(subItem.path)
                                                        }
                                                        className={`flex items-center space-x-2 p-2 w-full text-left rounded-md transition-all duration-300 ${isActive(subItem.path)
                                                            ? "text-yellow-500 bg-blue-100"
                                                            : "text-gray-700 hover:bg-blue-100"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`text-lg ${isActive(subItem.path)
                                                                ? "text-yellow-500"
                                                                : ""
                                                                }`}
                                                        >
                                                            {subItem.icon}
                                                        </span>
                                                        <span>{subItem.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
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
