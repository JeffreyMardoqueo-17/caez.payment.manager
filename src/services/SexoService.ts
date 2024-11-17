import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = Cookies.get('token');

export interface Sexo {
    Id: number;
    Nombre: string;
}

export const getSexos = async (): Promise<Sexo[]> => {
    const response = await axios.get(`${API_URL}/sexos`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Servicio para obtener un alumno por su ID
export const getSexosById = async (id: number): Promise<Sexo> => {
    const response = await axios.get(`${API_URL}/sexos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
