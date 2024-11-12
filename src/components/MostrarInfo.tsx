// src/components/MostrarInfo.tsx
import React from 'react';
import { formatDate } from '@/utils/formatDate';

interface MostrarInfoProps {
    data: Record<string, any>; // Tipo genérico para aceptar cualquier tipo de objeto
}

const MostrarInfo: React.FC<MostrarInfoProps> = ({ data, }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">

            {/* Muestra los campos individuales */}
            {Object.entries(data).map(([key, value]) => {
                // Si se trata del nombre y apellido del administrador, los agrupamos
                if (key === 'AdminName' || key === 'AdminLastName') {
                    return null; // Saltamos la renderización aquí, se agrupa abajo
                }

                return (
                    <div key={key} className="md:col-span-1">
                        <p>
                            <strong>{formatKey(key)}:</strong> {formatValue(key, value)}
                        </p>
                    </div>
                );
            })}

            {/* Fila especial para el nombre y apellido del administrador */}
            <div className="md:col-span-2">
                <p>
                    <strong>Nombre del administrador:</strong> {formatValue('AdminName', data.AdminName)} {formatValue('AdminLastName', data.AdminLastName)}
                </p>
            </div>
        </div>
    );
};

// Formato personalizado para la clave (por ejemplo, convertir camelCase a texto normal)
const formatKey = (key: string): string => {
    return key
        .replace(/([A-Z])/g, ' $1') // Agregar espacio antes de cada mayúscula
        .replace(/^./, str => str.toUpperCase()); // Capitalizar la primera letra
};

// Formato personalizado para el valor, aplicando formateo de fecha si es necesario
const formatValue = (key: string, value: any): string => {
    if (key.toLowerCase().includes("date") && typeof value === "string") {
        return formatDate(value);
    }
    return value ?? "No disponible";
};

export default MostrarInfo;
