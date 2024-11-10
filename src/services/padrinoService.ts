import axios from 'axios';
import Cookies from 'js-cookie';  // Importamos js-cookie para acceder a las cookies
import { Padrino, PadrinoCreate } from '../interfaces/Padrino';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Servicio para obtener todos los padrinos
export const getPadrinos = async (): Promise<Padrino[]> => {
    const token = Cookies.get('token');  // Obtenemos el token de las cookies
    const response = await axios.get(`${API_URL}/padrinos`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log(response.data);
    return response.data;
};

// Servicio para crear un nuevo padrino
export const createPadrino = async (padrinoData: PadrinoCreate): Promise<void> => {
    const token = Cookies.get('token');  // Obtenemos el token de las cookies
    await axios.post(`${API_URL}/padrinos`, padrinoData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};
