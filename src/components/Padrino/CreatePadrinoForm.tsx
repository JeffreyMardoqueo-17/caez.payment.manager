"use client";
import React, { useState, useEffect } from 'react';
import { createPadrino } from '@/services/padrinoService';
import { getRoles } from '@/services/roleService';
import { PadrinoCreate } from '@/interfaces/Padrino';
import { Role } from '@/interfaces/Role';

const CreatePadrinoForm: React.FC = () => {
    const [padrinoData, setPadrinoData] = useState<PadrinoCreate>({
        Nombre: '',
        Apellido: '',
        Telefono: '',
        Correo: '',
        IdRole: 4 // Por defecto, ID de "Padrino"
    });
    const [error, setError] = useState<string | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await getRoles();
                setRoles(rolesData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRoles();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPadrinoData({ ...padrinoData, [name]: value });
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
                IdRole: 4 // Reiniciamos el valor por defecto de "Padrino"
            });
        } catch (error) {
            setError("Error al crear el padrino");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Padrino</h2>

            <input
                type="text"
                name="Nombre"
                value={padrinoData.Nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                required
            />
            <input
                type="text"
                name="Apellido"
                value={padrinoData.Apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                required
            />
            <input
                type="text"
                name="Telefono"
                value={padrinoData.Telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                required
            />
            <input
                type="email"
                name="Correo"
                value={padrinoData.Correo}
                onChange={handleChange}
                placeholder="Correo"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                required
            />

            {/* Select para rol, solo muestra "Padrino" deshabilitado */}
            <select
                name="IdRole"
                value={padrinoData.IdRole}
                onChange={handleChange}
                className="w-full p-2 mb-2 border border-gray-300 rounded bg-gray-100"
                disabled
            >
                <option value={4}>Padrino</option>
            </select>

            {error && <p className="text-red-500">{error}</p>}

            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded">
                Crear Padrino
            </button>
        </form>
    );
};

export default CreatePadrinoForm;
