// components/AuditoriaEncargadoList.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { getAllAuditoria, getAuditoriaByDateRange } from '@/services/AuditoriaServivce';
import { AuditoriaEncargado, DetallesAuditoria } from '@/interfaces/AuditoriaEncargado';
import TablaAuditoria from '@/components/Tables/TablaAuditoria';
import Modal from '@/components/modals/Modal';
import Swal from 'sweetalert2';
import Loader from '@/components/Loader';

const AuditoriaEncargadoList: React.FC = () => {
    const [auditoria, setAuditoria] = useState<AuditoriaEncargado[]>([]);
    const [startDate] = useState<string>('');
    const [endDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedDetails, setSelectedDetails] = useState<string | DetallesAuditoria | { Antiguo: DetallesAuditoria; Nuevo: DetallesAuditoria } | null>(null);

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
            setError("Error al cargar los registros de auditoría." + error);
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

    const openModal = (detalles: string | DetallesAuditoria | { Antiguo: DetallesAuditoria; Nuevo: DetallesAuditoria }) => {
        setSelectedDetails(detalles);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDetails(null);
    };

    const renderFormattedDetails = (detalles: string | DetallesAuditoria | { Antiguo: DetallesAuditoria; Nuevo: DetallesAuditoria }) => {
        if (typeof detalles === 'string') {
            return (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {detalles.split(", ").map((detail, index) => {
                        const [key, value] = detail.split(": ");
                        return <li key={index}><strong>{key}:</strong> {value}</li>;
                    })}
                </ul>
            );
        }

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

        return (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {Object.entries(detalles as DetallesAuditoria).map(([key, value], index) => (
                    <li key={index}><strong>{key}:</strong> {value}</li>
                ))}
            </ul>
        );
    };

    return (
        <div className="mx-auto p-1">
            <h1 className="text-3xl font-bold mb-1 text-center">Auditoría de Encargados</h1>
            {loading ? (
                <Loader />
            ) : (
                <TablaAuditoria
                    data={auditoria}
                    onOpenDetails={openModal}
                    onFilterByDate={handleFilterByDate}
                    onFetchAll={fetchAllAuditoria}
                />
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
