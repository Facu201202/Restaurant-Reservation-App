import jwt, { JwtPayload } from "jsonwebtoken"
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
        if (!token) res.redirect("/login")

        const validPaylod = jwt.verify(token, keySecret) as JwtPayload
        req.user = validPaylod
        next()

    } catch (err) {
        return res.redirect("/login")
    }

}