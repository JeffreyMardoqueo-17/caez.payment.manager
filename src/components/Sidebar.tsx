// src/components/Sidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHome, FaChartPie, FaFolder, FaTasks, FaBell, FaUsers, FaCog, FaEnvelope } from "react-icons/fa";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle sidebar open state for mobile
    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white w-64 md:w-72 transition-width duration-300 ease-in-out fixed">
            {/* Logo and Toggle Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold">Untitled UI</h2>
                <button onClick={toggleSidebar} className="md:hidden">
                    <span className="text-xl">&#9776;</span> {/* Hamburger icon */}
                </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-md focus:outline-none"
                />
            </div>

            {/* Navigation Links */}
            <nav className={`flex-1 overflow-y-auto ${isOpen ? "block" : "hidden"} md:block`}>
                <ul className="space-y-2 px-6">
                    <li>
                        <Link href="/" className="flex items-center space-x-4 px-2 py-3 rounded hover:bg-gray-800">
                            <FaHome /> <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard" className="flex items-center space-x-4 px-2 py-3 rounded hover:bg-gray-800">
                            <FaChartPie /> <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/projects" className="flex items-center space-x-4 px-2 py-3 rounded hover:bg-gray-800">
                            <FaFolder /> <span>Projects</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/tasks" className="flex items-center space-x-4 px-2 py-3 rounded hover:bg-gray-800">
                            <FaTasks /> <span>Tasks</span>
                        </Link>
                    </li>
                    <li>
                        <button className="flex items-center space-x-4 w-full px-2 py-3 rounded hover:bg-gray-800">
                            <FaBell /> <span>Notifications</span>
                        </button>
                    </li>

                    {/* Submenu for Reporting */}
                    <li>
                        <button className="flex items-center space-x-4 w-full px-2 py-3 rounded hover:bg-gray-800">
                            <FaChartPie /> <span>Reporting</span>
                        </button>
                        <ul className="ml-8 space-y-2">
                            <li>
                                <Link href="/reporting/overview" className="block px-2 py-2 rounded hover:bg-gray-800">
                                    Overview
                                </Link>
                            </li>
                            <li>
                                <Link href="/reporting/notifications" className="block px-2 py-2 rounded hover:bg-gray-800">
                                    Notifications
                                </Link>
                            </li>
                            <li>
                                <Link href="/reporting/analytics" className="block px-2 py-2 rounded hover:bg-gray-800">
                                    Analytics
                                </Link>
                            </li>
                            <li>
                                <Link href="/reporting/reports" className="block px-2 py-2 rounded hover:bg-gray-800">
                                    Reports
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <Link href="/users" className="flex items-center space-x-4 px-2 py-3 rounded hover:bg-gray-800">
                            <FaUsers /> <span>Users</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Bottom Links */}
            <div className="border-t border-gray-700 p-4 space-y-2">
                <Link href="/notifications" className="flex items-center space-x-4 px-2 py-3 rounded hover:bg-gray-800">
                    <FaEnvelope /> <span>Notifications</span>
                </Link>
                <Link href="/support" className="flex items-center space-x-4 px-2 py-3 rounded hover:bg-gray-800">
                    <FaEnvelope /> <span>Support</span>
                </Link>
                <Link href="/settings" className="flex items-center space-x-4 px-2 py-3 rounded hover:bg-gray-800">
                    <FaCog /> <span>Settings</span>
                </Link>
            </div>
        </div>
    );
}
