// src/components/MostrarInfo.tsx
import React from 'react';
import { formatDate } from '@/utils/formatDate';
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaShieldAlt, FaUserShield } from 'react-icons/fa';

interface MostrarInfoProps {
    data: Record<string, any>;
}

const MostrarInfo: React.FC<MostrarInfoProps> = ({ data }) => {
    return (
        <div className="p-6 bg-white rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Campos individuales con íconos */}
                {Object.entries(data).map(([key, value]) => {
                    if (key === 'AdminName' || key === 'AdminLastName') {
                        return null; // Excluir los campos del administrador de esta sección
                    }

                    return (
                        <div key={key} className="flex items-center space-x-4">
                            {getIconForKey(key)}
                            <div>
                                <p className="text-black font-semibold">{formatKey(key)}</p>
                                <p className="text-textGray text-base">{formatValue(key, value)}</p>
                            </div>
                        </div>
                    );
                })}

                {/* Información del administrador */}
                <div className="flex items-center space-x-4 md:col-span-2">
                    <FaUserShield className="text-bgAzul text-base" />
                    <div>
                        <p className="text-gray-500 text-sm">Administrador</p>
                        <p className="text-gray-900 font-semibold">
                            {formatValue('AdminName', data.AdminName)} {formatValue('AdminLastName', data.AdminLastName)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Devuelve el ícono correspondiente según la clave
const getIconForKey = (key: string) => {
    switch (key.toLowerCase()) {
        case 'nombre':
        case 'apellido':
        case 'nombrecompleto':
            return <FaUser className="text-bgAzul text-base" />;
        case 'telefono':
            return <FaPhone className="text-bgAzul text-base" />;
        case 'correo':
            return <FaEnvelope className="text-bgAzul text-base" />;
        case 'fechadeinscripción':
        case 'fechaderegistro':
        case 'fecha':
            return <FaCalendarAlt className="text-bgAzul text-base" />;
        case 'rol':
        case 'nombre del rol':
            return <FaShieldAlt className="text-bgAzul text-base" />;
        default:
            return <FaUser className="text-bgAzul text-base" />;
    }
};

// Formateo de la clave para mostrar como texto legible
const formatKey = (key: string): string => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
};

// Formateo del valor, especialmente para fechas
const formatValue = (key: string, value: any): string => {
    if (key.toLowerCase().includes("date") && typeof value === "string") {
        return formatDate(value);
    }
    return value ?? "No disponible";
};

export default MostrarInfo;
