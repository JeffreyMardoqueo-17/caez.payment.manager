"use client";

import React, { useEffect, useState } from "react";
import TableList from "@/components/Tables/TableList";
import Loader from "@/components/Loader";
import Modal from "@/components/modals/Modal";
import DeleteModal from "@/components/modals/DeleteModal";
import CreateAlumnoForm from "@/components/Alumno/CreateAlumnoForm";
import EditAlumnoForm from "@/components/Alumno/EditAlumnoForm";
import MostrarInfo from "@/components/MostrarInfo";
import ReportAlumno from "@/components/reports/ReportAlumno"; // Importamos el componente actualizado
import { getAlumnos, updateAlumno, deleteAlumno } from "@/services/AlumnoService";
import { AlumnoGet, AlumnoPost } from "@/interfaces/Alumno";
import { formatDate } from "@/utils/formatDate";

const AlumnoListPage = () => {
    const [alumnos, setAlumnos] = useState<Array<AlumnoGet>>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAlumno, setSelectedAlumno] = useState<AlumnoGet | null>(null);
    const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(null);
    const [isPDFModalOpen, setIsPDFModalOpen] = useState(false); // Estado para abrir/cerrar el modal PDF

    const headers = [
        "Id",
        "Nombre",
        "Apellido",
        "FechaNacimiento",
        "Sexo",
        "Grado",
        "Turno",
        "Encargado", // Combina EncargadoNombre y EncargadoApellido
        "NumDocumento",
        "EsBecado",
        "Nombre del Padrino", // Opcional
        "Administrador", // Combina AdminName y AdminLastName
        "Fecha de Registro",
    ];

    // Función para cargar los alumnos desde el servicio
    const fetchAlumnos = async () => {
        setLoading(true);
        try {
            const data: AlumnoGet[] = await getAlumnos();
            setAlumnos(data);
        } catch (error) {
            console.error("Error fetching alumnos:", error);
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
            IdSexo: parseInt(alumno.Sexo) || 0,
            IdRole: 2,
            IdGrado: parseInt(alumno.Grado) || 0,
            IdTurno: 1,
            IdEncargado: 1,
            IdTipoDocumento: 2,
            NumDocumento: alumno.NumDocumento,
            EsBecado: alumno.EsBecado,
            IdPadrino: alumno.PadrinoNombre ? 1 : null,
        };
    };

    const handleActionClick = (row: Record<string, any>, action: "view" | "edit" | "delete") => {
        const fullAlumno = alumnos.find((a) => a.Id === row.Id);
        if (!fullAlumno) {
            console.error("No se encontró el alumno con ID:", row.Id);
            return;
        }
        setSelectedAlumno(fullAlumno);
        setModalType(action);
    };

    const handleUpdateAlumno = async (updatedData: Partial<AlumnoPost>) => {
        if (selectedAlumno) {
            const completeData: AlumnoPost = {
                ...mapAlumnoGetToPost(selectedAlumno),
                ...updatedData,
            };

            try {
                await updateAlumno(selectedAlumno.Id, completeData);
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

            {/* Botones de acciones principales */}
            <div className="mb-4 flex space-x-4">
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Crear Nuevo Alumno
                </button>

                <button onClick={fetchAlumnos} className="px-4 py-2 bg-gray-600 text-white rounded">
                    Refrescar
                </button>

                <button
                    onClick={() => setIsPDFModalOpen(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    Generar Reporte PDF
                </button>
            </div>

            {/* Loader o Tabla */}
            {loading ? (
                <Loader />
            ) : (
                <TableList
                    headers={["NIE", "Nombre", "Apellido", "Sexo", "Grado", "Fecha de Registro"]}
                    data={alumnos.map(
                        ({
                            Id,
                            NumDocumento,
                            Nombre,
                            Apellido,
                            Sexo,
                            Grado,
                            RegistrationDate,
                        }) => ({
                            Id,
                            NIE: NumDocumento,
                            Nombre,
                            Apellido,
                            Sexo,
                            Grado,
                            "Fecha de Registro": formatDate(RegistrationDate),
                        })
                    )}
                    onActionClick={(row, action) =>
                        handleActionClick(row, action as "view" | "edit" | "delete")
                    }
                    initialRowsPerPage={10}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                />
            )}

            {/* Modal para Crear Alumno */}
            <Modal
                isOpen={isCreateModalOpen}
                modalId="createAlumnoModal"
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

            {/* Modal para Ver Alumno */}
            {selectedAlumno && modalType === "view" && (
                <Modal
                    isOpen={true}
                    modalId={`viewAlumnoModal-${selectedAlumno.Id}`}
                    title="Detalles del Alumno"
                    onClose={() => {
                        setSelectedAlumno(null);
                        setModalType(null);
                    }}
                >
                    <MostrarInfo data={selectedAlumno} />
                </Modal>
            )}

            {/* Modal para Editar Alumno */}
            {selectedAlumno && modalType === "edit" && (
                <Modal
                    isOpen={true}
                    modalId={`editAlumnoModal-${selectedAlumno.Id}`}
                    title="Editar Alumno"
                    onClose={() => {
                        setSelectedAlumno(null);
                        setModalType(null);
                    }}
                >
                    <EditAlumnoForm
                        alumnoData={selectedAlumno}
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

            {/* Modal de Confirmación para Eliminar Alumno */}
            {selectedAlumno && modalType === "delete" && (
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

            {/* Modal para Generar Reporte PDF */}
            <ReportAlumno
                isOpen={isPDFModalOpen}
                onClose={() => setIsPDFModalOpen(false)}
                data={alumnos}
                defaultHeaders={headers}
            />
        </div>
    );
};

export default AlumnoListPage;
