"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
exports.validarToken = validarToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const keySecret = process.env.JWT_SECRET_KEY || "";
function createToken(data) {
    return jsonwebtoken_1.default.sign(data, keySecret, { expiresIn: "1h" });
}
function validarToken(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token)
            res.redirect("/login");
        const validPaylod = jsonwebtoken_1.default.verify(token, keySecret);
        console.log(validPaylod);
        next();
    }
    catch (err) {
        res.redirect("/login");
    }
}
