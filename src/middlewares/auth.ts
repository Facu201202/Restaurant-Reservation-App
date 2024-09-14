import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import path from 'path';
import { UserInfo } from "../interfaces/interfaces";
import { Request, Response, NextFunction } from "express";

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const keySecret = process.env.JWT_SECRET_KEY || ""

export function createToken(data: UserInfo) {
    return jwt.sign(data, keySecret, { expiresIn: "1h" })
}


export function validarToken(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = req.cookies.jwt;
        if (!token) res.status(403).json({ mensaje: "Acceso denegado: No se proporcionó token" });

        const validPaylod = jwt.verify(token, keySecret)
        console.log(validPaylod)
        next()

    } catch (err) {
        res.status(401).json({
            message: "TOken invalido",
            error: err
        })
    }





}