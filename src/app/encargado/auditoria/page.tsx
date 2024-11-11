"use client";

import React, { useState, useEffect } from 'react';
import { getAllAuditoria, getAuditoriaByDateRange } from '@/services/AuditoriaServivce';
import { AuditoriaEncargado, DetallesAuditoria } from '@/interfaces/AuditoriaEncargado';
import Modal from '@/components/modals/Modal';
import Swal from 'sweetalert2';

// Función para estilizar cada operación con colores diferentes
const getOperationStyle = (operation: string) => {
    switch (operation) {
        case 'INSERT':
            return "bg-green-100 text-green-800";
        case 'DELETE':
            return "bg-red-100 text-red-800";
        case 'UPDATE':
            return "bg-orange-100 text-orange-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const AuditoriaEncargadoList: React.FC = () => {
    const [auditoria, setAuditoria] = useState<AuditoriaEncargado[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedDetails, setSelectedDetails] = useState<DetallesAuditoria | { Antiguo: DetallesAuditoria; Nuevo: DetallesAuditoria } | null>(null);

    useEffect(() => {
        fetchAllAuditoria();
    }, []);

    const fetchAllAuditoria = async () => {
        setLoading(true);
        try {
            const data = await getAllAuditoria();
            setAuditoria(data);
            setError(null);
        } catch (error) {
            setError("Error al cargar los registros de auditoría.");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterByDate = async () => {
        if (!startDate || !endDate) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Por favor, selecciona ambas fechas.',
            });
            return;
        }
        setLoading(true);
        try {
            const data = await getAuditoriaByDateRange(startDate, endDate);
            setAuditoria(data);
            setError(null);
        } catch (error) {
            setError("Error al filtrar registros por fecha.");
        } finally {
            setLoading(false);
        }
    };

    const openModal = (detalles: DetallesAuditoria | { Antiguo: DetallesAuditoria; Nuevo: DetallesAuditoria }) => {
        setSelectedDetails(detalles);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDetails(null);
    };
    const renderFormattedDetails = (detalles: DetallesAuditoria | { Antiguo: DetallesAuditoria; Nuevo: DetallesAuditoria } | string) => {
        // Verificar si detalles es un string
        if (typeof detalles === 'string') {
            // Procesar el string de detalles y dividirlo por comas para obtener cada par clave-valor
            const detailsArray = detalles.split(", ").map((detail) => {
                const [key, value] = detail.split(": ");
                return { key, value };
            });

            // Renderizar la lista de detalles simples
            return (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {detailsArray.map(({ key, value }, index) => (
                        <li key={index}><strong>{key}:</strong> {value}</li>
                    ))}
                </ul>
            );
        }

        // Si detalles es un objeto con 'Antiguo' y 'Nuevo', formateamos la visualización para actualización
        if ('Antiguo' in detalles && 'Nuevo' in detalles) {
            const { Antiguo, Nuevo } = detalles;

            return (
                <div className="flex space-x-8">
                    <div className="w-1/2 bg-red-50 p-4 rounded shadow-md">
                        <h3 className="font-semibold text-lg text-red-700">Valores Antiguos</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {Object.entries(Antiguo).map(([key, value], index) => (
                                <li key={index}><strong>{key}:</strong> {value}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-1/2 bg-green-50 p-4 rounded shadow-md">
                        <h3 className="font-semibold text-lg text-green-700">Valores Nuevos</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {Object.entries(Nuevo).map(([key, value], index) => (
                                <li key={index}><strong>{key}:</strong> {value}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }

        // En caso de que sea un objeto de tipo DetallesAuditoria sin `Antiguo` y `Nuevo`
        return (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {Object.entries(detalles as DetallesAuditoria).map(([key, value], index) => (
                    <li key={index}><strong>{key}:</strong> {value}</li>
                ))}
            </ul>
        );
    };



    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Auditoría de Encargados</h1>

            <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                    <div>
                        <label className="block text-gray-700">Fecha de Inicio</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Fecha de Fin</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleFilterByDate}
                        className="bg-blue-600 text-white rounded px-4 py-2 mt-6 hover:bg-blue-700"
                    >
                        Filtrar
                    </button>
                    <button
                        onClick={fetchAllAuditoria}
                        className="bg-gray-600 text-white rounded px-4 py-2 mt-6 hover:bg-gray-700"
                    >
                        Ver Todos
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {loading ? (
                <p className="text-center">Cargando...</p>
            ) : (
                <table className="min-w-full bg-white border rounded-lg shadow-lg">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Fecha y Hora
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Operación
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Registro
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Detalles
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditoria.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-600">No hay registros</td>
                            </tr>
                        ) : (
                            auditoria.map((item) => (
                                <tr key={item.Id} className="hover:bg-gray-100">
                                    <td className="border-t px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {new Date(item.FechaHora).toLocaleString()}
                                    </td>
                                    <td className="border-t px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.UsuarioNombre}
                                    </td>
                                    <td className={`border-t px-6 py-4 whitespace-nowrap text-sm font-semibold ${getOperationStyle(item.Operacion)}`}>
                                        {item.Operacion}
                                    </td>
                                    <td className="border-t px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.IdRegistro}
                                    </td>
                                    <td className="border-t px-6 py-4 whitespace-pre-line text-sm text-gray-700">
                                        <button
                                            onClick={() => openModal(item.Detalles)}
                                            className="text-blue-500 underline"
                                        >
                                            Ver más
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {isModalOpen && selectedDetails && (
                <Modal
                    isOpen={isModalOpen}
                    title="Detalles completos"
                    onClose={closeModal}
                >
                    {renderFormattedDetails(selectedDetails)}
                </Modal>
            )}
        </div>
    );
};

export default AuditoriaEncargadoList;
