"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { createPadrino } from '@/services/padrinoService';
import { getRoles } from '@/services/roleService';
import { PadrinoCreate } from '@/interfaces/Padrino';
import { Role } from '@/interfaces/Role';

interface CreatePadrinoFormProps {
    onCreateSuccess: () => void; // Nueva prop para refrescar la tabla y cerrar el modal
}

const CreatePadrinoForm: React.FC<CreatePadrinoFormProps> = ({ onCreateSuccess }) => {
    const [padrinoData, setPadrinoData] = useState<PadrinoCreate>({
        Nombre: '',
        Apellido: '',
        Telefono: '',
        Correo: '',
        IdRole: 4 // Por defecto, ID de "Padrino"
    });
    const [adminName, setAdminName] = useState<string>('');
    const [adminLastName, setAdminLastName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        // Obtiene el nombre y apellido del administrador desde las cookies
        const storedUser = Cookies.get("user");
        if (storedUser) {
            const user = JSON.parse(decodeURIComponent(storedUser));
            setAdminName(user.name);
            setAdminLastName(user.lastName);
        }
    }, []);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await getRoles();
                setRoles(rolesData);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);

    // Función para eliminar tildes y caracteres especiales
    const removeSpecialChars = (text: string) =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g, "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const cleanedValue = name === 'Nombre' || name === 'Apellido' ? removeSpecialChars(value) : value;
        setPadrinoData({ ...padrinoData, [name]: cleanedValue });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPadrino(padrinoData);
            alert("Padrino creado exitosamente");
            setPadrinoData({
                Nombre: '',
                Apellido: '',
                Telefono: '',
                Correo: '',
                IdRole: 4
            });
            onCreateSuccess(); // Refresca la tabla y cierra el modal al crear el padrino
        } catch (error) {
            setError("Error al crear el padrino");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Padrino</h2>

            {/* Campos de solo lectura para el administrador logueado */}
            <div className="mb-4">
                <label className="block text-gray-700">Nombre del Administrador</label>
                <input
                    type="text"
                    value={adminName}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Apellido del Administrador</label>
                <input
                    type="text"
                    value={adminLastName}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
            </div>

            {/* Campos del formulario para crear un nuevo padrino */}
            <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                    type="text"
                    name="Nombre"
                    value={padrinoData.Nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Apellido</label>
                <input
                    type="text"
                    name="Apellido"
                    value={padrinoData.Apellido}
                    onChange={handleChange}
                    placeholder="Apellido"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input
                    type="text"
                    name="Telefono"
                    value={padrinoData.Telefono}
                    onChange={handleChange}
                    placeholder="Teléfono"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Correo</label>
                <input
                    type="email"
                    name="Correo"
                    value={padrinoData.Correo}
                    onChange={handleChange}
                    placeholder="Correo"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Rol</label>
                <select
                    name="IdRole"
                    value={padrinoData.IdRole}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                    disabled
                >
                    <option value={4}>Padrino</option>
                </select>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded">
                Crear Padrino
            </button>
        </form>
    );
};

export default CreatePadrinoForm;
