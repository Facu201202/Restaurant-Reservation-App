"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.updateReserve = exports.reserveToday = exports.bajaReserva = exports.verReservas = exports.altaReserva = exports.logout = exports.findReservas = exports.getTable = exports.modifyUser = exports.findUser = exports.createUser = void 0;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middlewares/auth");
/*import { messageAltaReserva } from "../helpers/mailer";*/
/*Funcion para crear un usuario encriptado */
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcryptjs_1.default.genSalt(5);
        const hashPassword = yield bcryptjs_1.default.hash(req.body.contraseña, salt);
        const newUser = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            usuario: req.body.usuario,
            correo: req.body.correo,
            contrasenia: hashPassword,
            rol: "usuario"
        };
        console.log(newUser);
        if (!newUser.nombre || !newUser.apellido || !newUser.correo || !newUser.contrasenia) {
            throw new Error("campo imcompleto");
        }
        const nuevo = yield (0, db_1.agregar)(newUser);
        console.log(nuevo);
        return res.status(200).send({
            message: "Usuario creado con exito",
            status: nuevo,
            redirect: "/login"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Error en la base de datos",
            Error: err
        });
    }
});
exports.createUser = createUser;
const findUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, db_1.traerUno)(req.body.usuario);
        if (!user || user.length === 0) {
            return res.status(401).send({
                message: "Usuario no encontrado"
            });
        }
        const rol = user[0].rol === "usuario" ? 2 : 1;
        const userInfo = {
            usuario: user[0].usuario,
            contraseña: user[0].contrasenia,
            scope: rol
        };
        const checkPassword = yield bcryptjs_1.default.compare(req.body.contraseña, userInfo.contraseña);
        const checkUser = req.body.usuario === userInfo.usuario;
        if (!checkUser) {
            return res.status(401).send({
                message: "Usuario no encontrado"
            });
        }
        if (!checkPassword) {
            return res.status(401).send({
                message: "Contraseña incorrecta"
            });
        }
        //Define que tipo de rol lleva el token
        let token;
        let redirect;
        if (rol === 2) {
            token = (0, auth_1.createToken)(userInfo);
            redirect = "/user";
        }
        else {
            token = (0, auth_1.createAdminToken)(userInfo);
            redirect = "/adminToday";
        }
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
        });
        //retorna el estado de la peticion mas la ubicacion de redireccionamiento
        return res.status(200).send({
            message: "Login correcto",
            redirect: redirect
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({
            message: "Error en la autenticación",
        });
    }
});
exports.findUser = findUser;
const modifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, nombre, apellido, correo, usuario, contraseña } = req.body.data;
        console.log(id, nombre, apellido, correo, usuario, contraseña);
        if (contraseña) {
            const salt = yield bcryptjs_1.default.genSalt(5);
            const hashPassword = yield bcryptjs_1.default.hash(contraseña, salt);
            yield (0, db_1.actualizarUsuario)(Number(id), nombre, apellido, correo, usuario, hashPassword);
        }
        else {
            yield (0, db_1.actualizarUsuario)(Number(id), nombre, apellido, correo, usuario, contraseña);
        }
        return res.status(200).send({
            message: "Usuario modificado con exito"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({
            message: "Error interno al modificar usuario"
        });
    }
});
exports.modifyUser = modifyUser;
/*Funcion para traer los horarios totales*/
const getTable = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hours = yield (0, db_1.traerTodo)("horas");
    return res.status(200).send({
        message: "Horarios encontrados",
        hours: hours
    });
});
exports.getTable = getTable;
/*Funcion para traer las reservas, mesas y horarios para luego identificar que horarios no van a estar disponibles*/
const findReservas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservas = yield (0, db_1.encontrarReservas)(req.body.fecha);
        const mesas = yield (0, db_1.encontrarMesas)(req.body.cantidad);
        const hours = yield (0, db_1.traerTodo)("horas");
        const noDisponible = disponibilidad(reservas, mesas);
        const blockHours = disableHours(hours, noDisponible);
        return res.status(200).send({
            message: "Reservas encontradas",
            mesasNoDisponibles: blockHours
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Error al buscar reservas",
            error: err
        });
    }
});
exports.findReservas = findReservas;
/*Funcion para cerrar sesion*/
const logout = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('jwt', '', { expires: new Date(0), httpOnly: true, path: '/' });
    res.status(200).send({
        message: "Logout exitoso",
        redirect: "/login"
    });
});
exports.logout = logout;
const AgruparPorHora = (reservas, mesas) => {
    // Agrupar reservas por hora
    const gruposPorHora = reservas.reduce((acumulador, reserva) => {
        if (!acumulador[reserva.hora_detalle]) {
            acumulador[reserva.hora_detalle] = [];
        }
        acumulador[reserva.hora_detalle].push(reserva);
        return acumulador;
    }, {});
    const idMesas = mesas.map((element) => element.id_mesa);
    return { gruposPorHora, idMesas };
};
/*Funcion que agrupa las reservas por hora para luego identificar los horarios no disponibles y retornarlos*/
const disponibilidad = (reservas, mesas) => {
    const AgruparHora = AgruparPorHora(reservas, mesas);
    const { gruposPorHora, idMesas } = AgruparHora;
    const horasNoDisponibles = [];
    Object.keys(gruposPorHora).forEach(hora => {
        const grupo = gruposPorHora[hora];
        const noDisponible = idMesas.every(idMesa => grupo.some((reserva) => reserva.id_mesa === idMesa));
        if (noDisponible) {
            horasNoDisponibles.push(hora);
        }
    });
    return horasNoDisponibles;
};
/*Funcion que toma las horas no disponibles y bloquea las proximas dos, devuelve un array con todos estos*/
const disableHours = (allHours, notAvailableHours) => {
    const blockHours = [];
    allHours.forEach((hour, index) => {
        if (notAvailableHours.includes(hour.hora)) {
            for (let i = 0; i <= 4; i++) {
                if (hour.hora[0] === "19" && allHours[index - 1].hora[0] === "10") {
                    break;
                }
                else {
                    blockHours.push(allHours[index + i].hora);
                }
            }
        }
    });
    return blockHours;
};
const mesasDisponibles = (hora, mesas, reservas) => {
    const reservasEnHora = reservas[hora];
    if (!reservasEnHora) {
        return mesas;
    }
    const mesasReservadas = reservasEnHora.map((reserva) => reserva.id_mesa);
    return mesas.filter((idMesa) => !mesasReservadas.includes(idMesa));
};
const altaReserva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fecha, cantidad, hora } = req.body;
        const mesas = yield (0, db_1.encontrarMesas)(cantidad);
        const reservas = yield (0, db_1.encontrarReservas)(fecha);
        const user = yield (0, db_1.traerUno)((_a = req.user) === null || _a === void 0 ? void 0 : _a.usuario);
        const AgruparHora = AgruparPorHora(reservas, mesas);
        const { gruposPorHora, idMesas } = AgruparHora;
        const mesasLibres = mesasDisponibles(hora.hora, idMesas, gruposPorHora);
        const fechaActual = new Date();
        fechaActual.setDate(fechaActual.getDate() + 1);
        const fechaReserva = new Date(fecha);
        if (fechaActual > fechaReserva)
            throw new Error("La fecha de reserva debe tener al menos un dia de antelacion");
        if (cantidad > 6 || cantidad < 1)
            throw new Error("La cantidad seleccionada se encuentra fuera del rango permitido");
        const reserva = {
            id_usuario: user[0].id_usuario,
            id_mesa: mesasLibres[0],
            cantidad: cantidad,
            fecha: fecha,
            hora: hora.id_hora,
            estado: "Pendiente"
        };
        /* const createInfoMessage: InfoMessage = {
             nombre: user[0].nombre,
             apellido: user[0].apellido,
             correo: user[0].correo,
             cantidad: cantidad,
             fecha: fecha,
             hora: hora.hora,
             mesa: mesasLibres[0]
         }
 
         const mail = await messageAltaReserva(createInfoMessage)
         console.log(mail)*/
        yield (0, db_1.agregarReserva)(reserva);
        return res.status(200).send({
            message: "Reserva realizada con exito"
        });
    }
    catch (err) {
        return res.status(500).send({
            message: "Error al realizar la reserva" + err
        });
    }
});
exports.altaReserva = altaReserva;
const verReservas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield (0, db_1.traerUno)((_a = req.user) === null || _a === void 0 ? void 0 : _a.usuario);
        const userReserves = yield (0, db_1.buscarReservas)(user[0].id_usuario);
        return res.status(200).send({
            message: "reservas encontradas",
            reservas: userReserves
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Error al buscar reservas", err
        });
    }
});
exports.verReservas = verReservas;
const bajaReserva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reserva = req.body.id;
        yield (0, db_1.eliminarReserva)(reserva);
        return res.status(200).send({
            message: "Reserva eliminada con exito"
        });
    }
    catch (err) {
        return res.status(500).send({
            message: "Error al borrar reserva:" + err
        });
    }
});
exports.bajaReserva = bajaReserva;
const reserveToday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fecha = req.body.date;
        const reservas = yield (0, db_1.encontrarReservas)(fecha);
        let totalReservas = reservas.map(reserva => ({
            id: reserva.id_reserva,
            hora: reserva.hora_detalle,
            nombre: reserva.nombre,
            apellido: reserva.apellido,
            mesa: reserva.id_mesa,
            cantidad: reserva.cantidad,
            estado: reserva.estado
        }));
        return res.status(200).send({
            message: `Reservas del dia ${fecha}`,
            today: totalReservas
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Error a buscar reservas del dia",
            Error: err
        });
    }
});
exports.reserveToday = reserveToday;
const updateReserve = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.actualizarReserva)(req.body.id, req.body.status);
        return res.status(200).send({
            message: "Reserva modificada con exito"
        });
    }
    catch (err) {
        return res.status(500).send({
            message: "Error al modificar la reserva" + err
        });
    }
});
exports.updateReserve = updateReserve;
const getUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, db_1.traerTodo)("usuarios");
        return res.status(200).send({
            message: "Usuarios encontrados",
            users: users
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Error al encotrar los usuarios"
        });
    }
});
exports.getUsers = getUsers;
