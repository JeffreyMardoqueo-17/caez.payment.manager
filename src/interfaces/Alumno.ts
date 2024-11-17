// para obtener todos los alumnos
/**
 * [
  {
    "Id": 1,
    "Nombre": "Miguel",
    "Apellido": "Ramirez",
    "FechaNacimiento": "2008-05-10T00:00:00.000Z",
    "Sexo": "Masculino",
    "RoleName": "Estudiante",
    "Grado": "2° Grado",
    "Turno": "Mañana",
    "EncargadoNombre": "Jeffrey",
    "EncargadoApellido": "jIMENEZZ ",
    "TipoDocumento": "DUI",
    "NumDocumento": "11223345",
    "EsBecado": false,
    "PadrinoNombre": null,
    "PadrinoApellido": null,
    "AdminName": "Mardoqueo",
    "AdminLastName": "Jimenez",
    "RegistrationDate": "2024-11-12T19:20:04.050Z"
  }
]
 */
export interface AlumnoGet {
  Id: number;
  Nombre: string;
  Apellido: string;
  FechaNacimiento: string;
  Sexo: string; // Ejemplo: "Masculino"
  RoleName: string; // Ejemplo: "Estudiante"
  Grado: string; // Ejemplo: "2° Grado"
  Turno: string; // Ejemplo: "Mañana"
  EncargadoNombre: string;
  EncargadoApellido: string;
  TipoDocumento: string; // Ejemplo: "DUI"
  NumDocumento: string;
  EsBecado: boolean;
  PadrinoNombre?: string | null;
  PadrinoApellido?: string | null;
  AdminName: string;
  AdminLastName: string;
  RegistrationDate: string;
}

/**
 * {
    "Nombre": "Miguel",
    "Apellido": "Ramirez",
    "FechaNacimiento": "2008-05-10T00:00:00Z",
    "IdSexo": 2,
    "IdRole": 2,
    "IdGrado": 3,
    "IdTurno": 1,
    "IdEncargado": 4,
    "IdTipoDocumento": 1,
    "NumDocumento": "11223345",
    "EsBecado": false
    "PadrinoNombre": number | null,
}

 */
export interface AlumnoPost {
  Nombre: string;
  Apellido: string;
  FechaNacimiento: string; // Formato: "YYYY-MM-DD"
  IdSexo: number;
  IdRole: number;
  IdGrado: number;
  IdTurno: number;
  IdEncargado: number;
  IdTipoDocumento: number;
  NumDocumento: string;
  EsBecado: boolean;
  IdPadrino?: number | null; // Opcional si no es becado
}