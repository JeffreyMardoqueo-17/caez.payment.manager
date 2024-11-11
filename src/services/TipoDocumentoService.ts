import axios from 'axios';
import Cookies from 'js-cookie';  // Importamos js-cookie para acceder a las cookies
import { TipoDocumento } from '@/interfaces/TipoDocumento';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getTipoDocumento = async (): Promise<TipoDocumento[]> => {
    try {
        const token = Cookies.get('token');  // Obtenemos el token de las cookies
        const response = await axios.get(`${apiBaseUrl}/TiposDocumento`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los tipos de documentos:", error);
        throw new Error("No se pudieron obtener los tipos documenots");
    }
};
