// src/services/padrinoService.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { Padrino, PadrinoCreate } from '../interfaces/Padrino';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = Cookies.get('token');

// Servicio para obtener todos los padrinos
export const getPadrinos = async (): Promise<Padrino[]> => {
    const response = await axios.get(`${API_URL}/padrinos`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Servicio para crear un nuevo padrino
export const createPadrino = async (padrinoData: PadrinoCreate): Promise<void> => {
    await axios.post(`${API_URL}/padrinos`, padrinoData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


export const updatePadrino = async (id: number, padrinoData: Partial<PadrinoCreate>): Promise<void> => {
    const token = Cookies.get('token');
    if (!token) {
        throw new Error("No se encontró el token de autenticación");
    }

    await axios.put(`${API_URL}/padrinos/${id}`, padrinoData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};
// Servicio para eliminar un padrino
export const deletePadrino = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/padrinos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
