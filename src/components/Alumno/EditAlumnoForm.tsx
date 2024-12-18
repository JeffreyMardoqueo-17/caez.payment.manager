"use client";

import React, { useState, useEffect } from "react";
import { updateAlumno } from "@/services/AlumnoService";
import { getSexos, Sexo } from "@/services/SexoService";
import { getGrados, Grado } from "@/services/GradoService";
import { getTurnos, Turno } from "@/services/TurnoService";
import { getEncargados } from "@/services/EncargadoService";
import { getPadrinos } from "@/services/padrinoService";
import { AlumnoPost, AlumnoGet } from "@/interfaces/Alumno";
import { Encargado } from "@/interfaces/Encargado";
import { Padrino } from "@/interfaces/Padrino";

interface EditAlumnoFormProps {
    alumnoData: AlumnoGet;
    onSaveSuccess: () => void;
    onCancel: () => void;
}

const EditAlumnoForm: React.FC<EditAlumnoFormProps> = ({
    alumnoData,
    onSaveSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState<AlumnoPost>({
        Nombre: alumnoData.Nombre,
        Apellido: alumnoData.Apellido,
        FechaNacimiento: alumnoData.FechaNacimiento.split("T")[0],
        IdSexo: 0,
        IdRole: 2, // Fijo para "Estudiante"
        IdGrado: 0,
        IdTurno: 0,
        IdEncargado: 0,
        IdTipoDocumento: 2, // Fijo para "NIE"
        NumDocumento: alumnoData.NumDocumento,
        EsBecado: alumnoData.EsBecado,
        IdPadrino: alumnoData.EsBecado ? null : null,
    });

    const [initialData, setInitialData] = useState(formData);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [changedFields, setChangedFields] = useState<Partial<Record<keyof AlumnoPost, boolean>>>({});

    const [sexos, setSexos] = useState<Sexo[]>([]);
    const [grados, setGrados] = useState<Grado[]>([]);
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [encargados, setEncargados] = useState<Encargado[]>([]);
    const [padrinos, setPadrinos] = useState<Padrino[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Carga inicial de datos externos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sexosData, gradosData, turnosData, encargadosData, padrinosData] =
                    await Promise.all([getSexos(), getGrados(), getTurnos(), getEncargados(), getPadrinos()]);

                setSexos(sexosData);
                setGrados(gradosData);
                setTurnos(turnosData);
                setEncargados(encargadosData);
                setPadrinos(padrinosData);

                const updatedData = {
                    ...formData,
                    IdSexo: sexosData.find((s) => s.Nombre === alumnoData.Sexo)?.Id || 0,
                    IdGrado: gradosData.find((g) => g.Nombre === alumnoData.Grado)?.Id || 0,
                    IdTurno: turnosData.find((t) => t.Nombre === alumnoData.Turno)?.Id || 0,
                    IdEncargado:
                        encargadosData.find(
                            (e) =>
                                e.Nombre === alumnoData.EncargadoNombre &&
                                e.Apellido === alumnoData.EncargadoApellido
                        )?.Id || 0,
                    IdPadrino: alumnoData.EsBecado
                        ? padrinosData.find((p) => p.Nombre === alumnoData.PadrinoNombre)?.Id || null
                        : null,
                };

                setFormData(updatedData);
                setInitialData(updatedData); // Guarda la versión inicial del formulario
            } catch (error) {
                console.error("Error al cargar datos de selectores:", error);
                setError("Error al cargar datos de los selectores.");
            }
        };

        fetchData();
    }, [alumnoData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const fieldValue =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value;

        setFormData((prevData) => {
            const updatedFormData = {
                ...prevData,
                [name]: fieldValue,
                ...(name === "EsBecado" && !fieldValue ? { IdPadrino: null } : {}),
            };

            // Track changed fields
            setChangedFields((prevFields) => ({
                ...prevFields,
                [name]: updatedFormData[name as keyof AlumnoPost] !== initialData[name as keyof AlumnoPost],
            }));

            setIsFormChanged(JSON.stringify(updatedFormData) !== JSON.stringify(initialData));
            return updatedFormData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await updateAlumno(alumnoData.Id, formData);
            onSaveSuccess();
        } catch (error: any) {
            console.error("Error al actualizar el alumno:", error);
            setError(error.message || "Error al actualizar el alumno");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className={`w-full p-2 border ${changedFields.Nombre ? "border-blue-500" : "border-gray-300"
                            } rounded`}
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
                        placeholder="Apellido"
                        className={`w-full p-2 border ${changedFields.Apellido ? "border-blue-500" : "border-gray-300"
                            } rounded`}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        name="FechaNacimiento"
                        value={formData.FechaNacimiento}
                        onChange={handleChange}
                        className={`w-full p-2 border ${changedFields.FechaNacimiento ? "border-blue-500" : "border-gray-300"
                            } rounded`}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Sexo</label>
                    <select
                        name="IdSexo"
                        value={formData.IdSexo}
                        onChange={handleChange}
                        className={`w-full p-2 border ${changedFields.IdSexo ? "border-blue-500" : "border-gray-300"
                            } rounded`}
                        required
                    >
                        {sexos.map((sexo) => (
                            <option key={sexo.Id} value={sexo.Id}>
                                {sexo.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Grado</label>
                    <select
                        name="IdGrado"
                        value={formData.IdGrado}
                        onChange={handleChange}
                        className={`w-full p-2 border ${changedFields.IdGrado ? "border-blue-500" : "border-gray-300"
                            } rounded`}
                        required
                    >
                        {grados.map((grado) => (
                            <option key={grado.Id} value={grado.Id}>
                                {grado.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Turno</label>
                    <select
                        name="IdTurno"
                        value={formData.IdTurno}
                        onChange={handleChange}
                        className={`w-full p-2 border ${changedFields.IdTurno ? "border-blue-500" : "border-gray-300"
                            } rounded`}
                        required
                    >
                        {turnos.map((turno) => (
                            <option key={turno.Id} value={turno.Id}>
                                {turno.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Encargado</label>
                    <select
                        name="IdEncargado"
                        value={formData.IdEncargado}
                        onChange={handleChange}
                        className={`w-full p-2 border ${changedFields.IdEncargado ? "border-blue-500" : "border-gray-300"
                            } rounded`}
                        required
                    >
                        {encargados.map((encargado) => (
                            <option key={encargado.Id} value={encargado.Id}>
                                {encargado.Nombre} {encargado.Apellido}
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
                        placeholder="Número de Documento"
                        className={`w-full p-2 border ${changedFields.NumDocumento ? "border-blue-500" : "border-gray-300"
                            } rounded`}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Becado</label>
                    <input
                        type="checkbox"
                        name="EsBecado"
                        checked={formData.EsBecado}
                        onChange={handleChange}
                        className="mr-2"
                    />
                </div>
                {formData.EsBecado && (
                    <div>
                        <label className="block text-gray-700">Padrino</label>
                        <select
                            name="IdPadrino"
                            value={formData.IdPadrino ?? ""}
                            onChange={handleChange}
                            className={`w-full p-2 border ${changedFields.IdPadrino ? "border-blue-500" : "border-gray-300"
                                } rounded`}
                            required
                        >
                            <option value="">Seleccione un Padrino</option>
                            {padrinos.map((padrino) => (
                                <option key={padrino.Id} value={padrino.Id}>
                                    {padrino.Nombre} {padrino.Apellido}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="flex justify-center gap-4 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className={`py-2 px-4 rounded-lg ${isFormChanged
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    disabled={!isFormChanged}
                >
                    Guardar Cambios
                </button>
            </div>
        </form>
    );
};

export default EditAlumnoForm;
