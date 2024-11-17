export interface DetallesAuditoria {
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Correo: string;
    DireccionNombre: string; // Nombre en lugar de Id
    RoleNombre: string;       // Nombre del rol
    ParentezcoNombre: string; // Nombre del parentezco
    TipoDocumentoNombre: string; // Tipo de documento
    NumDocumento: string;
}


export interface AuditoriaEncargado {
    Id: number;
    FechaHora: string;
    IdUsuario: number;
    UsuarioNombre: string;
    Operacion: string;
    IdRegistro: number;
    Detalles: DetallesAuditoria | { // En caso de operación `UPDATE`
        Antiguo: DetallesAuditoria;
        Nuevo: DetallesAuditoria;
    };
}
