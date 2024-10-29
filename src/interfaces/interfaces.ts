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


export interface InfoMessage {
    nombre: string,
    apellido: string,
    correo: string,
    cantidad: number,
    fecha: string,
    hora: string,
    mesa: number
}

declare module 'express' {
    export interface Request {
      user?: UserInfo | JwtPayload;
    }
  }
  