"use client";
import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrashAlt, FaSort, FaSearch } from 'react-icons/fa';
// TableList.tsx (sin cambios necesarios aquí)

interface TableListProps {
    headers: string[];
    data: Record<string, any>[];
    onActionClick?: (row: Record<string, any>, action: string) => void;
    rowsPerPageOptions?: number[];
    initialRowsPerPage?: number;
}


const TableList: React.FC<TableListProps> = ({
    headers,
    data,
    onActionClick,
    rowsPerPageOptions = [10, 25, 50, 100],
    initialRowsPerPage = 10,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const [sortedData, setSortedData] = useState([...data].reverse()); // Mostrar último registro al principio
    const [filteredData, setFilteredData] = useState([...data].reverse()); // Invertir los datos al inicio
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: headers[0], direction: 'desc' });

    // Guardar y recuperar configuración de orden en localStorage
    useEffect(() => {
        const storedSortConfig = localStorage.getItem('tableSortConfig');
        if (storedSortConfig) {
            const parsedConfig = JSON.parse(storedSortConfig);
            if (parsedConfig && parsedConfig.key && parsedConfig.direction) {
                setSortConfig(parsedConfig);
                handleSort(parsedConfig.key, parsedConfig.direction, data);
            }
        }
    }, [data]);

    useEffect(() => {
        setSortedData([...data].reverse()); // Invertir para mostrar el más reciente primero
        setFilteredData([...data].reverse());
    }, [data]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setPaginatedData(filteredData.slice(startIndex, endIndex));
    }, [filteredData, currentPage, rowsPerPage]);

    const [paginatedData, setPaginatedData] = useState<Record<string, any>[]>([]);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSort = (key: string, direction: 'asc' | 'desc', customData?: Record<string, any>[]) => {
        const dataToSort = customData || filteredData;
        const sortedArray = [...dataToSort].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setSortedData(sortedArray);
        setFilteredData(sortedArray);
        setSortConfig({ key, direction });
        setCurrentPage(1);

        // Guardar la configuración de orden en localStorage
        localStorage.setItem('tableSortConfig', JSON.stringify({ key, direction }));
    };

    const toggleSortOrder = () => {
        const newDirection = sortConfig?.direction === 'asc' ? 'desc' : 'asc';
        const sortKey = sortConfig?.key || headers[0];
        handleSort(sortKey, newDirection);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = data.filter((row) =>
            headers.some((header) =>
                row[header]?.toString().toLowerCase().includes(query)
            )
        );

        setFilteredData(filtered);
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col p-1 rounded-lg shadow-sm ">
            <div className="flex items-center justify-between mb-4 space-x-2">
                <button
                    onClick={toggleSortOrder}
                    className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                    <FaSort className="text-gray-600" />
                    <span>{sortConfig?.direction === 'asc' ? 'Orden Descendente' : 'Orden Ascendente'}</span>
                </button>

                <div className="flex items-center bg-gray-100 rounded-lg px-2">
                    <FaSearch className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Buscar..."
                        className="bg-gray-100 text-gray-800 focus:outline-none px-2 py-1 rounded-lg"
                    />
                </div>
            </div>

            <div className="overflow-x-auto overflow-y-hidden rounded-t-lg">
                <table className="min-w-full border-collapse table-fixed shadow-lg select-none">
                    <thead className="sticky top-0 bg-background dark:bg-tableDark">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100 cursor-pointer"
                                    onClick={() => handleSort(header, sortConfig?.direction === 'asc' ? 'desc' : 'asc')}
                                >
                                    {header}
                                    {sortConfig?.key === header && (
                                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-tableDark">
                        {paginatedData.map((row, rowIndex) => (
                            <tr key={rowIndex} className=" hover:bg-hoverTable cursor-pointer hover:dark:bg-hoverTableDark">
                                {headers.map((header, colIndex) => (
                                    <td key={colIndex} className="px-4 py-2 text-sm text-gray-700  dark:text-gray-400 whitespace-nowrap">
                                        {row[header] !== undefined ? row[header] : '-'}
                                    </td>
                                ))}
                                <td className="px-4 py-2 text-center flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => onActionClick && onActionClick(row, 'view')}
                                        className="p-2 bg-bgAzul rounded-full text-blue-100 hover:bg-blue-200 transition duration-200"
                                        aria-label="View"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => onActionClick && onActionClick(row, 'edit')}
                                        className="p-2 rounded-full text-white bg-bgAzul hover:bg-blue-950 transition-colors duration-200"
                                        aria-label="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => onActionClick && onActionClick(row, 'delete')}
                                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                        aria-label="Delete"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        className="bg-white border border-gray-300 text-gray-700 text-sm rounded p-1 focus:outline-none"
                    >
                        {rowsPerPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        &lt;
                    </button>

                    <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableList;
