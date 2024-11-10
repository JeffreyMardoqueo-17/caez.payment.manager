"use client";
import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

interface DeleteModalProps {
    isOpen: boolean;
    title: string;
    message: string; // Mensaje de confirmación
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, title, message, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2">
            <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg overflow-hidden text-center p-6">
                {/* Encabezado con ícono de advertencia */}
                <div className="flex justify-center mb-4">
                    <FaExclamationCircle className="text-red-600 text-4xl" />
                </div>

                {/* Título y mensaje */}
                <h2 className="text-lg font-semibold mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>

                {/* Botones de confirmación y cancelación */}
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
