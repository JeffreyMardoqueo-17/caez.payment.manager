"use client";
import React, { useState, useEffect } from 'react';
import { getAllAuditoria, getAuditoriaByDateRange } from '@/services/AuditoriaServivce';
import { AuditoriaEncargado } from '@/interfaces/AuditoriaEncargado';

const AuditoriaEncargadoList: React.FC = () => {
    const [auditoria, setAuditoria] = useState<AuditoriaEncargado[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar todos los registros de auditoría al cargar el componente
    useEffect(() => {
        fetchAllAuditoria();
    }, []);

    // Obtener todos los registros de auditoría
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

    // Filtrar registros de auditoría por rango de fechas
    const handleFilterByDate = async () => {
        if (!startDate || !endDate) {
            setError("Por favor, selecciona ambas fechas.");
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Auditoría de Encargados</h1>

            {/* Filtros por fechas */}
            <div className="flex space-x-4 mb-4">
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
                <button
                    onClick={handleFilterByDate}
                    className="bg-blue-600 text-white rounded px-4 py-2 mt-6"
                >
                    Filtrar
                </button>
                <button
                    onClick={fetchAllAuditoria}
                    className="bg-gray-600 text-white rounded px-4 py-2 mt-6"
                >
                    Ver Todos
                </button>
            </div>

            {/* Mensaje de error */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Cargando datos */}
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="min-w-full border">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Fecha y Hora</th>
                            <th className="px-4 py-2 border">ID Usuario</th>
                            <th className="px-4 py-2 border">Operación</th>
                            <th className="px-4 py-2 border">ID Registro</th>
                            <th className="px-4 py-2 border">Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditoria.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4">No hay registros</td>
                            </tr>
                        ) : (
                            auditoria.map((item) => (
                                <tr key={item.Id}>
                                    <td className="border px-4 py-2">{new Date(item.FechaHora).toLocaleString()}</td>
                                    <td className="border px-4 py-2">{item.IdUsuario}</td>
                                    <td className="border px-4 py-2">{item.Operacion}</td>
                                    <td className="border px-4 py-2">{item.IdRegistro}</td>
                                    <td className="border px-4 py-2">{item.Detalles}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AuditoriaEncargadoList;
