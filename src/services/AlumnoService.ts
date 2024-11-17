// src/services/AlumnoService.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { AlumnoGet, AlumnoPost } from '../interfaces/Alumno';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = Cookies.get('token');

// Servicio para obtener todos los alumnos
export const getAlumnos = async (): Promise<AlumnoGet[]> => {
    const response = await axios.get(`${API_URL}/alumnos`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Servicio para obtener un alumno por su ID
export const getAlumnoById = async (id: number): Promise<AlumnoGet> => {
    const response = await axios.get(`${API_URL}/alumnos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Servicio para obtener un alumno por numero de documento
export const getAlumnoByNumDocumento = async (numDocumento: string): Promise<AlumnoGet> => {
    const response = await axios.get(`${API_URL}/alumnos/numDocumento/${numDocumento}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Servicio para crear un nuevo alumno
export const createAlumno = async (alumnoData: AlumnoPost): Promise<void> => {
    try {
        await axios.post(`${API_URL}/alumnos`, alumnoData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data.msg || "Error desconocido al crear el alumno");
        } else {
            throw new Error("Error al conectar con el servidor");
        }
    }
}

export const updateAlumno = async (id: number, data: AlumnoPost): Promise<void> => {
    try {
        await axios.put(`${API_URL}/alumnos/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error: any) {
        console.error('Error en el servicio de actualización:', error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al actualizar el alumno');
    }
};
export const deleteAlumno = async (id: number): Promise<void> => {
    if (!token) {
        throw new Error("No se encontró el token de autenticación");
    }

    try {
        await axios.delete(`${API_URL}/alumnos/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.msg || "Error al eliminar el alumno");
        } else {
            throw new Error("Error al conectar con el servidor");
        }
    }
};