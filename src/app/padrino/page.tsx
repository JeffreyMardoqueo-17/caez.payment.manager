// PadrinoListPage Component
"use client";
import React, { useEffect, useState } from 'react';
import TableList from '@/components/TableList';
import Loader from '@/components/Loader';
import Modal from '@/components/modals/Modal';
import CreatePadrinoForm from '@/components/Padrino/CreatePadrinoForm';
import { getPadrinos } from '@/services/padrinoService';
import { Padrino } from '@/interfaces/Padrino';

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
};

const PadrinoListPage = () => {
    const [padrinos, setPadrinos] = useState<Array<Partial<Padrino>>>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedPadrino, setSelectedPadrino] = useState<Padrino | null>(null);

    const headers = ["Nombre", "Apellido", "Correo", "Fecha de Registro"];

    const fetchPadrinos = async () => {
        setLoading(true);
        try {
            const data: Padrino[] = await getPadrinos();
            const transformedData = data.map(({ Nombre, Apellido, Correo, RegistrationDate }) => ({
                Nombre,
                Apellido,
                Correo,
                "Fecha de Registro": formatDate(RegistrationDate),
            }));
            setPadrinos(transformedData);
        } catch (error) {
            console.error('Error fetching padrinos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPadrinos();
    }, []);

    const handleActionClick = (row: Partial<Padrino>) => {
        const fullPadrino = padrinos.find(p => p.Nombre === row.Nombre && p.Apellido === row.Apellido) as Padrino;
        setSelectedPadrino(fullPadrino);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Padrinos</h1>

            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Crear Nuevo Padrino
            </button>

            <button
                onClick={fetchPadrinos}
                className="mb-4 px-4 py-2 ml-4 bg-gray-600 text-white rounded"
            >
                Refrescar
            </button>

            {loading ? (
                <Loader />
            ) : (
                <TableList
                    headers={headers}
                    data={padrinos}
                    onActionClick={handleActionClick}
                    initialRowsPerPage={10}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                />
            )}

            <Modal
                isOpen={isCreateModalOpen}
                title="Crear Nuevo Padrino"
                onClose={closeCreateModal}
            >
                <CreatePadrinoForm
                    onCreateSuccess={() => {
                        fetchPadrinos();
                        closeCreateModal();
                    }}
                />
            </Modal>

            {selectedPadrino && (
                <Modal
                    isOpen={!!selectedPadrino}
                    title="Detalles del Padrino"
                    onClose={() => setSelectedPadrino(null)}
                >
                    <div>
                        <p><strong>ID:</strong> {selectedPadrino.Id}</p>
                        <p><strong>Nombre:</strong> {selectedPadrino.Nombre}</p>
                        <p><strong>Apellido:</strong> {selectedPadrino.Apellido}</p>
                        <p><strong>Teléfono:</strong> {selectedPadrino.Telefono}</p>
                        <p><strong>Correo:</strong> {selectedPadrino.Correo}</p>
                        <p><strong>Rol:</strong> {selectedPadrino.RoleName}</p>
                        <p><strong>Admin Name:</strong> {selectedPadrino.AdminName}</p>
                        <p><strong>Admin Last Name:</strong> {selectedPadrino.AdminLastName}</p>
                        <p><strong>Fecha de Registro:</strong> {formatDate(selectedPadrino.RegistrationDate)}</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PadrinoListPage;
