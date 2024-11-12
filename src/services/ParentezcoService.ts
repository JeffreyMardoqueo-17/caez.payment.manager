import axios from 'axios';
import Cookies from 'js-cookie';  // Importamos js-cookie para acceder a las cookies
import { Parentezco } from '@/interfaces/Parentezco';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getParentezcos = async (): Promise<Parentezco[]> => {
    try {
        const token = Cookies.get('token');  // Obtenemos el token de las cookies
        const response = await axios.get(`${apiBaseUrl}/parentezcos`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los parentezcos:", error);
        throw new Error("No se pudieron obtener los parentezcos");
    }
};
