"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaCaretDown, FaBell, FaBars, FaSun, FaMoon } from "react-icons/fa";
import Cookies from "js-cookie";

interface User {
    id: number;
    name: string;
    lastName: string;
}

const NavBar: React.FC<{
    onSidebarToggle: () => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
}> = ({ onSidebarToggle, isDarkMode, toggleTheme }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    // Oculta NavBar en la página de login ("/")
    if (pathname === "/") return null;

    // Cargar usuario de cookies
    useEffect(() => {
        const storedUser = Cookies.get("user");
        const token = Cookies.get("token");

        if (!token || !storedUser) {
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
        <div className="bg-white dark:bg-bagroundDark shadow-sm py-4 px-6 flex justify-between items-center border-b dark:border-borderDark">
            <button
                onClick={onSidebarToggle}
                className="lg:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
            >
                <FaBars size={24} />
            </button>
            <h1 className="text-xl font-semibold hidden lg:block text-gray-800 dark:text-white">
                Dashboard
            </h1>
            <div className="flex items-center space-x-4">
                <FaBell className="text-gray-500 dark:text-gray-300 cursor-pointer" />
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                    {isDarkMode ? <FaSun /> : <FaMoon />}
                </button>
                {user && (
                    <div className="relative">
                        <button
                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                            className="text-gray-700 dark:text-white font-medium flex items-center"
                        >
                            {user.name} {user.lastName} <FaCaretDown className="ml-2" />
                        </button>
                        {showUserDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg">
                                <button
                                    onClick={() => router.push("/profile")}
                                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Mi perfil
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
