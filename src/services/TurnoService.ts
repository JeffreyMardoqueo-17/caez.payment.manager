import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = Cookies.get('token');

export interface Turno {
    Id: number;
    Nombre: string;
}

export const getTurnos = async (): Promise<Turno[]> => {
    const response = await axios.get(`${API_URL}/Turnos`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Servicio para obtener un alumno por su ID
export const getTurnosById = async (id: number): Promise<Turno> => {
    const response = await axios.get(`${API_URL}/Turnos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
