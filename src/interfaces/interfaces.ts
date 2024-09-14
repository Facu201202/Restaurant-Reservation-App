export interface Usuario {
    id?: number,
    nombre: string,
    apellido: string,
    usuario: string,
    correo: string,
    contrasenia: string,
    rol: "usuario" | "admin"
}

export interface UserInfo {
    usuario: string,
    contraseña: string,
    rol: "usuario" | "admin"
}