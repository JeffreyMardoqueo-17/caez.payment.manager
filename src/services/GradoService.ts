import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = Cookies.get('token');

export interface Grado {
    Id: number;
    Nombre: string;
}

export const getGrados = async (): Promise<Grado[]> => {
    const response = await axios.get(`${API_URL}/Grados`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Servicio para obtener un alumno por su ID
export const getGradosById = async (id: number): Promise<Grado> => {
    const response = await axios.get(`${API_URL}/Grados/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
