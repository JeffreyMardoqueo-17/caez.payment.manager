"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { createEncargado } from '@/services/EncargadoService';
import { getDirecciones } from '@/services/DireccionService';
import { getRoles } from '@/services/roleService';
import { getParentezcos } from '@/services/ParentezcoService';
import { getTipoDocumento } from '@/services/TipoDocumentoService';
import { EncargadoCreate } from '@/interfaces/Encargado';
import { Direccion } from '@/interfaces/Direccion';
import { Role } from '@/interfaces/Role';
import { Parentezco } from '@/interfaces/Parentezco';
import { TipoDocumento } from '@/interfaces/TipoDocumento';

interface CreateEncargadoFormProps {
    onCreateSuccess: () => void;
}

const CreateEncargadoForm: React.FC<CreateEncargadoFormProps> = ({ onCreateSuccess }) => {
    const [encargadoData, setEncargadoData] = useState<EncargadoCreate>({
        Nombre: '',
        Apellido: '',
        Telefono: '',
        Correo: '',
        IdDireccion: 1,
        IdRole: 3, // Valor por defecto para "Encargado"
        IdParentezco: 1,
        IdTipoDocumento: 1,
        NumDocumento: ''
    });
    const [adminName, setAdminName] = useState<string>('');
    const [adminLastName, setAdminLastName] = useState<string>('');
    const [error, setError] = useState<string | null>(null); // Estado para el mensaje de error

    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [parentezcos, setParentezcos] = useState<Parentezco[]>([]);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);

    // Función para eliminar caracteres especiales
    const sanitizeText = (text: string): string =>
        text
            .normalize("NFD") // Normaliza a forma de descomposición Unicode (NFD)
            .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos (acentos)
            .replace(/[^a-zA-Z0-9\s]/g, ""); // Elimina cualquier carácter que no sea letra, número o espacio

    useEffect(() => {
        const storedUser = Cookies.get("user");
        if (storedUser) {
            const user = JSON.parse(decodeURIComponent(storedUser));
            setAdminName(user.name);
            setAdminLastName(user.lastName);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [direccionesData, rolesData, parentezcosData, tiposDocumentoData] = await Promise.all([
                    getDirecciones(),
                    getRoles(),
                    getParentezcos(),
                    getTipoDocumento()
                ]);
                setDirecciones(direccionesData);
                setRoles(rolesData);
                setParentezcos(parentezcosData);
                setTiposDocumento(tiposDocumentoData);
            } catch (error) {
                console.error("Error fetching select data:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Aplica sanitizeText solo a ciertos campos
        const sanitizedValue =
            name === 'Nombre' || name === 'Apellido' || name === 'NumDocumento'
                ? sanitizeText(value)
                : value;

        setEncargadoData({ ...encargadoData, [name]: sanitizedValue });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Limpiar el error antes de intentar crear el encargado

        try {
            await createEncargado(encargadoData);
            setEncargadoData({
                Nombre: '',
                Apellido: '',
                Telefono: '',
                Correo: '',
                IdDireccion: 1,
                IdRole: 3,
                IdParentezco: 1,
                IdTipoDocumento: 1,
                NumDocumento: ''
            });
            onCreateSuccess();
        } catch (error: any) {
            // Aquí mostramos el mensaje de error si ocurre algún problema
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="Nombre"
                        value={encargadoData.Nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Apellido</label>
                    <input
                        type="text"
                        name="Apellido"
                        value={encargadoData.Apellido}
                        onChange={handleChange}
                        placeholder="Apellido"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Teléfono</label>
                    <input
                        type="text"
                        name="Telefono"
                        value={encargadoData.Telefono}
                        onChange={handleChange}
                        placeholder="Teléfono"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Correo</label>
                    <input
                        type="email"
                        name="Correo"
                        value={encargadoData.Correo}
                        onChange={handleChange}
                        placeholder="Correo"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Dirección</label>
                    <select
                        name="IdDireccion"
                        value={encargadoData.IdDireccion}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        {direcciones.map((direccion) => (
                            <option key={direccion.Id} value={direccion.Id}>
                                {direccion.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Parentezco</label>
                    <select
                        name="IdParentezco"
                        value={encargadoData.IdParentezco}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        {parentezcos.map((parentezco) => (
                            <option key={parentezco.Id} value={parentezco.Id}>
                                {parentezco.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Tipo de Documento</label>
                    <select
                        name="IdTipoDocumento"
                        value={encargadoData.IdTipoDocumento}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        {tiposDocumento.map((tipo) => (
                            <option key={tipo.Id} value={tipo.Id}>
                                {tipo.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Número de Documento</label>
                    <input
                        type="text"
                        name="NumDocumento"
                        value={encargadoData.NumDocumento}
                        onChange={handleChange}
                        placeholder="Número de Documento"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-gray-700">Nombre del Administrador</label>
                <input
                    type="text"
                    value={`${adminName} ${adminLastName}`}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
            </div>

            {/* Mostrar el error si existe */}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            <button type="submit" className="w-full bg-bgAzul text-white py-2 rounded-xl mt-6">
                Crear Encargado
            </button>
        </form>
    );
};

export default CreateEncargadoForm;
