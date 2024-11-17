"use client";

import React, { useState, useEffect } from "react";
import { generatePDF } from "@/utils/pdfGenerator"; // Asegúrate de que esta función soporte "landscape"
import { AlumnoGet } from "@/interfaces/Alumno";
import { Grado, getGrados } from "@/services/GradoService";
import { Turno, getTurnos } from "@/services/TurnoService";
import { Sexo, getSexos } from "@/services/SexoService";
import { User, getUsers } from "@/services/UserService";
import { FaFilePdf, FaTimes } from "react-icons/fa"; // Íconos de React Icons

/**
 * Formatea una fecha a `dd/mm/yyyy hh:mm`.
 */
const formatDateTime = (dateString: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

interface PDFReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: AlumnoGet[];
}

const ReportAlumno: React.FC<PDFReportModalProps> = ({ isOpen, onClose, data }) => {
    const [filterType, setFilterType] = useState<string>("all");
    const [selectedFilter, setSelectedFilter] = useState<string>("");
    const [filteredData, setFilteredData] = useState<AlumnoGet[]>(data);
    const [selectedHeaders, setSelectedHeaders] = useState<string[]>([
        "Id",
        "Nombre",
        "Apellido",
        "Grado",
        "Turno",
        "Encargado",
        "NIE",
        "EsBecado",
        "Fecha de Registro",
    ]);

    const [grados, setGrados] = useState<Grado[]>([]);
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [sexos, setSexos] = useState<Sexo[]>([]);
    const [administradores, setAdministradores] = useState<User[]>([]);

    const allHeaders = [
        "Id",
        "Nombre",
        "Apellido",
        "FechaNacimiento",
        "Sexo",
        "Grado",
        "Turno",
        "Encargado",
        "NIE",
        "EsBecado",
        "Nombre del Padrino",
        "Administrador",
        "Fecha de Registro",
    ];

    // Cargar datos dinámicos al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gradosData, turnosData, sexosData, usersData] = await Promise.all([
                    getGrados(),
                    getTurnos(),
                    getSexos(),
                    getUsers(),
                ]);

                setGrados(gradosData);
                setTurnos(turnosData);
                setSexos(sexosData);
                setAdministradores(usersData.filter((user) => user.RoleName === "Administrador"));
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };

        fetchData();
    }, []);

    // Filtrar datos según tipo de reporte
    useEffect(() => {
        let filtered: AlumnoGet[] = data;

        switch (filterType) {
            case "grado":
                filtered = selectedFilter ? data.filter((a) => a.Grado === selectedFilter) : data;
                break;
            case "turno":
                filtered = selectedFilter ? data.filter((a) => a.Turno === selectedFilter) : data;
                break;
            case "sexo":
                filtered = selectedFilter ? data.filter((a) => a.Sexo === selectedFilter) : data;
                break;
            case "becados":
                filtered = data.filter((a) => a.EsBecado);
                break;
            case "noBecados":
                filtered = data.filter((a) => !a.EsBecado);
                break;
            case "administrador":
                filtered = selectedFilter
                    ? data.filter(
                        (a) =>
                            `${a.AdminName} ${a.AdminLastName}`.toLowerCase() ===
                            selectedFilter.toLowerCase()
                    )
                    : data;
                break;
            default:
                filtered = data;
        }

        setFilteredData(filtered);
    }, [filterType, selectedFilter, data]);

    const handleHeaderToggle = (header: string) => {
        setSelectedHeaders((prev) => {
            const updatedHeaders = prev.includes(header)
                ? prev.filter((h) => h !== header)
                : [...prev, header];
            return updatedHeaders.sort((a, b) => allHeaders.indexOf(a) - allHeaders.indexOf(b));
        });
    };

    const processDataForDisplay = (): Record<string, string>[] => {
        return filteredData.map((row) => ({
            Id: row.Id.toString(),
            Nombre: row.Nombre.trim(),
            Apellido: row.Apellido.trim(),
            FechaNacimiento: formatDateTime(row.FechaNacimiento),
            Sexo: row.Sexo || "N/A",
            Grado: row.Grado || "N/A",
            Turno: row.Turno || "N/A",
            Encargado: `${row.EncargadoNombre?.trim() || "N/A"} ${row.EncargadoApellido?.trim() || ""}`.trim(),
            NIE: row.NumDocumento || "N/A",
            EsBecado: row.EsBecado ? "Sí" : "No",
            "Nombre del Padrino":
                row.EsBecado && row.PadrinoNombre
                    ? `${row.PadrinoNombre.trim()} ${row.PadrinoApellido?.trim() || ""}`
                    : "N/A",
            Administrador: `${row.AdminName?.trim() || "N/A"} ${row.AdminLastName?.trim() || ""}`.trim(),
            "Fecha de Registro": formatDateTime(row.RegistrationDate),
        }));
    };

    const handleGenerateReport = () => {
        if (filteredData.length === 0 || selectedHeaders.length === 0) {
            alert("No hay datos para generar el reporte o no has seleccionado columnas.");
            return;
        }

        const processedData = processDataForDisplay();
        const finalData = processedData.map((row) =>
            selectedHeaders.reduce((acc, header) => {
                acc[header] = row[header] || "N/A";
                return acc;
            }, {} as Record<string, string>)
        );

        const isHorizontal = selectedHeaders.length > 6;
        generatePDF(finalData, selectedHeaders, "Reporte Personalizado", isHorizontal ? "landscape" : "portrait");
        onClose();
    };

    if (!isOpen) return null;

    const processedData = processDataForDisplay();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-bagroundDark rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                    Generar Reporte PDF
                </h2>
                {/* Filtros */}
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex flex-col w-full md:w-1/3">
                        <label className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                            Tipo de Reporte
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="p-2 border dark:border-borderDark rounded bg-white dark:bg-borderDark dark:text-gray-100"
                        >
                            <option value="all">Todos los registros</option>
                            <option value="becados">Solo Becados</option>
                            <option value="noBecados">No Becados</option>
                            <option value="grado">Por Grado</option>
                            <option value="turno">Por Turno</option>
                            <option value="sexo">Por Sexo</option>
                            <option value="administrador">Por Administrador</option>
                        </select>
                    </div>
                    {/* Filtro específico */}
                    {["grado", "turno", "sexo", "administrador"].includes(filterType) && (
                        <div className="flex flex-col w-full md:w-1/3">
                            <label className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                                {filterType === "grado"
                                    ? "Selecciona un Grado"
                                    : filterType === "turno"
                                        ? "Selecciona un Turno"
                                        : filterType === "sexo"
                                            ? "Selecciona un Sexo"
                                            : "Selecciona un Administrador"}
                            </label>
                            <select
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                                className="p-2 border border-borderDark rounded bg-white dark:bg-borderDark dark:text-gray-100"
                            >
                                <option value="">-- Seleccionar --</option>
                                {(filterType === "grado"
                                    ? grados
                                    : filterType === "turno"
                                        ? turnos
                                        : filterType === "sexo"
                                            ? sexos
                                            : administradores
                                ).map((item) => (
                                    <option
                                        key={item.Id}
                                        value={
                                            filterType === "grado" || filterType === "turno" || filterType === "sexo"
                                                ? (item as Grado | Turno | Sexo).Nombre
                                                : `${(item as User).Name} ${(item as User).LastName}`
                                        }
                                    >
                                        {filterType === "grado" || filterType === "turno" || filterType === "sexo"
                                            ? (item as Grado | Turno | Sexo).Nombre
                                            : `${(item as User).Name} ${(item as User).LastName}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                {/* Columnas */}
                <div className="mb-4">
                    <label className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                        Selecciona columnas
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {allHeaders.map((header) => (
                            <label key={header} className="flex items-center text-gray-900 dark:text-gray-100">
                                <input
                                    type="checkbox"
                                    checked={selectedHeaders.includes(header)}
                                    onChange={() => handleHeaderToggle(header)}
                                    className="mr-2"
                                />
                                {header}
                            </label>
                        ))}
                    </div>
                </div>
                {/* Tabla */}
                <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Previsualización</h3>
                    <div className="overflow-x-auto border dark:border-borderDark rounded bg-white dark:bg-gray-700">
                        <table className="min-w-full text-sm">
                            <thead className="bg-background dark:bg-tableDark">
                                <tr>
                                    {selectedHeaders.map((header) => (
                                        <th key={header} className="p-2 font-semibold text-gray-800 dark:text-gray-100 ">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-borderDark">
                                {processedData.map((row, index) => (
                                    <tr key={index} className="bg-white dark:bg-tableDark text-gray-700  dark:text-gray-400 whitespace-nowrap">
                                        {selectedHeaders.map((header) => (
                                            <td key={header} className="p-2">
                                                {row[header] || "N/A"}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Botones */}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="flex items-center px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                    >
                        <FaTimes className="mr-2" />
                        Cancelar
                    </button>
                    <button
                        onClick={handleGenerateReport}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={filteredData.length === 0 || selectedHeaders.length === 0}
                    >
                        <FaFilePdf className="mr-2" />
                        Generar PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportAlumno;
