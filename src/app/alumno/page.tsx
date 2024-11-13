"use client";
import React, { useEffect, useState } from 'react';
import TableList from '@/components/Tables/TableList';
import Loader from '@/components/Loader';
import Modal from '@/components/modals/Modal';
import DeleteModal from '@/components/modals/DeleteModal';
import CreateAlumnoForm from '@/components/Alumno/CreateAlumnoForm';
// import EditAlumnoForm from '@/components/Alumno/EditAlumnoForm';
import MostrarInfo from '@/components/MostrarInfo';
import { getAlumnos, updateAlumno, deleteAlumno } from '@/services/AlumnoService';
import { AlumnoGet, AlumnoPost } from '@/interfaces/Alumno';
import { formatDate } from '@/utils/formatDate';

const AlumnoListPage = () => {
    const [alumnos, setAlumnos] = useState<Array<AlumnoGet>>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAlumno, setSelectedAlumno] = useState<AlumnoGet | null>(null);
    const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | null>(null);

    const headers = ["Nombre", "Apellido", "Sexo", "Grado", "Fecha de Registro"];

    const fetchAlumnos = async () => {
        setLoading(true);
        try {
            const data: AlumnoGet[] = await getAlumnos();
            setAlumnos(data);
        } catch (error) {
            console.error('Error fetching alumnos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumnos();
    }, []);

    const handleActionClick = (row: Partial<AlumnoGet>, action: string) => {
        const fullAlumno = alumnos.find(a => a.id === row.id) as AlumnoGet;
        setSelectedAlumno(fullAlumno);

        if (action === 'view') {
            setModalType('view');
        } else if (action === 'edit') {
            setModalType('edit');
        } else if (action === 'delete') {
            setModalType('delete');
        }
    };

    const handleUpdateAlumno = async (updatedData: Partial<AlumnoPost>) => {
        if (selectedAlumno) {
            try {
                await updateAlumno(selectedAlumno.id, updatedData);
                alert("Alumno actualizado exitosamente");
                fetchAlumnos();
                setModalType(null);
                setSelectedAlumno(null);
            } catch (error) {
                console.error("Error actualizando el alumno:", error);
            }
        }
    };

    const handleDeleteAlumno = async () => {
        if (selectedAlumno) {
            try {
                await deleteAlumno(selectedAlumno.id);
                fetchAlumnos();
                setModalType(null);
                setSelectedAlumno(null);
            } catch (error) {
                console.error("Error al eliminar el alumno:", error);
            }
        }
    };

    const closeCreateModal = () => setIsCreateModalOpen(false);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Alumnos</h1>

            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Crear Nuevo Alumno
            </button>

            <button
                onClick={fetchAlumnos}
                className="mb-4 px-4 py-2 ml-4 bg-gray-600 text-white rounded"
            >
                Refrescar
            </button>

            {loading ? (
                <Loader />
            ) : (
                <TableList
                    headers={headers}
                    data={alumnos.map(({ id, Nombre, Apellido, Sexo, Grado, RegistrationDate }) => ({
                        id,
                        Nombre,
                        Apellido,
                        Sexo,
                        Grado,
                        "Fecha de Registro": formatDate(RegistrationDate)
                    }))}
                    onActionClick={handleActionClick}
                    initialRowsPerPage={10}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                />
            )}

            {/* Modal de creación de alumno */}
            <Modal
                isOpen={isCreateModalOpen}
                title="Crear Nuevo Alumno"
                onClose={closeCreateModal}
            >
                <CreateAlumnoForm
                    onCreateSuccess={() => {
                        fetchAlumnos();
                        closeCreateModal();
                    }}
                />
            </Modal>

            {/* Modal para ver o editar detalles del alumno */}
            {selectedAlumno && modalType === 'view' && (
                <Modal
                    isOpen={true}
                    title="Detalles del Alumno"
                    onClose={() => {
                        setSelectedAlumno(null);
                        setModalType(null);
                    }}
                >
                    <MostrarInfo data={selectedAlumno} />
                </Modal>
            )}

            {/* Modal para editar el alumno */}
            {selectedAlumno && modalType === 'edit' && (
                <h1>Hola editado</h1>
            )}

            {/* Modal de confirmación de eliminación */}
            {selectedAlumno && modalType === 'delete' && (
                <DeleteModal
                    isOpen={true}
                    title="Eliminar Alumno"
                    message={`¿Estás seguro de que deseas eliminar al alumno "${selectedAlumno.Nombre}"? Esta acción no se puede deshacer.`}
                    onClose={() => setModalType(null)}
                    onConfirm={handleDeleteAlumno}
                />
            )}
        </div>
    );
};

export default AlumnoListPage;
