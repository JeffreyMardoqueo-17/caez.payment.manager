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
  Sexo: string;
  RoleName: string;
  Grado: string;
  Turno: string;
  EncargadoNombre: string;
  EncargadoApellido: string;
  TipoDocumento: string;
  NumDocumento: string;
  EsBecado: boolean;
  PadrinoNombre: string | null;
  PadrinoApellido: string | null;
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
  FechaNacimiento: string;
  IdSexo: number;
  IdRole: number;
  IdGrado: number;
  IdTurno: number;
  IdEncargado: number;
  IdTipoDocumento: number;
  NumDocumento: string;
  EsBecado: boolean;
  IdPadrino: number | null; //en caso de ser becaso se llena esto, si no se manda como nulo
}