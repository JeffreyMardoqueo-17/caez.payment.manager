export interface Encargado {
    Id: number;
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Correo: string;
    Direccion: string;
    RoleName: string;
    Parentezco: string;
    TipoDocumento: string;
    NumDocumento: string;
    AdminName: string;
    AdminLastName: string;
    RegistrationDate: string;
}

// INTERFAZ PARA CREAR NUEVOS ENCARGADOS
export interface EncargadoCreate {
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Correo: string;
    IdDireccion: number;
    IdRole: number;
    IdParentezco: number;
    IdTipoDocumento: number;
    NumDocumento: string;
}
