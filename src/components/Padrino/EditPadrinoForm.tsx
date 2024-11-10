// src/components/Padrino/EditPadrinoForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { updatePadrino } from '@/services/padrinoService';
import { PadrinoCreate } from '@/interfaces/Padrino';

interface EditPadrinoFormProps {
    padrino: PadrinoCreate & { Id: number }; // Incluye el ID para el servicio de actualización
    onSaveSuccess: () => void;
    onCancel: () => void;
}

const EditPadrinoForm: React.FC<EditPadrinoFormProps> = ({ padrino, onSaveSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        Nombre: padrino.Nombre,
        Apellido: padrino.Apellido,
        Telefono: padrino.Telefono,
        Correo: padrino.Correo,
        IdRole: 4 // Asegúrate de que el valor de IdRole es 4 para representar "Padrino"
    });

    const [error, setError] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const isChanged =
            formData.Nombre !== padrino.Nombre ||
            formData.Apellido !== padrino.Apellido ||
            formData.Telefono !== padrino.Telefono ||
            formData.Correo !== padrino.Correo;
        setHasChanges(isChanged);
    }, [formData, padrino]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (hasChanges) {
            try {
                await updatePadrino(padrino.Id, formData); // Llama al servicio de actualización con los datos del formulario
                onSaveSuccess(); // Cierra el modal y actualiza la lista
            } catch (error) {
                setError("Error al actualizar el padrino");
                console.error("Error updating padrino:", error);
            }
        } else {
            alert("No hay cambios para guardar.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Editar Padrino</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campos editables */}
                <div>
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Apellido</label>
                    <input
                        type="text"
                        name="Apellido"
                        value={formData.Apellido}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Teléfono</label>
                    <input
                        type="text"
                        name="Telefono"
                        value={formData.Telefono}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Correo</label>
                    <input
                        type="email"
                        name="Correo"
                        value={formData.Correo}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                {/* Campo de solo lectura para el Rol */}
                <div>
                    <label className="block text-gray-700">Rol</label>
                    <input
                        type="text"
                        value="Padrino" // Muestra "Padrino" como campo fijo
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                        title="No editable"
                    />
                </div>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className={`px-4 py-2 ${hasChanges ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"} text-white rounded`}
                    disabled={!hasChanges}
                >
                    Guardar cambios
                </button>
            </div>
        </form>
    );
};

export default EditPadrinoForm;
