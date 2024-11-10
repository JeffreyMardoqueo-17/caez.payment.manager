"use client";
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const DeleteModal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2">
            <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg overflow-hidden">

                {/* Encabezado del modal con fondo azul y título en blanco */}
                <div className="bg-red-700 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-bgAmarillo hover:text-yellow-400 text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>

                {/* Contenido del modal */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
