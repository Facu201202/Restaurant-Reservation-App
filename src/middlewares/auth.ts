import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import path from 'path';
import { UserInfo } from "../interfaces/interfaces";
import { Request, Response, NextFunction } from "express";

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const keySecret = process.env.JWT_SECRET_KEY || ""
const keyAdminSecret = process.env.JWT_SECRET_ADMIN_KEY || ""

export function createToken(data: UserInfo): string {
    return jwt.sign(data, keySecret, { expiresIn: "1h" })
}

export function createAdminToken(data:UserInfo): string {
    return jwt.sign(data, keyAdminSecret, { expiresIn: "1h"})
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

export function validarAdminToken(req: Request, res: Response, next: NextFunction): void {
    try{
        const token = req.cookies.jwt;
        if(!token) throw new Error("token no proporcionado")

        const validPaylod = jwt.verify(token, keyAdminSecret) as JwtPayload
        req.user = validPaylod
        next()
        
    }catch(err){
        res.redirect("/login")
    }
}