import axios from 'axios';
import Cookies from 'js-cookie';  // Importamos js-cookie para acceder a las cookies
import { Direccion } from '@/interfaces/Direccion';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getDirecciones = async (): Promise<Direccion[]> => {
    try {
        const token = Cookies.get('token');  // Obtenemos el token de las cookies
        const response = await axios.get(`${apiBaseUrl}/direcciones`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener las direcciones:", error);
        throw new Error("No se pudieron obtener las direcciones");
    }
};
