import axios from 'axios';
import Cookies from 'js-cookie';  // Importamos js-cookie para acceder a las cookies
import { Role } from '@/interfaces/Role';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getRoles = async (): Promise<Role[]> => {
    try {
        const token = Cookies.get('token');  // Obtenemos el token de las cookies
        const response = await axios.get(`${apiBaseUrl}/role`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener roles:", error);
        throw new Error("No se pudieron obtener los roles");
    }
};
