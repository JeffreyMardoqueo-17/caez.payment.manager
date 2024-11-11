// src/app/padrino/PadrinoListPage.tsx
"use client";
import React, { useEffect, useState } from 'react';
import TableList from '@/components/TableList';
import Loader from '@/components/Loader';
import Modal from '@/components/modals/Modal';
import DeleteModal from '@/components/modals/DeleteModal';
import CreatePadrinoForm from '@/components/Padrino/CreatePadrinoForm';
import EditPadrinoForm from '@/components/Padrino/EditPadrinoForm';
import MostrarInfo from '@/components/Tables/MostrarInfo';
import { getPadrinos, updatePadrino, deletePadrino } from '@/services/padrinoService';
import { Padrino, PadrinoCreate } from '@/interfaces/Padrino';
import { formatDate } from '@/utils/formatDate';

const PadrinoListPage = () => {
    const [padrinos, setPadrinos] = useState<Array<Padrino>>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedPadrino, setSelectedPadrino] = useState<(Padrino & { IdRole: number }) | null>(null);
    const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | null>(null);

    const headers = ["Nombre", "Apellido", "Correo", "Fecha de Registro"];

    const fetchPadrinos = async () => {
        setLoading(true);
        try {
            const data: Padrino[] = await getPadrinos();
            setPadrinos(data);
        } catch (error) {
            console.error('Error fetching padrinos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPadrinos();
    }, []);

    const handleActionClick = (row: Partial<Padrino>, action: string) => {
        const fullPadrino = padrinos.find(p => p.Id === row.Id) as Padrino & { IdRole: number };
        setSelectedPadrino(fullPadrino);

        if (action === 'view') {
            setModalType('view');
        } else if (action === 'edit') {
            setModalType('edit');
        } else if (action === 'delete') {
            setModalType('delete');
        }
    };

    const handleUpdatePadrino = async (updatedData: Partial<PadrinoCreate>) => {
        if (selectedPadrino) {
            try {
                await updatePadrino(selectedPadrino.Id, updatedData);
                alert("Padrino actualizado exitosamente");
                fetchPadrinos();
                setModalType(null); // Cierra el modal de edición
                setSelectedPadrino(null); // Limpia el padrino seleccionado
            } catch (error) {
                console.error("Error actualizando el padrino:", error);
            }
        }
    };

    const handleDeletePadrino = async () => {
        if (selectedPadrino) {
            try {
                await deletePadrino(selectedPadrino.Id);
                alert(`Padrino ${selectedPadrino.Nombre} eliminado exitosamente`);
                fetchPadrinos();
                setModalType(null);
                setSelectedPadrino(null);
            } catch (error) {
                console.error("Error al eliminar el padrino:", error);
            }
        }
    };

    const closeCreateModal = () => setIsCreateModalOpen(false);

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
                    data={padrinos.map(({ Id, Nombre, Apellido, Correo, RegistrationDate }) => ({
                        Id,
                        Nombre,
                        Apellido,
                        Correo,
                        "Fecha de Registro": formatDate(RegistrationDate)
                    }))}
                    onActionClick={handleActionClick}
                    initialRowsPerPage={10}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                />
            )}

            {/* Modal de creación de padrino */}
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

            {/* Modal para ver o editar detalles del padrino */}
            {selectedPadrino && modalType === 'view' && (
                <Modal
                    isOpen={true}
                    title="Detalles del Padrino"
                    onClose={() => {
                        setSelectedPadrino(null);
                        setModalType(null);
                    }}
                >
                    <MostrarInfo data={selectedPadrino} />
                </Modal>
            )}

            {/* Modal para editar el padrino */}
            {selectedPadrino && modalType === 'edit' && (
                <Modal
                    isOpen={true}
                    title="Editar Padrino"
                    onClose={() => {
                        setSelectedPadrino(null);
                        setModalType(null);
                    }}
                >
                    <EditPadrinoForm
                        padrino={selectedPadrino}
                        onSaveSuccess={() => {
                            fetchPadrinos();
                            setSelectedPadrino(null);
                            setModalType(null);
                        }}
                        onCancel={() => {
                            setSelectedPadrino(null);
                            setModalType(null);
                        }}
                    />
                </Modal>
            )}

            {/* Modal de confirmación de eliminación */}
            {selectedPadrino && modalType === 'delete' && (
                <DeleteModal
                    isOpen={true}
                    title="Eliminar Padrino"
                    message={`¿Estás seguro de que deseas eliminar al padrino "${selectedPadrino.Nombre}"? Esta acción no se puede deshacer.`}
                    onClose={() => setModalType(null)}
                    onConfirm={handleDeletePadrino}
                />
            )}
        </div>
    );
};

export default PadrinoListPage;
