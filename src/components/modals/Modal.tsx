"use client";
import React, { useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null); // Referencia al contenido del modal

    if (!isOpen) return null;

    // Función para manejar el clic fuera del contenido del modal
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose(); // Cierra el modal si se hace clic fuera de él
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2"
            onClick={handleOutsideClick} // Llama a la función al hacer clic en el contenedor exterior
        >
            <div
                ref={modalRef} // Aplica la referencia al contenido del modal
                className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg overflow-hidden"
            >
                <div className="bg-bgAzul px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-bgAmarillo hover:text-yellow-400 text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
