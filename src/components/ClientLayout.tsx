"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
    children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isThemeLoaded, setIsThemeLoaded] = useState(false); // Nuevo estado
    const pathname = usePathname();

    const isLoginRoute = pathname === "/";

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || "light";
        if (storedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
        setIsThemeLoaded(true); // Marca el tema como cargado
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkMode ? "dark" : "light";
        setIsDarkMode(!isDarkMode);
        localStorage.setItem("theme", newTheme);
        (newTheme === "dark") ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");
    };

    if (!isThemeLoaded) return null; // Espera hasta que el tema esté cargado

    return (
        <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
            {!isLoginRoute && (
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            )}
            <div className="flex-1 flex flex-col bg-background dark:bg-bagroundDark">
                {!isLoginRoute && (
                    <NavBar
                        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                        isDarkMode={isDarkMode}
                        toggleTheme={toggleTheme}
                    />
                )}
                <main className="flex-1 overflow-y-auto p-6 dark:text-white">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ClientLayout;
