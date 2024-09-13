import { Response, Request } from "express";
import { agregar } from "../config/db";
import { Usuario } from "../interfaces/interfaces";

export const createUser = async (req: Request, res: Response): Promise<Response>  => {
    try{
        const newUser: Usuario  = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            correo: req.body.correo,
            contraseña: req.body.contraseña,
            rol: "usuario"
        }

        const nuevo =  await agregar(newUser);

        return res.status(200).send({
            message: "Usuario creado con exito",
            status: nuevo
        })

    }catch(err){
        return res.status(500).send({
            message: "Error en la base de datos",
            Error: err
        })
    }
}