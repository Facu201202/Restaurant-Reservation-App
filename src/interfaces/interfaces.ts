import { JwtPayload } from 'jsonwebtoken';

export interface Usuario {
    id_usuario?: number,
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

export interface Reserva {
    id_usuario? : number,
    id_mesa: number,
    cantidad: number,
    fecha: string,
    hora: number,
    estado: "pendiente" | "aprobada" | "cancelada"
}

declare module 'express' {
    export interface Request {
      user?: UserInfo | JwtPayload;
    }
  }