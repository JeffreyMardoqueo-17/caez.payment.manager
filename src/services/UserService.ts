import axios from "axios";
import Cookies from "js-cookie";
import { User } from "@/interfaces/User";

const API_URL = "http://localhost:9000";

export interface User {
    Id: number;
    Name: string;
    LastName: string;
    Login: string;
    Status: number; // Ejemplo: 1 para activo, 0 para inactivo
    RegistrationDate: string;
    RoleName: string; // Ejemplo: "Administrador"
}

export const getUsers = async (): Promise<User[]> => {
    const token = Cookies.get("token"); // Token de autorización
    const response = await axios.get(`${API_URL}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
