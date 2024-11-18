"use client";
import React, { useRef, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [clickCount, setClickCount] = useState(0);

    if (!isOpen) return null;

    // Función para manejar el doble clic fuera del contenido del modal
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setClickCount((prev) => prev + 1); // Incrementa el conteo de clics

            // Cierra el modal si el usuario hace doble clic en el fondo
            if (clickCount + 1 === 2) {
                onClose();
                setClickCount(0); // Reinicia el contador
            }

            // Reinicia el contador de clics si el usuario no hace clic rápidamente
            setTimeout(() => setClickCount(0), 300); // 300ms para reiniciar el conteo
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2"
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                className="bg-background dark:bg-bagroundDark w-full max-w-3xl mx-auto rounded-lg shadow-lg overflow-hidden" // max-w-3xl para ancho mayor
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
