import { Response, Request } from "express";
import { agregar, traerUno } from "../config/db";
import { Usuario, UserInfo } from "../interfaces/interfaces";
import bcryptjs from "bcryptjs"
import { createToken } from "../middlewares/auth";

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {

        const salt = await bcryptjs.genSalt(5);
        const hashPassword = await bcryptjs.hash(req.body.contraseña, salt);

        const newUser: Usuario = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            usuario: req.body.usuario,
            correo: req.body.correo,
            contrasenia: hashPassword,
            rol: "usuario"
        }


        if (!newUser.nombre || !newUser.apellido || !newUser.correo || !newUser.contrasenia) {
            throw new Error("campo imcompleto")
        }

        const nuevo = await agregar(newUser);

        return res.status(200).send({
            message: "Usuario creado con exito",
            status: nuevo,
            redirect: "/login"
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: "Error en la base de datos",
            Error: err
        })
    }
}


export const findUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await traerUno(req.body.usuario);

        const userInfo: UserInfo = {
            usuario: user[0].usuario,
            contraseña: user[0].contrasenia,
            rol: user[0].rol
        }

        const checkPassword = await bcryptjs.compare(req.body.contraseña, userInfo.contraseña)
        const checkUser = req.body.usuario === userInfo.usuario

        if (!checkPassword && !checkUser) {
            throw new Error("Datos invalidos")
        }


        const token = createToken(userInfo);

        res.cookie("jwt", token, {
            httpOnly: true
        })

        return res.status(200).send({
            message: "login correcto",
            redirect: "/user"
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: "Error los datos son incorrectos",
            error: err
        })
    }
}


export const logout = async (_req: Request, res: Response) => {

    res.cookie('jwt', '', { expires: new Date(0), httpOnly: true, path: '/' });
    res.status(200).send({
        message: "Logout exitoso",
        redirect: "/login"
    })
    
}