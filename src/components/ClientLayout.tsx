"use client";

import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
    children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Oculta NavBar y Sidebar en la página de login (ruta "/")
    const isLoginRoute = pathname === "/";

    return (
        <div className="flex h-screen">
            {!isLoginRoute && (
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            )}
            <div className="flex-1 flex flex-col bg-background">
                {!isLoginRoute && <NavBar onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ClientLayout;
