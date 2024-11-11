// src/components/Encargado/EditEncargadoForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { updateEncargado } from '@/services/EncargadoService';
import { EncargadoCreate } from '@/interfaces/Encargado';
import { getDirecciones } from '@/services/DireccionService';
import { getParentezcos } from '@/services/ParentezcoService';
import { getTipoDocumento } from '@/services/TipoDocumentoService';
import { Direccion } from '@/interfaces/Direccion';
import { Parentezco } from '@/interfaces/Parentezco';
import { TipoDocumento } from '@/interfaces/TipoDocumento';

interface EditEncargadoFormProps {
    encargado: EncargadoCreate & { Id: number };
    onSaveSuccess: () => void;
    onCancel: () => void;
}

const EditEncargadoForm: React.FC<EditEncargadoFormProps> = ({ encargado, onSaveSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        Nombre: encargado.Nombre,
        Apellido: encargado.Apellido,
        Telefono: encargado.Telefono,
        Correo: encargado.Correo,
        IdDireccion: encargado.IdDireccion,
        IdParentezco: encargado.IdParentezco,
        IdTipoDocumento: encargado.IdTipoDocumento,
        NumDocumento: encargado.NumDocumento,
        IdRole: 3 // Valor fijo para "Encargado"
    });

    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [parentezcos, setParentezcos] = useState<Parentezco[]>([]);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [direccionesData, parentezcosData, tiposDocumentoData] = await Promise.all([
                    getDirecciones(),
                    getParentezcos(),
                    getTipoDocumento()
                ]);
                setDirecciones(direccionesData);
                setParentezcos(parentezcosData);
                setTiposDocumento(tiposDocumentoData);
            } catch (error) {
                console.error("Error fetching select data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const isChanged =
            formData.Nombre !== encargado.Nombre ||
            formData.Apellido !== encargado.Apellido ||
            formData.Telefono !== encargado.Telefono ||
            formData.Correo !== encargado.Correo ||
            formData.IdDireccion !== encargado.IdDireccion ||
            formData.IdParentezco !== encargado.IdParentezco ||
            formData.IdTipoDocumento !== encargado.IdTipoDocumento ||
            formData.NumDocumento !== encargado.NumDocumento;
        setHasChanges(isChanged);
    }, [formData, encargado]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (hasChanges) {
            try {
                await updateEncargado(encargado.Id, formData); // Actualiza los datos
                onSaveSuccess(); // Cierra el modal y refresca la lista
            } catch (error) {
                setError("Error al actualizar el encargado");
                console.error("Error updating encargado:", error);
            }
        } else {
            alert("No hay cambios para guardar.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Editar Encargado</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                    <label className="block text-gray-700">Dirección</label>
                    <select
                        name="IdDireccion"
                        value={formData.IdDireccion}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        {direcciones.map((direccion) => (
                            <option key={direccion.Id} value={direccion.Id}>
                                {direccion.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Parentezco</label>
                    <select
                        name="IdParentezco"
                        value={formData.IdParentezco}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        {parentezcos.map((parentezco) => (
                            <option key={parentezco.Id} value={parentezco.Id}>
                                {parentezco.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Tipo de Documento</label>
                    <select
                        name="IdTipoDocumento"
                        value={formData.IdTipoDocumento}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        {tiposDocumento.map((tipo) => (
                            <option key={tipo.Id} value={tipo.Id}>
                                {tipo.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Número de Documento</label>
                    <input
                        type="text"
                        name="NumDocumento"
                        value={formData.NumDocumento}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Rol</label>
                    <input
                        type="text"
                        value="Encargado"
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                        title="No editable"
                    />
                </div>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

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

export default EditEncargadoForm;
