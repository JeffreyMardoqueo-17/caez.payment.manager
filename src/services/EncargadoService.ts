// src/services/EncargadoService.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { Encargado, EncargadoCreate } from '../interfaces/Encargado';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = Cookies.get('token');

// Servicio para obtener todos los encargados
export const getEncargados = async (): Promise<Encargado[]> => {
    const response = await axios.get(`${API_URL}/encargados`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Servicio para obtener un encargado por su ID
export const getEncargadoById = async (id: number): Promise<Encargado> => {
    const response = await axios.get(`${API_URL}/encargados/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Servicio para crear un nuevo encargado
export const createEncargado = async (encargadoData: EncargadoCreate): Promise<void> => {
    try {
        await axios.post(`${API_URL}/encargados`, encargadoData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        // Capturamos el mensaje de error y lo lanzamos para ser gestionado en el frontend
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data.msg || "Error desconocido al crear el encargado");
        } else {
            throw new Error("Error al conectar con el servidor");
        }
    }
}

// Servicio para actualizar un encargado
export const updateEncargado = async (id: number, encargadoData: Partial<EncargadoCreate>): Promise<void> => {
    await axios.put(`${API_URL}/encargados/${id}`, encargadoData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Servicio para eliminar un encargado
export const deleteEncargado = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/encargados/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
