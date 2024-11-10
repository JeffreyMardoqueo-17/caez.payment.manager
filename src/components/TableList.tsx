"use client";
import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrashAlt, FaSort, FaSearch } from 'react-icons/fa';

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
    const [sortedData, setSortedData] = useState(data);
    const [filteredData, setFilteredData] = useState(data);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    useEffect(() => {
        setSortedData(data);
        setFilteredData(data);
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

    const handleSort = (key: string, direction: 'asc' | 'desc') => {
        const sortedArray = [...filteredData].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setSortedData(sortedArray);
        setFilteredData(sortedArray);
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const toggleSortOrder = () => {
        const newDirection = sortConfig?.direction === 'asc' ? 'desc' : 'asc';
        const sortKey = sortConfig?.key || headers[0];
        handleSort(sortKey, newDirection);
    };

    // Filtrado de datos según el texto de búsqueda
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
        <div className="flex flex-col p-1 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4 space-x-2">
                {/* Botón para alternar el orden */}
                <button
                    onClick={toggleSortOrder}
                    className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                    <FaSort className="text-gray-600" />
                    <span>{sortConfig?.direction === 'asc' ? 'Orden Descendente' : 'Orden Ascendente'}</span>
                </button>

                {/* Campo de búsqueda */}
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
                <table className="min-w-full border-collapse table-fixed">
                    <thead className="sticky top-0 bg-background">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-800 cursor-pointer"
                                    onClick={() => handleSort(header, sortConfig?.direction === 'asc' ? 'desc' : 'asc')}
                                >
                                    {header}
                                    {sortConfig?.key === header && (
                                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {paginatedData.map((row, rowIndex) => (
                            <tr key={rowIndex} className=" hover:bg-hoverTable cursor-pointer">
                                {headers.map((header, colIndex) => (
                                    <td key={colIndex} className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">
                                        {row[header] !== undefined ? row[header] : '-'}
                                    </td>
                                ))}
                                <td className="px-4 py-2 text-center flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => onActionClick && onActionClick(row, 'view')}
                                        className="p-2 rounded-full text-white bg-bgAzul hover:bg-blue-950 transition-colors duration-200"
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
