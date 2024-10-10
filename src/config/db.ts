import mysql, { OkPacket } from 'mysql';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

import { Usuario } from '../interfaces/interfaces';



const connection: mysql.Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err) => {
    if (err) {
        console.log("Error al conectarse a la base de datos", err)
        process.exit(1)
    } else {
        console.log("conexion exitosa")
    }
})


export function traerUno(data: string): Promise<Usuario[]> {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM usuarios WHERE usuario = ?`, data, (error, result) => {
            error ? reject(error) : resolve(result);
        })
    })
}


export function agregar(data: Usuario): Promise<OkPacket> {
    return new Promise((resolve, reject) => {
        const values = [data.nombre, data.apellido, data.usuario, data.correo, data.contrasenia, data.rol]
        connection.query(`INSERT INTO usuarios (nombre, apellido, usuario, correo, contrasenia, rol) VALUES (?, ?, ?, ?, ?, ?)`, values, (error, result) => {
            error ? reject(error) : resolve(result)
        })
    })
}

export function traerTodo(tabla: string): Promise<OkPacket> {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${tabla}`, (error, result) => {
            error ? reject(error) : resolve(result);
        })
    })
}

export function encontrarReservas(fecha: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const query = `
                SELECT reservas_realizadas.*, horas.hora AS hora_detalle 
                FROM reservas_realizadas 
                JOIN horas ON reservas_realizadas.hora = horas.id_hora 
                WHERE reservas_realizadas.fecha = ?
            `

        connection.query(query, fecha, (error, result) => {
            error ? reject(error) : resolve(result);
        })
    })
}

export function encontrarMesas(cantidad: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM mesas WHERE cantidad_min = ? OR cantidad_max = ?`,[cantidad, cantidad], (error, result) =>{
            error ? reject(error) : resolve(result);
        })
    })
}