// Interfaz para obtener los datos de un Padrino
export interface Padrino {
    Id: number;
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Correo: string;
    RoleName: string;         // Nombre del rol (string)
    AdminName: string;        // Nombre del administrador (string)
    AdminLastName: string;    // Apellido del administrador (string)
    RegistrationDate: string; // Fecha de registro como string
}

// Interfaz para crear un nuevo Padrino
export interface PadrinoCreate {
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Correo: string;
    IdRole: number;           // ID del rol (número)
    IdAdministrador?: number; // ID del administrador (número)
}
