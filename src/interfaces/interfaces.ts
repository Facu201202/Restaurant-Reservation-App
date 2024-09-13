export interface Usuario {
    id?: number,
    nombre: string,
    apellido: string,
    correo: string,
    contraseña: string,
    rol: "usuario" | "admin"
}

