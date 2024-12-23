"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traerUno = traerUno;
exports.agregar = agregar;
exports.traerTodo = traerTodo;
exports.encontrarReservas = encontrarReservas;
exports.encontrarMesas = encontrarMesas;
exports.agregarReserva = agregarReserva;
exports.buscarReservas = buscarReservas;
exports.eliminarReserva = eliminarReserva;
exports.actualizarReserva = actualizarReserva;
exports.actualizarUsuario = actualizarUsuario;
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
console.log('Conectando a la base de datos:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`User: ${process.env.DB_USER}`);
console.log(`Database: ${process.env.DB_NAME}`);
const connection = mysql_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
connection.connect((err) => {
    if (err) {
        console.log("Error al conectarse a la base de datos", err);
        process.exit(1);
    }
    else {
        console.log("conexion exitosa");
    }
});
function traerUno(data) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM usuarios WHERE usuario = ?`, data, (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
function agregar(data) {
    return new Promise((resolve, reject) => {
        const values = [data.nombre, data.apellido, data.usuario, data.correo, data.contrasenia, data.rol];
        connection.query(`INSERT INTO usuarios (nombre, apellido, usuario, correo, contrasenia, rol) VALUES (?, ?, ?, ?, ?, ?)`, values, (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
function traerTodo(tabla) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${tabla}`, (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
function encontrarReservas(fecha) {
    return new Promise((resolve, reject) => {
        const query = `
                SELECT reservas_realizadas.*, horas.hora AS hora_detalle, usuarios.nombre AS nombre, usuarios.apellido AS apellido
                FROM reservas_realizadas 
                JOIN horas ON reservas_realizadas.hora = horas.id_hora
                JOIN usuarios ON reservas_realizadas.id_usuario = usuarios.id_usuario
                WHERE reservas_realizadas.fecha = ?
            `;
        connection.query(query, fecha, (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
function encontrarMesas(cantidad) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM mesas WHERE cantidad_min = ? OR cantidad_max = ?`, [cantidad, cantidad], (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
function agregarReserva(reserva) {
    return new Promise((resolve, reject) => {
        const values = [reserva.id_usuario, reserva.id_mesa, reserva.cantidad, reserva.fecha, reserva.hora, reserva.estado];
        connection.query(`INSERT INTO reservas_realizadas (id_usuario, id_mesa, cantidad, fecha, hora, estado) VALUES (?, ?, ?, ?, ?, ?)`, values, (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
function buscarReservas(user) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT reservas_realizadas.*, horas.hora AS hora_detalle 
        FROM reservas_realizadas 
        JOIN horas ON reservas_realizadas.hora = horas.id_hora 
        WHERE reservas_realizadas.id_usuario = ?
    `;
        connection.query(query, user, (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
function eliminarReserva(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM reservas_realizadas WHERE id_reserva = ?', id, (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
function actualizarReserva(id, status) {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE reservas_realizadas SET estado = ? WHERE id_reserva = ?", [status, id], (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
function actualizarUsuario(id, nombre, apellido, correo, usuario, contraseña) {
    return new Promise((resolve, reject) => {
        let consultaSQL = "UPDATE usuarios SET nombre = ?, apellido = ?, usuario = ?, correo = ?";
        let params = [nombre, apellido, usuario, correo];
        if (contraseña) {
            consultaSQL += ', contrasenia = ?';
            params.push(contraseña);
        }
        consultaSQL += ' WHERE id_usuario = ?';
        params.push(id);
        connection.query(consultaSQL, params, (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
