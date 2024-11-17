export interface User {
    Id: number;
    Name: string;
    LastName: string;
    Login: string;
    Status: number; // Ejemplo: 1 para activo, 0 para inactivo
    RegistrationDate: string;
    RoleName: string; // Ejemplo: "Administrador"
}
