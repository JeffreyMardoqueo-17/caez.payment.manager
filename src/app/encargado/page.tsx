"use client";
import React, { useEffect, useState } from 'react';
import TableList from '@/components/Tables/TableList';
import Loader from '@/components/Loader';
import Modal from '@/components/modals/Modal';
import DeleteModal from '@/components/modals/DeleteModal';
// import CreateEncargadoForm from '@/components/encargado/CreateEncargadoForm';
import CreateEncargadoForm from '@/components/encargado/CreateEncargadoFrom';
import EditEncargadoForm from '@/components/encargado/EditEncargadoForm';
import MostrarInfo from '@/components/MostrarInfo';
import { getEncargados, updateEncargado, deleteEncargado } from '@/services/EncargadoService';
import { Encargado, EncargadoCreate } from '@/interfaces/Encargado';
import { formatDate } from '@/utils/formatDate';

const EncargadoListPage = () => {
    const [encargados, setEncargados] = useState<Array<Encargado>>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedEncargado, setSelectedEncargado] = useState<Encargado | null>(null);
    const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | null>(null);

    const headers = ["Nombre", "Apellido", "Correo", "Fecha de Registro"];

    const fetchEncargados = async () => {
        setLoading(true);
        try {
            const data: Encargado[] = await getEncargados();
            setEncargados(data);
        } catch (error) {
            console.error('Error fetching encargados:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEncargados();
    }, []);

    const handleActionClick = (row: Partial<Encargado>, action: string) => {
        const fullEncargado = encargados.find(e => e.Id === row.Id) as Encargado;
        setSelectedEncargado(fullEncargado);

        if (action === 'view') {
            setModalType('view');
        } else if (action === 'edit') {
            setModalType('edit');
        } else if (action === 'delete') {
            setModalType('delete');
        }
    };

    const handleUpdateEncargado = async (updatedData: Partial<EncargadoCreate>) => {
        if (selectedEncargado) {
            try {
                await updateEncargado(selectedEncargado.Id, updatedData);
                alert("Encargado actualizado exitosamente");
                fetchEncargados();
                setModalType(null); // Cierra el modal de edición
                setSelectedEncargado(null); // Limpia el encargado seleccionado
            } catch (error) {
                console.error("Error actualizando el encargado:", error);
            }
        }
    };

    const handleDeleteEncargado = async () => {
        if (selectedEncargado) {
            try {
                await deleteEncargado(selectedEncargado.Id);
                // alert(`Encargado ${selectedEncargado.Nombre} eliminado exitosamente`);
                fetchEncargados();
                setModalType(null);
                setSelectedEncargado(null);
            } catch (error) {
                console.error("Error al eliminar el encargado:", error);
            }
        }
    };

    const closeCreateModal = () => setIsCreateModalOpen(false);

    return (
        <div className="mx-auto p-1">
            <h1 className="text-2xl font-bold mb-4">Lista de Encargados</h1>

            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Crear Nuevo Encargado
            </button>

            <button
                onClick={fetchEncargados}
                className="mb-4 px-4 py-2 ml-4 bg-gray-600 text-white rounded"
            >
                Refrescar
            </button>

            {loading ? (
                <Loader />
            ) : (
                <TableList
                    headers={headers}
                    data={encargados.map(({ Id, Nombre, Apellido, Correo, RegistrationDate }) => ({
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

            {/* Modal de creación de encargado */}
            <Modal
                isOpen={isCreateModalOpen}
                title="Crear Nuevo Encargado"
                onClose={closeCreateModal}
            >
                <CreateEncargadoForm
                    onCreateSuccess={() => {
                        fetchEncargados();
                        closeCreateModal();
                    }}
                />
            </Modal>

            {/* Modal para ver o editar detalles del encargado */}
            {selectedEncargado && modalType === 'view' && (
                <Modal
                    isOpen={true}
                    title="Detalles del Encargado"
                    onClose={() => {
                        setSelectedEncargado(null);
                        setModalType(null);
                    }}
                >
                    <MostrarInfo data={selectedEncargado} />
                </Modal>
            )}

            {/* Modal para editar el encargado */}
            {selectedEncargado && modalType === 'edit' && (
                <Modal
                    isOpen={true}
                    title="Editar Encargado"
                    onClose={() => {
                        setSelectedEncargado(null);
                        setModalType(null);
                    }}
                >
                    <EditEncargadoForm
                        encargado={{
                            Id: selectedEncargado.Id,
                            Nombre: selectedEncargado.Nombre,
                            Apellido: selectedEncargado.Apellido,
                            Telefono: selectedEncargado.Telefono,
                            Correo: selectedEncargado.Correo,
                            IdDireccion: 1, // Asignar el valor adecuado
                            IdParentezco: 1, // Asignar el valor adecuado
                            IdTipoDocumento: 1, // Asignar el valor adecuado
                            NumDocumento: selectedEncargado.NumDocumento,
                            IdRole: 3 // Valor fijo para "Encargado"
                        }}
                        onSaveSuccess={() => {
                            fetchEncargados();
                            setSelectedEncargado(null);
                            setModalType(null);
                        }}
                        onCancel={() => {
                            setSelectedEncargado(null);
                            setModalType(null);
                        }}
                    />
                </Modal>
            )}

            {/* Modal de confirmación de eliminación */}
            {selectedEncargado && modalType === 'delete' && (
                <DeleteModal
                    isOpen={true}
                    title="Eliminar Encargado"
                    message={`¿Estás seguro de que deseas eliminar al encargado "${selectedEncargado.Nombre}"? Esta acción no se puede deshacer.`}
                    onClose={() => setModalType(null)}
                    onConfirm={handleDeleteEncargado}
                />
            )}
        </div>
    );
};

export default EncargadoListPage;
