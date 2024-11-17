// components/Tables/TablaAuditoria.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { AuditoriaEncargado, DetallesAuditoria } from '@/interfaces/AuditoriaEncargado';
import { FaFilter, FaList, FaEye, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import Loader from '../Loader';

interface TablaAuditoriaProps {
    data: AuditoriaEncargado[];
    onOpenDetails: (detalles: string | DetallesAuditoria | { Antiguo: DetallesAuditoria; Nuevo: DetallesAuditoria }) => void;
    onFilterByDate: (startDate: string, endDate: string) => void;
    onFetchAll: () => void;
}
const getOperationStyle = (operation: string) => {
    switch (operation) {
        case 'INSERT':
            return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100";
        case 'DELETE':
            return "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100";
        case 'UPDATE':
            return "bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
};

const TablaAuditoria: React.FC<TablaAuditoriaProps> = ({ data, onOpenDetails, onFilterByDate, onFetchAll }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [isAscending, setIsAscending] = useState<boolean>(true);

    const handleFilterClick = () => {
        if (startDate && endDate) {
            onFilterByDate(startDate, endDate);
        }
    };

    const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.FechaHora).getTime();
        const dateB = new Date(b.FechaHora).getTime();
        return isAscending ? dateA - dateB : dateB - dateA;
    });

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const toggleSortOrder = () => {
        setIsAscending(!isAscending);
    };

    return (
        <div className="p-6 shadow-sm rounded-lg">
            {/* Filtros de fecha */}
            <div className="flex justify-between mb-6">
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
                        onClick={handleFilterClick}
                        className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-blue-700 transition duration-200"
                    >
                        <FaFilter className="text-lg" />
                        <span>Filtrar</span>
                    </button>
                    <button
                        onClick={onFetchAll}
                        className="bg-gray-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-700 transition duration-200"
                    >
                        <FaList className="text-lg" />
                        <span>Ver Todos</span>
                    </button>
                </div>
            </div>

            {/* Selector de cantidad de filas */}
            <div className="mb-4 flex items-center space-x-2">
                <label className="text-gray-700">Filas por página:</label>
                <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="border rounded p-2 text-gray-700"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {/* Tabla de auditoría */}
            <table className="min-w-full border-collapse table-fixed rounded-xl select-none">
                <thead className="bg-background dark:bg-tableDark">
                    <tr>
                        <th
                            className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100 cursor-pointer flex items-center"
                            onClick={toggleSortOrder}
                        >
                            Fecha y Hora
                            {isAscending ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">Usuario</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">Operación</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">Registro</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">Detalles</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-tableDark">
                    {paginatedData.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-4">
                                <div className="flex flex-col items-center">
                                    <Image
                                        src="/svg/empty.svg"
                                        alt="No data available"
                                        width={100}
                                        height={100}
                                    />
                                    <Loader />
                                </div>
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((item) => (
                            <tr key={item.Id} className="hover:bg-gray-100 hover:dark:bg-hoverTableDark cursor-pointer">
                                <td className="px-4 py-2 text-sm text-gray-700  dark:text-gray-400 whitespace-nowrap">
                                    {new Date(item.FechaHora).toLocaleString()}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700  dark:text-gray-400 whitespace-nowrap">
                                    {item.UsuarioNombre}
                                </td>
                                <td className={`px-4 py-2 text-sm font-semibold whitespace-nowrap ${getOperationStyle(item.Operacion)}`}>
                                    {item.Operacion}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700  dark:text-gray-400 whitespace-nowrap">
                                    {item.IdRegistro}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700  dark:text-gray-400 whitespace-nowrap">
                                    <button
                                        onClick={() => onOpenDetails(item.Detalles)}
                                        className="p-2 bg-blue-100 rounded-full text-bgAzul hover:bg-blue-200 transition duration-200"
                                        aria-label="Ver más detalles"
                                    >
                                        <FaEye className="text-lg" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`flex items-center px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-bgAzul text-white hover:bg-blue-950'}`}
                >
                    <FaArrowLeft className="mr-2" />

                </button>
                <span className="text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-bgAzul text-white hover:bg-blue-950'}`}
                >

                    <FaArrowRight className="ml-2" />
                </button>
            </div>
        </div>
    );
};

export default TablaAuditoria;
