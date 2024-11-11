import axios from 'axios';
import { AuditoriaEncargado } from '@/interfaces/AuditoriaEncargado';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = Cookies.get('token');

// Obtener todos los registros de auditoría
export const getAllAuditoria = async (): Promise<AuditoriaEncargado[]> => {
    const response = await axios.get(`${API_URL}/auditoria-encargado`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Obtener registros de auditoría por rango de fechas
export const getAuditoriaByDateRange = async (startDate: string, endDate: string): Promise<AuditoriaEncargado[]> => {
    const response = await axios.get(`${API_URL}/auditoria-encargado/fecha`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate }
    });
    return response.data;
};
