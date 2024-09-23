"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traerUno = traerUno;
exports.agregar = agregar;
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
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