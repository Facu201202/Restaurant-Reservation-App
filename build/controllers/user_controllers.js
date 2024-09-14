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
exports.findUser = exports.createUser = void 0;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middlewares/auth");
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
        if (!newUser.nombre || !newUser.apellido || !newUser.correo || !newUser.contrasenia) {
            throw new Error("campo imcompleto");
        }
        const nuevo = yield (0, db_1.agregar)(newUser);
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
        const userInfo = {
            usuario: user[0].usuario,
            contraseña: user[0].contrasenia,
            rol: user[0].rol
        };
        const checkPassword = yield bcryptjs_1.default.compare(req.body.contraseña, userInfo.contraseña);
        const checkUser = req.body.usuario === userInfo.usuario;
        if (!checkPassword && !checkUser) {
            throw new Error("Datos invalidos");
        }
        const token = (0, auth_1.createToken)(userInfo);
        res.cookie("jwt", token, {
            httpOnly: true
        });
        return res.status(200).send({
            message: "login correcto",
            redirect: "/user"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Error los datos son incorrectos",
            error: err
        });
    }
});
exports.findUser = findUser;
