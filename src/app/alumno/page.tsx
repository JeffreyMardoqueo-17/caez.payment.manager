"use client";
import React, { useEffect, useState } from 'react';
import TableList from '@/components/Tables/TableList';
import Loader from '@/components/Loader';
import Modal from '@/components/modals/Modal';
import DeleteModal from '@/components/modals/DeleteModal';
import CreateAlumnoForm from '@/components/Alumno/CreateAlumnoForm';
import EditAlumnoForm from '@/components/Alumno/EditAlumnoForm';
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

    const headers = ["NIE", "Nombre", "Apellido", "Sexo", "Grado", "Fecha de Registro"];

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

    // Mapeo de AlumnoGet a AlumnoPost
    const mapAlumnoGetToPost = (alumno: AlumnoGet): AlumnoPost => {
        return {
            Nombre: alumno.Nombre,
            Apellido: alumno.Apellido,
            FechaNacimiento: alumno.FechaNacimiento,
            IdSexo: parseInt(alumno.Sexo) || 0, // Conversión para que coincida con el ID de sexo
            IdRole: 2, // Asignar siempre el rol de estudiante
            IdGrado: parseInt(alumno.Grado) || 0,
            IdTurno: 1, // Asumimos un valor de turno predeterminado, ajusta si es necesario
            IdEncargado: 1, // Id de un encargado predeterminado, cambia si tienes uno específico
            IdTipoDocumento: 2, // Tipo de documento predeterminado "NIE"
            NumDocumento: alumno.NumDocumento,
            EsBecado: alumno.EsBecado,
            IdPadrino: alumno.PadrinoNombre ? 1 : null, // Condición para asignar o no un padrino
        };
    };

    const handleActionClick = (row: Record<string, any>, action: 'view' | 'edit' | 'delete') => {
        const fullAlumno = alumnos.find(a => a.Id === row.Id);
        if (!fullAlumno) {
            console.error("No se encontró el alumno con ID:", row.Id);
            return;
        }

        setSelectedAlumno(fullAlumno);
        setModalType(action);
    };

    const handleUpdateAlumno = async (updatedData: Partial<AlumnoPost>) => {
        if (selectedAlumno) {
            try {
                await updateAlumno(selectedAlumno.Id, updatedData);
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
                await deleteAlumno(selectedAlumno.Id);
                fetchAlumnos();
                setModalType(null);
                setSelectedAlumno(null);
                alert("Alumno eliminado exitosamente");
            } catch (error: any) {
                console.error("Error al eliminar el alumno:", error);
                alert(`Ocurrió un error al eliminar el alumno: ${error.message}`);
            }
        }
    };

    const closeCreateModal = () => setIsCreateModalOpen(false);

    return (
        <div className="mx-auto p-1">
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
                    data={alumnos.map(({ NumDocumento, Nombre, Apellido, Sexo, Grado, RegistrationDate }) => ({
                        NIE: NumDocumento, // Mapeo del campo NumDocumento al encabezado "NIE"
                        Nombre,
                        Apellido,
                        Sexo,
                        Grado,
                        "Fecha de Registro": formatDate(RegistrationDate)
                    }))}
                    onActionClick={(row, action) => handleActionClick(row, action as 'view' | 'edit' | 'delete')}
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

            {/* Modal para ver detalles del alumno */}
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
                <Modal
                    isOpen={true}
                    title="Editar Alumno"
                    onClose={() => {
                        setSelectedAlumno(null);
                        setModalType(null);
                    }}
                >
                    <EditAlumnoForm
                        alumnoData={mapAlumnoGetToPost(selectedAlumno)}
                        alumnoId={selectedAlumno.Id}
                        onSaveSuccess={() => {
                            fetchAlumnos();
                            setModalType(null);
                            setSelectedAlumno(null);
                        }}
                        onCancel={() => {
                            setSelectedAlumno(null);
                            setModalType(null);
                        }}
                    />
                </Modal>
            )}

            {/* Modal de confirmación de eliminación */}
            {selectedAlumno && modalType === 'delete' && (
                <DeleteModal
                    isOpen={true}
                    title="Eliminar Alumno"
                    message={`¿Estás seguro de que deseas eliminar al alumno "${selectedAlumno.Nombre}"? Esta acción no se puede deshacer.`}
                    onClose={() => {
                        setModalType(null);
                        setSelectedAlumno(null);
                    }}
                    onConfirm={handleDeleteAlumno}
                />
            )}
        </div>
    );
};

export default AlumnoListPage;
