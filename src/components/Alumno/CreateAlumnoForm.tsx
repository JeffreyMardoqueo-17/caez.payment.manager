"use client";
import React, { useState, useEffect } from 'react';
import { createAlumno } from '@/services/AlumnoService';
import { getSexos, Sexo } from '@/services/SexoService';
import { getGrados, Grado } from '@/services/GradoService';
import { getTurnos, Turno } from '@/services/TurnoService';
import { getEncargados } from '@/services/EncargadoService';
import { getPadrinos } from '@/services/padrinoService';
import { Encargado } from '@/interfaces/Encargado';
import { Padrino } from '@/interfaces/Padrino';
import { AlumnoPost } from '@/interfaces/Alumno';
import { FaUserPlus } from 'react-icons/fa';

interface CreateAlumnoFormProps {
    onCreateSuccess: () => void;
}

const CreateAlumnoForm: React.FC<CreateAlumnoFormProps> = ({ onCreateSuccess }) => {
    const [alumnoData, setAlumnoData] = useState<AlumnoPost>({
        Nombre: '',
        Apellido: '',
        FechaNacimiento: '',
        IdSexo: 0,
        IdRole: 2, // Rol fijo para "Estudiante"
        IdGrado: 0,
        IdTurno: 0,
        IdEncargado: 0,
        IdTipoDocumento: 2, // Tipo de Documento fijo para "NIE"
        NumDocumento: '',
        EsBecado: false,
        IdPadrino: null
    });

    const [error, setError] = useState<string | null>(null);
    const [sexos, setSexos] = useState<Sexo[]>([]);
    const [grados, setGrados] = useState<Grado[]>([]);
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [encargados, setEncargados] = useState<Encargado[]>([]);
    const [padrinos, setPadrinos] = useState<Padrino[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sexosData, gradosData, turnosData, encargadosData, padrinosData] = await Promise.all([
                    getSexos(),
                    getGrados(),
                    getTurnos(),
                    getEncargados(),
                    getPadrinos()
                ]);

                setSexos(sexosData);
                setGrados(gradosData);
                setTurnos(turnosData);
                setEncargados(encargadosData);
                setPadrinos(padrinosData);

                setAlumnoData((prevData) => ({
                    ...prevData,
                    IdSexo: sexosData[0]?.Id || 0,
                    IdGrado: gradosData[0]?.Id || 0,
                    IdTurno: turnosData[0]?.Id || 0,
                    IdEncargado: encargadosData[0]?.Id || 0
                }));
            } catch (error) {
                console.error("Error al cargar datos de selectores:", error);
                setError("Error al cargar datos de los selectores.");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setAlumnoData((prevData) => ({
            ...prevData,
            [name]: fieldValue,
            ...(name === 'EsBecado' && !fieldValue ? { IdPadrino: null } : {})
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Limpiar el mensaje de error antes de la creación

        try {
            await createAlumno(alumnoData);
            setAlumnoData({
                Nombre: '',
                Apellido: '',
                FechaNacimiento: '',
                IdSexo: sexos[0]?.Id || 0,
                IdRole: 2,
                IdGrado: grados[0]?.Id || 0,
                IdTurno: turnos[0]?.Id || 0,
                IdEncargado: encargados[0]?.Id || 0,
                IdTipoDocumento: 2, // Fijo en "NIE"
                NumDocumento: '',
                EsBecado: false,
                IdPadrino: null
            });
            onCreateSuccess();
        } catch (error: any) {
            setError(error.message || "Error al crear el alumno");
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
                        value={alumnoData.Nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Apellido</label>
                    <input
                        type="text"
                        name="Apellido"
                        value={alumnoData.Apellido}
                        onChange={handleChange}
                        placeholder="Apellido"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        name="FechaNacimiento"
                        value={alumnoData.FechaNacimiento}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Sexo</label>
                    <select
                        name="IdSexo"
                        value={alumnoData.IdSexo}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
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
                        value={alumnoData.IdGrado}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
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
                        value={alumnoData.IdTurno}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
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
                        value={alumnoData.IdEncargado}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
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
                    <label className="block text-gray-700">Tipo de Documento</label>
                    <input
                        type="text"
                        value="NIE"
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Número de Documento</label>
                    <input
                        type="text"
                        name="NumDocumento"
                        value={alumnoData.NumDocumento}
                        onChange={handleChange}
                        placeholder="Número de Documento"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="col-span-3">
                    <label className="block text-gray-700">Becado</label>
                    <input
                        type="checkbox"
                        name="EsBecado"
                        checked={alumnoData.EsBecado}
                        onChange={handleChange}
                        className="mr-2"
                    />
                </div>
                {alumnoData.EsBecado && (
                    <div className="col-span-3">
                        <label className="block text-gray-700">Padrino</label>
                        <select
                            name="IdPadrino"
                            value={alumnoData.IdPadrino ?? ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
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

            <div className="flex justify-center">
                <button type="submit" className="flex items-center justify-center w-2/3 gap-2 bg-bgAzul text-white py-2 rounded-lg mt-6 ">
                    <FaUserPlus className="text-lg" /> {/* Ajusta el tamaño del ícono si es necesario */}
                    <span>Crear Alumno</span>
                </button>
            </div>

        </form>
    );
};

export default CreateAlumnoForm;
